import Redis from "ioredis";

let redis;
let disabled = false;

export function initRedisPublisher() {
  // 🔍 PROOF LOG (TEMPORARY, KEEP FOR DEBUG)
  console.log("🔍 Redis URL =", process.env.REDIS_URL);

  if (redis || disabled) return redis;

  // ❌ If REDIS_URL is missing, disable publisher clearly
  if (!process.env.REDIS_URL) {
    console.error("❌ REDIS_URL is missing — Redis publisher disabled");
    disabled = true;
    return null;
  }

  try {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 0,
      enableOfflineQueue: false,
      retryStrategy: () => null, // ⛔ no retry
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