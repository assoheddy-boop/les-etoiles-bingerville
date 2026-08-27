const PREFIX = "$pbkdf2-sha256$";
const ITERATIONS = 100_000;
const KEY_BITS = 256;

function encode(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64url");
}

function decode(value: string) {
  return new Uint8Array(Buffer.from(value, "base64url"));
}

function timingEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function derive(password: string, salt: Uint8Array, iterations: number) {
  const saltCopy = new Uint8Array(salt.byteLength);
  saltCopy.set(salt);
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: saltCopy as BufferSource, iterations },
    material,
    KEY_BITS,
  );
  return new Uint8Array(bits);
}

export function isPasswordHash(stored: string) {
  return stored.startsWith(PREFIX) || /^\$2[aby]\$/.test(stored);
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await derive(password, salt, ITERATIONS);
  return `${PREFIX}${ITERATIONS}$${encode(salt)}$${encode(key)}`;
}

export async function verifyPassword(password: string, stored: string) {
  if (!stored) return false;
  if (stored.startsWith(PREFIX)) {
    const parts = stored.split("$");
    const iterations = Number(parts[2]);
    const salt = parts[3] ? decode(parts[3]) : null;
    const expected = parts[4] ? decode(parts[4]) : null;
    if (!iterations || !salt || !expected) return false;
    const actual = await derive(password, salt, iterations);
    return timingEqual(actual, expected);
  }
  return stored === password;
}

export async function verifyAndUpgrade(
  password: string,
  stored: string,
): Promise<{ ok: boolean; nextHash?: string }> {
  if (!stored) return { ok: false };
  if (isPasswordHash(stored)) {
    return { ok: await verifyPassword(password, stored) };
  }
  if (stored !== password) return { ok: false };
  return { ok: true, nextHash: await hashPassword(password) };
}
