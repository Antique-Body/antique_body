import { userService } from "@/services/users";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    try {
      const updatedUser = await userService.resetPassword(token, password);
      return NextResponse.json({
        message: "Password has been reset successfully",
        user: updatedUser
      });
    } catch (error) {
      if (error.message === "Invalid or expired reset token") {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
} 