import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  BlobNotFoundError,
  BlobPreconditionFailedError,
  get,
  put,
  type PutBlobResult,
} from "@vercel/blob";
import {
  blobAccess,
  persistWritesAllowed,
  cloudPersistActive,
} from "./runtime";
import {
  bundledHomeworkUploadsDir,
  bundledLostItemUploadsDir,
  bundledStudentPhotoUploadsDir,
  aiChatFile,
  cmsFile,
  employeesFile,
  dataDir,
  homeworkUploadsDir,
  inboxFile,
  ledgerFile,
  lostItemUploadsDir,
  schoolLifeFile,
  studentPhotoUploadsDir,
} from "./paths";

export type JsonDocKey = "school-life" | "cms" | "inbox" | "ledger" | "ai-chat" | "employees";
export type UploadKind = "homeworks" | "students" | "lost-items";

const JSON_FILES: Record<JsonDocKey, string> = {
  "school-life": schoolLifeFile,
  cms: cmsFile,
  inbox: inboxFile,
  ledger: ledgerFile,
  "ai-chat": aiChatFile,
  employees: employeesFile,
};

const BLOB_JSON: Record<JsonDocKey, string> = {
  "school-life": "etoiles/school-life.json",
  cms: "etoiles/cms.json",
  inbox: "etoiles/inbox.json",
  ledger: "etoiles/ledger.json",
  "ai-chat": "etoiles/ai-chat.json",
  employees: "etoiles/employees.json",
};

const LOCAL_UPLOAD_DIR: Record<UploadKind, string> = {
  homeworks: homeworkUploadsDir,
  students: studentPhotoUploadsDir,
  "lost-items": lostItemUploadsDir,
};

const BUNDLED_UPLOAD_DIR: Record<UploadKind, string> = {
  homeworks: bundledHomeworkUploadsDir,
  students: bundledStudentPhotoUploadsDir,
  "lost-items": bundledLostItemUploadsDir,
};

const etags = new Map<string, string>();
const locks = new Map<string, Promise<unknown>>();

export class PersistWriteError extends Error {
  readonly code = "persist" as const;
  constructor(
    message = "Enregistrement impossible : stockage durable non configuré. Définissez BLOB_READ_WRITE_TOKEN (store Blob privé) sur Vercel.",
  ) {
    super(message);
    this.name = "PersistWriteError";
  }
}

function blobPath(kind: UploadKind, storedName: string) {
  return `etoiles/uploads/${kind}/${storedName}`;
}

function requireWrites() {
  if (!persistWritesAllowed()) {
    throw new PersistWriteError();
  }
}

async function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const previous = locks.get(key) ?? Promise.resolve();
  let release: () => void = () => undefined;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  locks.set(
    key,
    previous.then(() => current),
  );
  await previous;
  try {
    return await fn();
  } finally {
    release();
    if (locks.get(key) === current) locks.delete(key);
  }
}

async function streamToBuffer(stream: ReadableStream<Uint8Array>) {
  return Buffer.from(await new Response(stream).arrayBuffer());
}

function explainBlobError(error: unknown): never {
  if (error instanceof PersistWriteError) throw error;
  const message = error instanceof Error ? error.message : String(error);
  throw new PersistWriteError(
    `Enregistrement impossible (Vercel Blob) : ${message}. Vérifiez BLOB_READ_WRITE_TOKEN et BLOB_ACCESS (private par défaut, public si le store existant est public).`,
  );
}

async function blobGetBuffer(pathname: string): Promise<Buffer | null> {
  try {
    const result = await get(pathname, {
      access: blobAccess(),
      useCache: false,
    });
    if (!result || result.statusCode !== 200) return null;
    etags.set(pathname, result.blob.etag);
    return streamToBuffer(result.stream);
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}

async function blobPut(
  pathname: string,
  body: string | Buffer,
  contentType: string,
  ifMatch?: string,
): Promise<PutBlobResult> {
  try {
    const result = await put(pathname, body, {
      access: blobAccess(),
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
      cacheControlMaxAge: contentType.includes("json") ? 0 : 60 * 60 * 24 * 30,
      ...(ifMatch ? { ifMatch } : {}),
    });
    etags.set(pathname, result.etag);
    return result;
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError) throw error;
    explainBlobError(error);
  }
}

export async function readJsonDocument(key: JsonDocKey): Promise<string | null> {
  if (cloudPersistActive()) {
    const buf = await blobGetBuffer(BLOB_JSON[key]);
    return buf ? buf.toString("utf8") : null;
  }
  try {
    return await readFile(JSON_FILES[key], "utf8");
  } catch {
    return null;
  }
}

export async function writeJsonDocument(key: JsonDocKey, value: unknown) {
  requireWrites();
  const raw = JSON.stringify(value, null, 2);
  if (cloudPersistActive()) {
    const pathname = BLOB_JSON[key];
    return withLock(pathname, async () => {
      try {
        await blobPut(pathname, raw, "application/json; charset=utf-8", etags.get(pathname));
      } catch (error) {
        if (error instanceof BlobPreconditionFailedError) {
          etags.delete(pathname);
          await blobPut(pathname, raw, "application/json; charset=utf-8");
          return;
        }
        if (error instanceof PersistWriteError) throw error;
        explainBlobError(error);
      }
    });
  }
  await mkdir(dataDir, { recursive: true });
  await writeFile(JSON_FILES[key], raw, "utf8");
}

export async function saveUpload(kind: UploadKind, storedName: string, bytes: Buffer) {
  requireWrites();
  const safe = path.basename(storedName);
  if (!safe || safe !== storedName || storedName.includes("..")) {
    throw new Error("name");
  }
  if (cloudPersistActive()) {
    await blobPut(blobPath(kind, safe), bytes, "application/octet-stream");
    return;
  }
  const dir = LOCAL_UPLOAD_DIR[kind];
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safe), bytes);
}

export async function readUpload(kind: UploadKind, storedName: string): Promise<Uint8Array | null> {
  const safe = path.basename(storedName);
  if (!safe || safe !== storedName || storedName.includes("..")) return null;
  const toBytes = (buf: Buffer) => Uint8Array.from(buf);
  if (cloudPersistActive()) {
    const fromCloud = await blobGetBuffer(blobPath(kind, safe));
    if (fromCloud) return toBytes(fromCloud);
  } else {
    try {
      return toBytes(await readFile(path.join(LOCAL_UPLOAD_DIR[kind], safe)));
    } catch {
      // bundled seed files (devoirs démo, etc.)
    }
  }
  try {
    return toBytes(await readFile(path.join(BUNDLED_UPLOAD_DIR[kind], safe)));
  } catch {
    return null;
  }
}
