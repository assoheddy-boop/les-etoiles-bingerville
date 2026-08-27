import path from "node:path";
import { readUpload, saveUpload } from "./persist";

export const HOMEWORK_MAX_BYTES = 8 * 1024 * 1024;

const MIME_BY_EXT: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export function homeworkFileAllowed(name: string) {
  return Object.prototype.hasOwnProperty.call(MIME_BY_EXT, path.extname(name).toLowerCase());
}

export function mimeFromFilename(name: string) {
  return MIME_BY_EXT[path.extname(name).toLowerCase()] ?? "application/octet-stream";
}

export function sanitizeOriginalName(name: string) {
  const base = path.basename(name).replace(/[/\\]/g, "");
  const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return (cleaned || "piece-jointe").slice(0, 80);
}

export function contentDisposition(filename: string) {
  const ascii = filename.replace(/[^\x20-\x7E]/g, "_");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

export async function saveHomeworkAttachment(homeworkId: string, file: File) {
  if (!file.size) return null;
  if (file.size > HOMEWORK_MAX_BYTES) {
    throw new Error("too-large");
  }
  const originalName = sanitizeOriginalName(file.name || "piece-jointe");
  if (!homeworkFileAllowed(originalName)) {
    throw new Error("type");
  }
  const storedName = `${homeworkId}-${originalName}`;
  await saveUpload("homeworks", storedName, Buffer.from(await file.arrayBuffer()));
  return { storedName, originalName };
}

export async function readHomeworkAttachment(storedName: string) {
  return readUpload("homeworks", storedName);
}
