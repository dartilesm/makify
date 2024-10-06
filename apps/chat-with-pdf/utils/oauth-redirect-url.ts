import { ReadonlyURLSearchParams } from "next/navigation";

export function getOAuthRedirectUrl(searchParams: ReadonlyURLSearchParams) {
  const protocol = "https";
  const host = process.env.SUPABASE_AUTH_REDIRECT_URL || process.env.VERCEL_URL;
  const path = "/api/auth/callback";
  const queryParams = new URLSearchParams(searchParams).toString();

  const redirectUrl = new URL(
    `${path}?${queryParams}`,
    `${protocol}://${host}`,
  ).toString();

  return redirectUrl;
}
