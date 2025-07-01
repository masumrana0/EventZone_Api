// utils/token.ts
import { createHmac } from 'crypto';

function base64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function parseExpireString(input: string): number {
  const num = parseInt(input);
  if (input.endsWith('d')) return num * 86400;
  if (input.endsWith('h')) return num * 3600;
  if (input.endsWith('m')) return num * 60;
  if (input.endsWith('s')) return num;
  return num;
}

export const createToken = (
  payload: Record<string, any>,
  secret: string,
  expiresIn: number | string,
): string => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const exp =
    typeof expiresIn === 'number'
      ? now + expiresIn
      : now + parseExpireString(expiresIn);

  const fullPayload = {
    ...payload,
    iat: now,
    exp,
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(fullPayload));

  const signature = createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export function verifyToken(
  token: string,
  secret: string,
): Record<string, any> {
  const [headerB64, payloadB64, signature] = token.split('.');

  if (!headerB64 || !payloadB64 || !signature) {
    throw new Error('Invalid token format');
  }

  const expectedSignature = createHmac('sha256', secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (expectedSignature !== signature) {
    throw new Error('Invalid token signature');
  }

  const payloadJson = Buffer.from(payloadB64, 'base64').toString('utf8');
  const payload = JSON.parse(payloadJson);

  // Check expiration
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    throw new Error('Token expired');
  }

  return payload;
}
