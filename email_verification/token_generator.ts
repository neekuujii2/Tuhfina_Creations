import crypto from 'crypto';

export function generateVerificationToken(): string {
  // Generate a random 32-byte hex string (64 characters)
  return crypto.randomBytes(32).toString('hex');
}
