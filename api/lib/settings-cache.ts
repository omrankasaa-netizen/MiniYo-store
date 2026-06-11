/**
 * Settings cache — reads site_settings from DB, caches for 5 minutes.
 * Used by mailer and other server code so we don't hit DB on every email send.
 */
import { getDb } from "../queries/connection";
import { siteSettings } from "@db/schema";

let cache: Record<string, string> = {};
let cacheAt = 0;
const TTL = 5 * 60 * 1000; // 5 minutes

export async function getSettings(): Promise<Record<string, string>> {
  if (Date.now() - cacheAt < TTL) return cache;
  try {
    const rows = await getDb().select().from(siteSettings);
    const fresh: Record<string, string> = {};
    for (const row of rows) {
      if (row.settingValue !== null) fresh[row.settingKey] = row.settingValue;
    }
    cache = fresh;
    cacheAt = Date.now();
    return cache;
  } catch {
    return cache; // return stale on DB error
  }
}

export function invalidateSettingsCache() {
  cacheAt = 0;
}

export async function getSetting(key: string, fallback = ""): Promise<string> {
  const s = await getSettings();
  return s[key] ?? fallback;
}
