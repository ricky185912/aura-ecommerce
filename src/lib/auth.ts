import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { sql } from './db';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface UserPayload {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'seller' | 'admin';
}

export function signToken(user: UserPayload): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('aura_token')?.value;
  
  if (!token) return null;
  
  const user = verifyToken(token);
  if (!user) return null;
  
  // Verify user still exists in database
  const dbUser = await sql`SELECT * FROM users WHERE id = ${user.id}`;
  if (dbUser.length === 0) return null;
  
  return user;
}

export async function getUserRole(): Promise<string> {
  const user = await getCurrentUser();
  return user?.role || 'guest';
}