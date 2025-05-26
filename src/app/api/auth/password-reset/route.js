import { userService } from "@/app/api/users/services";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, token, newPassword } = await request.json();

    // If no token is provided, this is a request to initiate password reset
    if (!token) {
      if (!email) {
        return NextResponse.json(
          { error: "Email is required" },
          { status: 400 }
        );
      }

      const user = await userService.findUserByEmail(email).catch(() => null);

      // Return success even if user not found (security best practice)
      if (!user) {
        return NextResponse.json({
          message:
            "If an account exists with this email, you will receive a password reset link",
        });
      }

      // Check for existing valid reset token
      if (
        user.resetToken &&
        user.resetTokenExpiry &&
        user.resetTokenExpiry > new Date()
      ) {
        return NextResponse.json({
          message:
            "A password reset link has already been sent. Please check your email or wait a few minutes.",
        });
      }

      // Generate new reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      // Update user with reset token
      await userService.updateUser(user.id, {
        resetToken,
        resetTokenExpiry,
      });

      // Send reset email
      const emailSent = await sendPasswordResetEmail(email, resetToken);
      if (!emailSent) {
        // Revert token update if email fails
        await userService.updateUser(user.id, {
          resetToken: null,
          resetTokenExpiry: null,
        });
        return NextResponse.json(
          { error: "Failed to send reset email. Please try again later." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Password reset link has been sent to your email",
      });
    }

    // If token is provided, this is a request to complete password reset
    if (!newPassword) {
      return NextResponse.json(
        { error: "New password is required" },
        { status: 400 }
      );
    }

    await userService.resetPassword(token, newPassword);
    return NextResponse.json({
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error);

    if (error.message === "Invalid or expired reset token") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Unable to process your request. Please try again later." },
      { status: 500 }
    );
  }
}
