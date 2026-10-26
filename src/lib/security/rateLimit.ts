// In-Memory Best-Effort Sliding-Window Rate Limiter
// NOTE: Best-effort for demo runtime. Production requires Redis or distributed durable rate limiting.

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStores = new Map<string, Map<string, RateLimitRecord>>();

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

export function checkRateLimit(
  bucket: string,
  ip: string,
  maxRequests: number,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetMs: number } {
  if (!rateLimitStores.has(bucket)) {
    rateLimitStores.set(bucket, new Map());
  }
  const store = rateLimitStores.get(bucket)!;
  const now = Date.now();
  const windowStart = now - windowMs;

  const record = store.get(ip) || { timestamps: [] };
  // Clean up older timestamps outside the sliding window
  const validTimestamps = record.timestamps.filter(ts => ts > windowStart);

  if (validTimestamps.length >= maxRequests) {
    store.set(ip, { timestamps: validTimestamps });
    const oldestTimestamp = validTimestamps[0];
    const resetMs = Math.max(0, oldestTimestamp + windowMs - now);
    return {
      allowed: false,
      remaining: 0,
      resetMs
    };
  }

  validTimestamps.push(now);
  store.set(ip, { timestamps: validTimestamps });

  return {
    allowed: true,
    remaining: maxRequests - validTimestamps.length,
    resetMs: windowMs
  };
}

export function resetRateLimits(): void {
  rateLimitStores.clear();
}
