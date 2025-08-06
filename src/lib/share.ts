export type SharePayload = {
  id: string;
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline?: string | null;
  category?: string;
  created_at?: string;
  updated_at?: string;
  version: number;
  pwHash?: string; // optional password gate (sha-256 hex)
};

// Encode string to base64 (UTF-8 safe)
export function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

export function fromBase64(b64: string): string {
  return decodeURIComponent(escape(atob(b64)));
}

export async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password: string): Promise<string> {
  return sha256Hex(`pw:${password}`);
}

export async function generateShareToken(payload: SharePayload): Promise<{ payloadB64: string; sig: string }> {
  const json = JSON.stringify(payload);
  const payloadB64 = toBase64(json);
  // integrity signature (not secret) – verifies link hasn't been corrupted
  const sig = await sha256Hex(`sig:${payloadB64}`);
  return { payloadB64, sig };
}

export async function verifyShareToken(payloadB64: string, sig: string): Promise<boolean> {
  const expected = await sha256Hex(`sig:${payloadB64}`);
  return expected === sig;
}

export function buildShareUrl(payloadB64: string, sig: string): string {
  const base = window.location.origin;
  const url = new URL(base + '/share/goal');
  url.searchParams.set('payload', payloadB64);
  url.searchParams.set('sig', sig);
  return url.toString();
}

export function parsePayload(payloadB64: string): SharePayload | null {
  try {
    const json = fromBase64(payloadB64);
    return JSON.parse(json) as SharePayload;
  } catch (e) {
    return null;
  }
}
