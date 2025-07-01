import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

// Hash password
export function convertHashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, originalHash] = stored.split(':');

  if (!salt || !originalHash) return false;

  const hashToVerify = pbkdf2Sync(
    password,
    salt,
    100000,
    64,
    'sha512',
  ).toString('hex');

  // Compare using timingSafeEqual to avoid timing attacks
  const originalBuffer = Buffer.from(originalHash, 'hex');
  const verifyBuffer = Buffer.from(hashToVerify, 'hex');

  if (originalBuffer.length !== verifyBuffer.length) return false;

  return timingSafeEqual(originalBuffer, verifyBuffer);
}
