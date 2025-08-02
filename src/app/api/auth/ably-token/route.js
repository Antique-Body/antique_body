import { NextResponse } from "next/server";

import { auth } from "#/auth";

// Server-side Ably import for API routes
let Ably = null;
const getServerAbly = async () => {
  if (!Ably) {
    Ably = (await import("ably")).default;
  }
  return Ably;
};

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { clientId } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    // Verify the clientId matches the authenticated user
    if (clientId !== session.user.id) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 403 });
    }

    const Ably = await getServerAbly();

    if (!process.env.ABLY_API_KEY) {
      console.error("ABLY_API_KEY environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Initialize Ably with server-side API key
    const ably = new Ably.Rest({
      key: process.env.ABLY_API_KEY,
    });

    // Generate token request with appropriate capabilities
    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: clientId,
      capability: {
        "chat:*": ["subscribe", "publish", "presence"],
        "presence:global": ["subscribe", "publish", "presence"],
      },
    });

    return NextResponse.json({
      tokenRequest,
      clientId,
    });
  } catch (error) {
    console.error("Error generating Ably token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
