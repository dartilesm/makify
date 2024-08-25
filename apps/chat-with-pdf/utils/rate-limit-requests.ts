import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

type RateLimitResponse = {
  success: boolean;
  headers: {
    "X-RateLimit-Limit": string;
    "X-RateLimit-Remaining": string;
    "X-RateLimit-Reset": string;
  };
};

export async function rateLimitRequests(
  req: Request,
): Promise<RateLimitResponse> {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      // rate limit to 5 requests per 10 seconds
      limiter: Ratelimit.slidingWindow(5, "10s"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_${ip}`,
    );

    const response = {
      success,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    };
    return response;
  }

  console.log(
    "KV_REST_API_URL and KV_REST_API_TOKEN env vars not found, not rate limiting...",
  );
  const response = {} as RateLimitResponse;
  return response;
}
