import { NextResponse } from "next/server";

import { auth } from "#/auth";
import { generateAblyToken } from "@/lib/ably";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenRequest = await generateAblyToken(session.user.id);
    
    return NextResponse.json({ tokenRequest });
  } catch (error) {
    console.error("Error generating Ably token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
} 