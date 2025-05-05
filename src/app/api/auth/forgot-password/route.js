import { NextResponse } from "next/server";

import { userService } from "@/services/users";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    try {
      await userService.initiatePasswordReset(email);
      return NextResponse.json({
        message: "If an account exists with this email, you will receive a password reset link"
      });
    } catch (error) {
      // We don't want to expose whether the email exists or not
      return NextResponse.json({
        message: "If an account exists with this email, you will receive a password reset link"
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process forgot password request" },
      { status: 500 }
    );
  }
} 