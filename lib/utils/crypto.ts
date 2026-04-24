import { randomBytes } from 'crypto';

/**
 * Generate a random string for tokens
 */
export async function generateRandomString(length: number = 32): Promise<string> {
  return randomBytes(length).toString('hex');
}
