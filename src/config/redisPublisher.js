import Redis from "ioredis";

let redis;
let disabled = false;

export function initRedisPublisher() {
  if (redis || disabled) return redis;

  try {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 0,
      enableOfflineQueue: false,
      retryStrategy: () => null, // ⛔ ABSOLUTELY NO RETRY
    });

    redis.once("ready", () => {
      console.log("✅ Redis publisher connected (Upstash)");
    });

    redis.once("error", (err) => {
      console.error("❌ Redis publisher error:", err.message);
      disabled = true;
      redis.disconnect();
    });

  } catch (err) {
    console.error("❌ Redis init failed:", err.message);
    disabled = true;
  }

  return redis;
}