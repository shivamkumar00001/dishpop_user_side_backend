import { initRedisPublisher } from "./redisPublisher.js";

export async function publishOrderEvent(type, username, data) {
  const redis = initRedisPublisher();
  if (!redis) return;

  try {
    await redis.publish(
      "orders-events",
      JSON.stringify({ type, username, data })
    );
  } catch {
    // 🔇 intentionally silent
  }
}