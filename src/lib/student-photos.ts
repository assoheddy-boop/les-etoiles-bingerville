import path from "node:path";
import { readUpload, saveUpload } from "./persist";
import type { RosterStudent } from "./school-life-types";

export const STUDENT_PHOTO_MAX_BYTES = 4 * 1024 * 1024;

const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

export function studentPhotoAllowed(name: string) {
  return Object.prototype.hasOwnProperty.call(MIME_BY_EXT, path.extname(name).toLowerCase());
}

export function mimeFromStudentPhoto(name: string) {
  return MIME_BY_EXT[path.extname(name).toLowerCase()] ?? "application/octet-stream";
}

function sanitizeOriginalName(name: string) {
  const base = path.basename(name).replace(/[/\\]/g, "");
  const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return (cleaned || "photo").slice(0, 80);
}

export async function saveStudentPhoto(studentId: string, file: File) {
  if (!file.size) return null;
  if (file.size > STUDENT_PHOTO_MAX_BYTES) throw new Error("too-large");
  const originalName = sanitizeOriginalName(file.name || "photo.jpg");
  if (!studentPhotoAllowed(originalName)) throw new Error("type");
  const storedName = `${studentId}-${originalName}`;
  await saveUpload("students", storedName, Buffer.from(await file.arrayBuffer()));
  return storedName;
}

export async function readStudentPhoto(storedName: string) {
  return readUpload("students", storedName);
}

export function studentPhotoSrc(student: RosterStudent) {
  if (!student.photo) return null;
  if (student.photo.startsWith("/")) return student.photo;
  return `/api/admin/inscriptions/${student.id}/photo`;
}
