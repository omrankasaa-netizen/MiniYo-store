import * as jose from "jose";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./queries/connection";
import { env } from "./lib/env";

const JWT_ALG = "HS256";
const LOCAL_SESSION_SECRET = () => new TextEncoder().encode(env.appSecret + "_local");

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signLocalSession(userId: number, email: string, role: string): Promise<string> {
  return new jose.SignJWT({ userId, email, role, type: "local" })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(LOCAL_SESSION_SECRET());
}

export async function verifyLocalSession(token: string): Promise<{ userId: number; email: string; role: string } | null> {
  try {
    const { payload } = await jose.jwtVerify(token, LOCAL_SESSION_SECRET(), {
      algorithms: [JWT_ALG],
      clockTolerance: 60,
    });
    if (!payload.userId || !payload.email || payload.type !== "local") return null;
    return {
      userId: payload.userId as number,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

export async function findLocalUserByEmail(email: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  return rows.at(0);
}

export async function createLocalUser(data: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: string;
}) {
  const db = getDb();
  const passwordHash = await hashPassword(data.password);

  const [result] = await db.insert(schema.users).values({
    email: data.email,
    passwordHash,
    name: data.name,
    phone: data.phone || null,
    role: (data.role as any) || "customer",
  }).$returningId();

  return db.select().from(schema.users).where(eq(schema.users.id, result.id)).limit(1).then(r => r[0]);
}

export async function findOrCreateLocalUser(data: {
  email: string;
  name: string;
  phone?: string;
}) {
  const existing = await findLocalUserByEmail(data.email);
  if (existing) return existing;

  const db = getDb();
  const [result] = await db.insert(schema.users).values({
    email: data.email,
    name: data.name,
    phone: data.phone || null,
    role: "customer",
  }).$returningId();

  return db.select().from(schema.users).where(eq(schema.users.id, result.id)).limit(1).then(r => r[0]!);
}
