import { school } from "./school";
import { siteUrl } from "./seo";
import { formatDateFr } from "./utils";

const GREEN = "#1e5631";
const GREEN_DEEP = "#143d23";
const INK = "#1a1a1a";
const MUTED = "#5c6570";
const PAPER = "#f6f3ee";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function logoUrl() {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}${school.logoPath}`;
}

function portalUrl(path: string) {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function wrapHtml(title: string, innerRows: string) {
  const logo = logoUrl();
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};font-family:Arial,Helvetica,sans-serif;color:${INK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr>
            <td align="center" style="background:${GREEN};padding:20px 16px;">
              <img src="${escapeHtml(logo)}" alt="${escapeHtml(school.shortName)}" width="72" height="72" style="display:block;border:0;outline:none;margin:0 auto;" />
              <p style="margin:12px 0 0;font-size:18px;font-weight:bold;color:#ffffff;">${escapeHtml(school.name)}</p>
              <p style="margin:4px 0 0;font-size:13px;color:#e7f1ea;">Bingerville — Adjamé</p>
            </td>
          </tr>
          ${innerRows}
          <tr>
            <td style="padding:16px 24px 24px;font-size:12px;line-height:1.5;color:${MUTED};">
              ${escapeHtml(school.address)}<br />
              ${escapeHtml(school.phones[0].display)} · ${escapeHtml(school.email)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function bodyRow(html: string) {
  return `<tr><td style="padding:24px 24px 8px;font-size:15px;line-height:1.6;color:${INK};">${html}</td></tr>`;
}

function buttonRow(href: string, label: string) {
  return `<tr>
    <td style="padding:8px 24px 16px;">
      <a href="${escapeHtml(href)}" style="display:inline-block;background:${GREEN};color:#ffffff;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 20px;border-radius:999px;">${escapeHtml(label)}</a>
    </td>
  </tr>`;
}

function kv(label: string, value: string) {
  return `<p style="margin:0 0 10px;"><strong style="color:${GREEN_DEEP};">${escapeHtml(label)} :</strong> ${escapeHtml(value)}</p>`;
}

function paragraph(text: string) {
  return `<p style="margin:0 0 12px;">${escapeHtml(text)}</p>`;
}

export function contactSchoolEmail(input: {
  name: string;
  phone: string;
  email?: string;
  cycle?: string;
  message: string;
}) {
  const subject = `Contact site — ${input.name}`;
  const text = [
    `Nouveau message via le site ${school.name}.`,
    `Nom : ${input.name}`,
    `Téléphone : ${input.phone}`,
    input.email ? `E-mail : ${input.email}` : "",
    input.cycle ? `Cycle : ${input.cycle}` : "",
    "",
    input.message,
  ]
    .filter((line) => line !== "")
    .join("\n");
  const html = wrapHtml(
    subject,
    bodyRow(
      `${paragraph("Nouveau message reçu depuis le formulaire contact du site.")}${kv("Nom", input.name)}${kv("Téléphone", input.phone)}${input.email ? kv("E-mail", input.email) : ""}${input.cycle ? kv("Cycle", input.cycle) : ""}${kv("Message", input.message)}`,
    ),
  );
  return { subject, html, text };
}

export function inscriptionSchoolEmail(input: {
  name: string;
  phone: string;
  email?: string;
  cycle?: string;
  message: string;
}) {
  const subject = `Demande d’inscription — ${input.name}`;
  const text = [
    `Nouvelle demande d’inscription via le site ${school.name}.`,
    `Parent : ${input.name}`,
    `Téléphone : ${input.phone}`,
    input.email ? `E-mail : ${input.email}` : "",
    input.cycle ? `Cycle : ${input.cycle}` : "",
    "",
    input.message,
  ]
    .filter((line) => line !== "")
    .join("\n");
  const html = wrapHtml(
    subject,
    bodyRow(
      `${paragraph("Une famille a déposé une demande d’inscription en ligne. Le dossier est aussi dans Demandes (console direction).")}${kv("Parent", input.name)}${kv("Téléphone", input.phone)}${input.email ? kv("E-mail", input.email) : ""}${input.cycle ? kv("Cycle souhaité", input.cycle) : ""}${kv("Message", input.message)}`,
    ),
  );
  return { subject, html, text };
}

export function inscriptionAckEmail(input: { name: string; cycle?: string }) {
  const subject = `Les Étoiles — nous avons bien reçu votre demande d’inscription`;
  const text = [
    `Bonjour ${input.name},`,
    "",
    `Nous avons bien reçu votre demande d’inscription aux ${school.name} (Bingerville — Adjamé).`,
    input.cycle ? `Cycle indiqué : ${input.cycle}.` : "",
    "Le secrétariat vous recontacte. Aucun paiement n’est demandé en ligne.",
    "",
    `En urgence : ${school.phones[0].display}`,
    school.name,
  ]
    .filter(Boolean)
    .join("\n");
  const html = wrapHtml(
    subject,
    `${bodyRow(
      `${paragraph(`Bonjour ${input.name},`)}${paragraph(`Nous avons bien reçu votre demande d’inscription aux ${school.name}, à Bingerville — Adjamé.`)}${input.cycle ? kv("Cycle indiqué", input.cycle) : ""}${paragraph("Le secrétariat vous recontacte. Aucun paiement n’est demandé en ligne.")}`,
    )}${buttonRow(portalUrl("/contact"), "Contacter l’école")}`,
  );
  return { subject, html, text };
}

export function teacherMessageEmail(input: {
  parentName: string;
  studentName: string;
  senderName: string;
  content: string;
}) {
  const subject = `Les Étoiles — message concernant ${input.studentName}`;
  const text = [
    `Bonjour ${input.parentName},`,
    "",
    `${input.senderName} vous a écrit dans l’espace Les Étoiles au sujet de ${input.studentName} :`,
    "",
    input.content,
    "",
    `Ouvrir les messages : ${portalUrl("/espace-parents/messages")}`,
    school.name,
  ].join("\n");
  const html = wrapHtml(
    subject,
    `${bodyRow(
      `${paragraph(`Bonjour ${input.parentName},`)}${paragraph(`${input.senderName} vous a écrit au sujet de ${input.studentName}.`)}<p style="margin:0 0 12px;padding:12px 14px;background:${PAPER};border-radius:12px;">${escapeHtml(input.content)}</p>${paragraph("Retrouvez le fil complet dans votre espace parents.")}`,
    )}${buttonRow(portalUrl("/espace-parents/messages"), "Ouvrir les messages")}`,
  );
  return { subject, html, text };
}

export function homeworkEmail(input: {
  parentName: string;
  studentName: string;
  classLabel: string;
  title: string;
  description?: string;
  dueDate: string;
}) {
  const due = formatDateFr(input.dueDate);
  const subject = `Les Étoiles — nouveau devoir : ${input.title}`;
  const text = [
    `Bonjour ${input.parentName},`,
    "",
    `Un devoir a été publié pour ${input.studentName} (${input.classLabel}).`,
    `Titre : ${input.title}`,
    `À rendre le ${due}.`,
    input.description ? `\n${input.description}` : "",
    "",
    `Voir les devoirs : ${portalUrl("/espace-parents/devoirs")}`,
    school.name,
  ]
    .filter((line) => line !== "")
    .join("\n");
  const html = wrapHtml(
    subject,
    `${bodyRow(
      `${paragraph(`Bonjour ${input.parentName},`)}${paragraph(`Un devoir a été publié pour ${input.studentName} (${input.classLabel}).`)}${kv("Titre", input.title)}${kv("À rendre le", due)}${input.description ? paragraph(input.description) : ""}`,
    )}${buttonRow(portalUrl("/espace-parents/devoirs"), "Voir les devoirs")}`,
  );
  return { subject, html, text };
}

export function cashPaymentEmail(input: {
  parentName: string;
  amountLabel: string;
  dateLabel: string;
  studentName?: string;
}) {
  const subject = `Les Étoiles — paiement espèces validé (${input.amountLabel})`;
  const about = input.studentName ? ` concernant ${input.studentName}` : "";
  const text = [
    `Bonjour ${input.parentName},`,
    "",
    `Le secrétariat a validé un paiement en espèces${about} : ${input.amountLabel} (${input.dateLabel}).`,
    "Les paiements en ligne (Wave / Orange Money) ne sont pas encore branchés.",
    "",
    `Voir les échéances : ${portalUrl("/espace-parents/paiements")}`,
    school.name,
  ].join("\n");
  const html = wrapHtml(
    subject,
    `${bodyRow(
      `${paragraph(`Bonjour ${input.parentName},`)}${paragraph(`Le secrétariat a validé un paiement en espèces${about}.`)}${kv("Montant", input.amountLabel)}${kv("Date", input.dateLabel)}${paragraph("Les paiements en ligne (Wave / Orange Money) ne sont pas encore branchés.")}`,
    )}${buttonRow(portalUrl("/espace-parents/paiements"), "Voir les échéances")}`,
  );
  return { subject, html, text };
}

export function parentModuleEmail(input: { parentName: string }) {
  const subject = `Les Étoiles — votre espace parents est activé`;
  const text = [
    `Bonjour ${input.parentName},`,
    "",
    `L’espace parents des ${school.name} est maintenant activé pour votre famille.`,
    "Connectez-vous avec le matricule de l’élève (remis par le secrétariat) et votre mot de passe.",
    "",
    `Connexion : ${portalUrl("/connexion")}`,
    school.name,
  ].join("\n");
  const html = wrapHtml(
    subject,
    `${bodyRow(
      `${paragraph(`Bonjour ${input.parentName},`)}${paragraph(`L’espace parents des ${school.name} est maintenant activé pour votre famille.`)}${paragraph("Connectez-vous avec le matricule de l’élève (remis par le secrétariat) et votre mot de passe.")}`,
    )}${buttonRow(portalUrl("/connexion"), "Ouvrir l’espace parents")}`,
  );
  return { subject, html, text };
}

export function pickupCodeEmail(input: { parentName: string; studentName: string }) {
  const subject = `Les Étoiles — code de sortie du jour`;
  const text = [
    `Bonjour ${input.parentName},`,
    "",
    `Le code / QR de sortie du jour pour ${input.studentName} est disponible dans votre espace parents.`,
    "Présentez-le au vigile à la grille. Ne le transmettez pas à une personne non autorisée.",
    "",
    `Ouvrir : ${portalUrl("/espace-parents/sortie")}`,
    school.name,
  ].join("\n");
  const html = wrapHtml(
    subject,
    `${bodyRow(
      `${paragraph(`Bonjour ${input.parentName},`)}${paragraph(`Le code / QR de sortie du jour pour ${input.studentName} est disponible dans votre espace parents.`)}${paragraph("Présentez-le au vigile à la grille. Ne le transmettez pas à une personne non autorisée.")}`,
    )}${buttonRow(portalUrl("/espace-parents/sortie"), "Voir le code du jour")}`,
  );
  return { subject, html, text };
}
