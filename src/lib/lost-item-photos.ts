import path from "node:path";
import { readUpload, saveUpload } from "./persist";
import type { LostItem } from "./school-life-types";

export const LOST_ITEM_PHOTO_MAX_BYTES = 4 * 1024 * 1024;

const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

export function lostItemPhotoAllowed(name: string) {
  return Object.prototype.hasOwnProperty.call(MIME_BY_EXT, path.extname(name).toLowerCase());
}

export function mimeFromLostItemPhoto(name: string) {
  return MIME_BY_EXT[path.extname(name).toLowerCase()] ?? "application/octet-stream";
}

export function sanitizeOriginalName(name: string) {
  const base = path.basename(name).replace(/[/\\]/g, "");
  const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return (cleaned || "photo").slice(0, 80);
}

export async function saveLostItemPhoto(itemId: string, file: File) {
  if (!file.size) return null;
  if (file.size > LOST_ITEM_PHOTO_MAX_BYTES) {
    throw new Error("too-large");
  }
  const originalName = sanitizeOriginalName(file.name || "photo.jpg");
  if (!lostItemPhotoAllowed(originalName)) {
    throw new Error("type");
  }
  const storedName = `${itemId}-${originalName}`;
  await saveUpload("lost-items", storedName, Buffer.from(await file.arrayBuffer()));
  return storedName;
}

export async function readLostItemPhoto(storedName: string) {
  return readUpload("lost-items", storedName);
}

/** Public URL for a lost item photo, or null if none. */
export function lostItemPhotoSrc(item: LostItem): string | null {
  if (!item.photo) return null;
  if (item.photo.startsWith("/")) return item.photo;
  return `/api/lost-items/${item.id}/photo`;
}
