import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Check Redis cache; on miss, call fetchFn, store the result, and return it.
 */
export async function getCached<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number
): Promise<T> {
  try {
    const cached = await redis.get<T>(key);
    if (cached !== null) return cached;
  } catch {
    // Redis unavailable — fall through to fetchFn
  }

  const data = await fetchFn();

  try {
    await redis.set(key, JSON.stringify(data), { ex: ttlSeconds });
  } catch {
    // Swallow write errors — data is still valid
  }

  return data;
}

/**
 * Delete one or more cache keys.
 */
export async function invalidateCache(key: string | string[]): Promise<void> {
  const keys = Array.isArray(key) ? key : [key];
  if (keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch {
    // Swallow — caller shouldn't fail on cache errors
  }
}

export default redis;
