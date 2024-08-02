import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return new Response("Missing 'url' parameter", { status: 400 });
  }

  try {
    const response = await fetch(handleUrl(url));

    if (!response.ok) {
      return new Response("Failed to fetch PDF", { status: 500 });
    }

    if (response.headers.get("content-type")?.includes("application/pdf")) {
      const pdf = await response.arrayBuffer();
      return new Response(pdf, {
        headers: {
          "Content-Type": response.headers.get("content-type") as string,
        },
        status: 200,
      });
    }

    if (
      response.headers.get("content-type")?.includes("application/javascript")
    ) {
      const javascriptCode = await response.text();
      return new Response(javascriptCode, {
        headers: {
          "Content-Type": response.headers.get("content-type") as string,
        },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: "Failed to parse response" }), {
      status: 500,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error?.message,
      }),
      { status: 500 },
    );
  }
}

function handleUrl(url: string) {
  // add protocol if missing
  if (!url.startsWith("http")) {
    return `https://${url}`;
  }
  return url;
}
