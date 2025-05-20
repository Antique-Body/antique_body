import { sendEmailVerificationCode } from "@/app/utils/email";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function verifyEmailCode(email, code) {
  try {
    // Find the most recent unused code for this email
    const verificationCode = await prisma.emailVerificationCode.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!verificationCode) {
      return false;
    }

    // Mark the code as used
    await prisma.emailVerificationCode.update({
      where: { id: verificationCode.id },
      data: { used: true },
    });

    return true;
  } catch (error) {
    console.error("Error verifying code:", error);
    return false;
  }
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Calculate expiration time (15 minutes from now)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Delete any existing unused codes for this email
    await prisma.emailVerificationCode.deleteMany({
      where: {
        email,
        used: false,
      },
    });

    // Store new code in database
    await prisma.emailVerificationCode.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    // Send email
    const emailSent = await sendEmailVerificationCode(email, code);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send verification code" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Verification code sent successfully",
    });
  } catch (error) {
    console.error("Error sending verification code:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
