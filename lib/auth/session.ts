'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify, SignJWT } from 'jose';

const SESSION_COOKIE_NAME = 'hidrokaltim_session';
const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'dev-secret-please-change-in-production'
);

const SESSION_EXPIRY_DAYS = 30;
const SESSION_EXPIRY_MS = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export type SessionPayload = {
  status: 'authenticated' | 'unauthenticated';
  auth?: {
    userId: string;
    email: string;
    name: string;
    role: string;
    passwordConfirmedAt?: number;
  };
};

/**
 * Create a new session
 */
export async function createSession(
  userId: string,
  email: string,
  name: string,
  role: string
): Promise<void> {
  const payload: SessionPayload = {
    status: 'authenticated',
    auth: {
      userId,
      email,
      name,
      role,
      passwordConfirmedAt: Date.now(),
    },
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(new Date(Date.now() + SESSION_EXPIRY_MS))
    .sign(SESSION_SECRET);

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRY_MS / 1000,
    path: '/',
  });
}

/**
 * Destroy current session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Parse session payload from cookie
 */
export async function parseSessionPayload(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const verified = await jwtVerify(token, SESSION_SECRET);
    return verified.payload as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  const payload = await parseSessionPayload();

  if (!payload || payload.status !== 'authenticated' || !payload.auth) {
    return null;
  }

  return {
    id: payload.auth.userId,
    email: payload.auth.email,
    name: payload.auth.name,
    role: payload.auth.role,
    passwordConfirmedAt: payload.auth.passwordConfirmedAt,
  };
}

/**
 * Require current user - redirect to login if not authenticated
 */
export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

/**
 * Require admin user - redirect to dashboard if not admin
 */
export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  return user;
}

/**
 * Mark password as confirmed in session
 */
export async function markPasswordConfirmed(): Promise<void> {
  const payload = await parseSessionPayload();

  if (!payload || payload.status !== 'authenticated' || !payload.auth) {
    return;
  }

  payload.auth.passwordConfirmedAt = Date.now();

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(new Date(Date.now() + SESSION_EXPIRY_MS))
    .sign(SESSION_SECRET);

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRY_MS / 1000,
    path: '/',
  });
}

/**
 * Get client IP address
 */
export async function getClientIp(request: Request): Promise<string> {
  const forwarded = request.headers.get('x-forwarded-for');
  return (forwarded?.split(',')[0] || '0.0.0.0').trim();
}
