const serverRuns = new Map<string, number>();

function freeLimitPerDay(): number {
  const raw = process.env.RATE_LIMIT_FREE_PER_DAY ?? "1";
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

export function checkServerRateLimit(ip: string, isPremium: boolean): boolean {
  if (isPremium) return true;
  const limit = freeLimitPerDay();
  const today = new Date().toISOString().slice(0, 10);
  const key = `${ip}:${today}`;
  const count = serverRuns.get(key) ?? 0;
  if (count >= limit) return false;
  serverRuns.set(key, count + 1);
  return true;
}
