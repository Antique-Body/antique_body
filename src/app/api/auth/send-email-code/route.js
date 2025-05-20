import { sendVerificationCodeEmail } from "@/lib/email";
import { PrismaClient } from "@prisma/client";

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

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing unused codes for this email
    await prisma.emailVerificationCode.deleteMany({
      where: {
        email,
        used: false,
      },
    });

    // Create new verification code
    await prisma.emailVerificationCode.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    // Send email with verification code
    const emailSent = await sendVerificationCodeEmail(email, code);

    if (!emailSent) {
      throw new Error("Failed to send verification email");
    }

    return new Response(
      JSON.stringify({ message: "Verification code sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending verification code:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send verification code" }),
      { status: 500 }
    );
  }
}
