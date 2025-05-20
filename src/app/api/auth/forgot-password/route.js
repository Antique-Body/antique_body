import { sendPasswordResetEmail } from "@/app/utils/email";
import { userService } from "@/services/users";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("=== Forgot password API route called ===");

  try {
    const { email } = await request.json();
    console.log("Received email for password reset:", email);

    if (!email) {
      console.log("No email provided");
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let user;
    try {
      // Check if user exists
      user = await userService.findUserByEmail(email);
      console.log("User found:", !!user);
    } catch (error) {
      // If user not found, return success message (security best practice)
      if (error.message === "User not found") {
        return NextResponse.json({
          message:
            "If an account exists with this email, you will receive a password reset link",
        });
      }
      throw error;
    }

    // Check if there's an existing valid reset token
    if (
      user.resetToken &&
      user.resetTokenExpiry &&
      user.resetTokenExpiry > new Date()
    ) {
      console.log("Valid reset token already exists");
      return NextResponse.json({
        message:
          "A password reset link has already been sent to your email. Please check your inbox or wait a few minutes before requesting another one.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    console.log("Generated new reset token and expiry");

    try {
      // Update user with reset token
      await userService.updateUser(user.id, {
        resetToken,
        resetTokenExpiry,
      });
      console.log("User updated with new reset token");
    } catch (updateError) {
      console.error("Error updating user with reset token:", updateError);
      throw new Error("Failed to update user with reset token");
    }

    // Send reset email
    console.log("Attempting to send reset email to:", email);
    const emailSent = await sendPasswordResetEmail(email, resetToken);

    if (!emailSent) {
      console.error("Failed to send password reset email");
      return NextResponse.json(
        { error: "Failed to send reset email. Please try again later." },
        { status: 500 }
      );
    }

    console.log("Reset email sent successfully");
    return NextResponse.json({
      message: "Password reset link has been sent to your email",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    // Return a more user-friendly error message
    return NextResponse.json(
      {
        error:
          "Unable to process your request at this time. Please try again later.",
      },
      { status: 500 }
    );
  }
}
