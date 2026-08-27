import { PersistWriteError, readJsonDocument, writeJsonDocument } from "./persist";
import type { AiRole } from "./ai-roles";

export type AiChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type AiConversation = {
  id: string;
  userKey: string;
  aiRole: AiRole;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  messages: AiChatMessage[];
};

type AiChatStore = {
  conversations: AiConversation[];
};

const MAX_MESSAGES = 60;
const MAX_ARCHIVED = 8;

function emptyStore(): AiChatStore {
  return { conversations: [] };
}

async function readStore(): Promise<AiChatStore> {
  const raw = await readJsonDocument("ai-chat");
  if (!raw) return emptyStore();
  try {
    const parsed = JSON.parse(raw) as AiChatStore;
    if (!Array.isArray(parsed.conversations)) return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: AiChatStore) {
  await writeJsonDocument("ai-chat", store);
}

function prune(store: AiChatStore, userKey: string) {
  const owned = store.conversations.filter((row) => row.userKey === userKey);
  const archived = owned.filter((row) => row.archived).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const drop = new Set(archived.slice(MAX_ARCHIVED).map((row) => row.id));
  store.conversations = store.conversations.filter((row) => !drop.has(row.id));
}

export async function findActiveConversation(userKey: string): Promise<AiConversation | null> {
  const store = await readStore();
  return store.conversations.find((row) => row.userKey === userKey && !row.archived) ?? null;
}

export async function getActiveConversation(userKey: string, role: AiRole): Promise<AiConversation> {
  const existing = await findActiveConversation(userKey);
  if (existing) return existing;
  const now = new Date().toISOString();
  const created: AiConversation = {
    id: crypto.randomUUID(),
    userKey,
    aiRole: role,
    archived: false,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
  const store = await readStore();
  store.conversations.push(created);
  try {
    await writeStore(store);
  } catch (error) {
    if (!(error instanceof PersistWriteError)) throw error;
  }
  return created;
}

export async function appendTurn(userKey: string, role: AiRole, user: AiChatMessage, assistant: AiChatMessage) {
  const store = await readStore();
  let conv = store.conversations.find((row) => row.userKey === userKey && !row.archived);
  if (!conv) {
    const now = new Date().toISOString();
    conv = {
      id: crypto.randomUUID(),
      userKey,
      aiRole: role,
      archived: false,
      createdAt: now,
      updatedAt: now,
      messages: [],
    };
    store.conversations.push(conv);
  }
  conv.messages.push(user, assistant);
  if (conv.messages.length > MAX_MESSAGES) {
    conv.messages = conv.messages.slice(-MAX_MESSAGES);
  }
  conv.updatedAt = assistant.createdAt;
  conv.aiRole = role;
  prune(store, userKey);
  await writeStore(store);
  return conv;
}

export async function archiveActiveConversation(userKey: string) {
  const store = await readStore();
  const conv = store.conversations.find((row) => row.userKey === userKey && !row.archived);
  if (!conv) return { archived: false as const };
  conv.archived = true;
  conv.updatedAt = new Date().toISOString();
  prune(store, userKey);
  await writeStore(store);
  return { archived: true as const, id: conv.id };
}

export function toClaudeMessages(messages: AiChatMessage[], extraUser: string, limit: number) {
  const recent = messages.slice(-limit);
  const out: Array<{ role: "user" | "assistant"; content: string }> = recent.map((row) => ({
    role: row.role,
    content: row.content,
  }));
  out.push({ role: "user", content: extraUser });
  if (out[0]?.role === "assistant") {
    out.unshift({ role: "user", content: "(début de conversation)" });
  }
  return out;
}
