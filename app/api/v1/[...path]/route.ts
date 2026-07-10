import { NextRequest, NextResponse } from "next/server";

const TARGET_URL = "https://api.backpack.exchange";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Expose-Headers": "Content-Length, Content-Range",
};

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const path = params.path.join("/");
    const search = request.nextUrl.search;
    const upstreamUrl = `${TARGET_URL}/api/v1/${path}${search}`;

    const upstreamResponse = await fetch(upstreamUrl, {
        headers: {
            origin: "http://localhost:3000",
            referer: "http://localhost:3000/",
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
        },
    });

    const body = await upstreamResponse.text();

    return new NextResponse(body, {
        status: upstreamResponse.status,
        headers: {
            "Content-Type":
                upstreamResponse.headers.get("content-type") ?? "application/json",
            ...CORS_HEADERS,
        },
    });
}

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
