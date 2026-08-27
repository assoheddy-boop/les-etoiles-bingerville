import { Resend } from "resend";
import { isProductionRuntime } from "./runtime";
import { school } from "./school";

const SEND_TIMEOUT_MS = 8_000;
const IDEMPOTENCY_TTL_MS = 30_000;
const DEV_FROM_FALLBACK = "Les Étoiles <beth.t@example.com>";
const DEFAULT_FROM_NAME = "Les Étoiles";

export type ParsedFrom = { name: string; email: string };

export type MailTag =
  | "contact"
  | "inscription"
  | "inscription-ack"
  | "message"
  | "homework"
  | "payment"
  | "parent-module"
  | "pickup";

export type SendMailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  tag: MailTag;
  replyTo?: string;
  /** Clé d’idempotence (id métier). Évite un double envoi sur le même POST. */
  id?: string;
};

export type MailResult = {
  status: "sent" | "skipped" | "failed";
  reason?: string;
};

export type EmailStatus = {
  configured: boolean;
  hasApiKey: boolean;
  hasFrom: boolean;
};

type RecentSend = { at: number };

const recentSends = new Map<string, RecentSend>();
let resendClient: Resend | null = null;
let resendKey: string | null = null;

function apiKey() {
  return process.env.RESEND_API_KEY?.trim() || "";
}

function envFrom() {
  return process.env.EMAIL_FROM?.trim() || "";
}

/** Parse « Nom <adresse@domaine> », « "Nom" <adresse> » ou une adresse seule. */
export function parseEmailFrom(raw: string): ParsedFrom | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const angle = trimmed.match(/^(.+?)\s*<([^>]+)>$/);
  if (angle) {
    const name = angle[1].replace(/^["']|["']$/g, "").trim();
    const email = angle[2].trim();
    if (!isValidEmail(email)) return null;
    return { name: name || DEFAULT_FROM_NAME, email };
  }

  if (isValidEmail(trimmed)) {
    return { name: DEFAULT_FROM_NAME, email: trimmed };
  }
  return null;
}

export function formatEmailFrom(parsed: ParsedFrom) {
  return `${parsed.name} <${parsed.email}>`;
}

export function normalizeEmailFrom(raw: string) {
  const parsed = parseEmailFrom(raw);
  return parsed ? formatEmailFrom(parsed) : null;
}

export function schoolInbox() {
  return process.env.EMAIL_TO_SCHOOL?.trim() || school.email;
}

export function fromAddress(): string | null {
  const configured = envFrom();
  if (configured) return normalizeEmailFrom(configured);
  if (isProductionRuntime()) return null;
  return DEV_FROM_FALLBACK;
}

export function emailStatus(): EmailStatus {
  const hasApiKey = Boolean(apiKey());
  const hasFrom = Boolean(fromAddress());
  return {
    hasApiKey,
    hasFrom,
    configured: Boolean(hasApiKey && hasFrom),
  };
}

export function isEmailConfigured() {
  return emailStatus().configured;
}

export function isValidEmail(value: string | undefined | null): value is string {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function normalizeEmail(value: string | undefined | null) {
  if (!isValidEmail(value)) return "";
  return value.trim();
}

function uniqueRecipients(to: string | string[]) {
  const list = (Array.isArray(to) ? to : [to]).map(normalizeEmail).filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const email of list) {
    const key = email.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(email);
  }
  return out;
}

function pruneRecentSends(now: number) {
  for (const [key, row] of recentSends) {
    if (now - row.at > IDEMPOTENCY_TTL_MS) recentSends.delete(key);
  }
}

function alreadySent(key: string) {
  const now = Date.now();
  pruneRecentSends(now);
  if (recentSends.has(key)) return true;
  recentSends.set(key, { at: now });
  return false;
}

function getClient() {
  const key = apiKey();
  if (!key) return null;
  if (!resendClient || resendKey !== key) {
    resendClient = new Resend(key);
    resendKey = key;
  }
  return resendClient;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(label)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export async function sendMail(input: SendMailInput): Promise<MailResult> {
  const recipients = uniqueRecipients(input.to);
  if (recipients.length === 0) {
    return { status: "skipped", reason: "no_recipient" };
  }

  const idempotencyKey = `${input.tag}|${input.id || input.subject}|${recipients.join(",").toLowerCase()}`;
  if (alreadySent(idempotencyKey)) {
    console.info("[email] skipped duplicate", { tag: input.tag, to: recipients });
    return { status: "skipped", reason: "duplicate" };
  }

  const status = emailStatus();
  if (!status.hasApiKey) {
    console.info("[email] skipped: RESEND_API_KEY missing", { tag: input.tag, to: recipients });
    return { status: "skipped", reason: "not_configured" };
  }

  const from = fromAddress();
  if (!from) {
    console.info("[email] skipped: EMAIL_FROM missing (required in production)", {
      tag: input.tag,
      to: recipients,
    });
    return { status: "skipped", reason: "not_configured" };
  }

  const client = getClient();
  if (!client) {
    console.info("[email] skipped: Resend client unavailable", { tag: input.tag });
    return { status: "skipped", reason: "not_configured" };
  }

  try {
    const payload = {
      from,
      to: recipients,
      subject: input.subject,
      html: input.html,
      text: input.text,
      tags: [{ name: "kind", value: input.tag }],
      ...(input.replyTo && isValidEmail(input.replyTo) ? { replyTo: input.replyTo.trim() } : {}),
    };
    const result = await withTimeout(
      client.emails.send(
        payload,
        input.id ? { idempotencyKey: `${input.tag}-${input.id}`.slice(0, 256) } : undefined,
      ),
      SEND_TIMEOUT_MS,
      "email_timeout",
    );
    if (result.error) {
      console.error("[email] Resend error", { tag: input.tag, to: recipients, error: result.error.message });
      return { status: "failed", reason: result.error.message };
    }
    console.info("[email] sent", { tag: input.tag, to: recipients, id: result.data?.id });
    return { status: "sent" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "send_failed";
    console.error("[email] send failed", { tag: input.tag, to: recipients, error: message });
    return { status: "failed", reason: message };
  }
}

export function summarizeMail(results: MailResult[]): MailResult {
  if (results.some((row) => row.status === "failed")) {
    return { status: "failed", reason: results.find((row) => row.status === "failed")?.reason };
  }
  if (results.some((row) => row.status === "sent")) {
    return { status: "sent" };
  }
  return results[0] ?? { status: "skipped", reason: "not_configured" };
}

export function publicMailHint(kind: "contact" | "inscription", result: MailResult) {
  const urgency = `En urgence : ${school.phones[0].display}`;
  if (result.status === "sent") {
    return kind === "inscription"
      ? `Demande enregistrée et e-mail envoyé au secrétariat. ${urgency}`
      : `Message enregistré et e-mail envoyé au secrétariat. ${urgency}`;
  }
  if (result.status === "failed") {
    return `Enregistré, mais l’e-mail automatique n’a pas pu partir (réessayez plus tard ou appelez). L’école a bien votre demande. ${urgency}`;
  }
  return `Enregistré. L’e-mail de confirmation peut être retardé (service non configuré) — le secrétariat vous recontacte. ${urgency}`;
}
