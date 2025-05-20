import { checkRateLimit, findUserByPhone, verifyPhoneCode } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: "Phone and code are required" },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimitKey = `verify_${phone}`;
    const isAllowed = await checkRateLimit(rateLimitKey, 5, 60 * 1000); // 5 attempts per minute
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    // Verify the code
    const verification = await verifyPhoneCode(phone, code);
    if (!verification) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await findUserByPhone(phone);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      verificationId: verification.id,
      expiresAt: verification.expires,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
