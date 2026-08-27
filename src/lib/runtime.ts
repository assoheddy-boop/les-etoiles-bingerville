/** Build (`next build`) sets NODE_ENV=production; do not treat that as live runtime. */
export function isBuildPhase() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

export function isVercelRuntime() {
  return process.env.VERCEL === "1";
}

/** Live production (Vercel or `next start`), not the compile step. */
export function isProductionRuntime() {
  if (isBuildPhase()) return false;
  return isVercelRuntime() || process.env.NODE_ENV === "production";
}

/**
 * Affiche les identifiants démo et le bandeau « Démo ».
 * Défaut : oui en local, non sur Vercel — sauf ETOILES_DEMO_HINTS=true|false.
 */
export function demoHintsEnabled() {
  const flag = process.env.ETOILES_DEMO_HINTS?.trim().toLowerCase();
  if (flag === "true" || flag === "1") return true;
  if (flag === "false" || flag === "0") return false;
  return !isVercelRuntime();
}

export function cloudPersistEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

/** Writes go to Vercel Blob when a token/store is present; otherwise local `data/`. */
export function cloudPersistActive() {
  return cloudPersistEnabled();
}

export function persistWritesAllowed() {
  if (isVercelRuntime()) return cloudPersistEnabled();
  return true;
}

export function blobAccess(): "public" | "private" {
  return process.env.BLOB_ACCESS === "public" ? "public" : "private";
}
