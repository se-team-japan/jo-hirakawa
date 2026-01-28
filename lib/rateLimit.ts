type RateLimitState = {
  count: number;
  expiresAt: number;
};

const DEFAULT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 60) * 1000;
const DEFAULT_MAX = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 5);

const store = new Map<string, RateLimitState>();

export function rateLimit(options?: { windowMs?: number; max?: number }) {
  const windowMs = options?.windowMs ?? DEFAULT_WINDOW_MS;
  const max = options?.max ?? DEFAULT_MAX;

  return {
    check: (key: string) => {
      const now = Date.now();
      const current = store.get(key);

      if (!current || current.expiresAt < now) {
        store.set(key, { count: 1, expiresAt: now + windowMs });
        return { allowed: true, remaining: max - 1 };
      }

      if (current.count >= max) {
        return { allowed: false, remaining: 0 };
      }

      current.count += 1;
      store.set(key, current);
      return { allowed: true, remaining: max - current.count };
    },
  };
}




