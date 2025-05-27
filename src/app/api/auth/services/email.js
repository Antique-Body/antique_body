import { PrismaClient } from "@prisma/client";

import { sendVerificationCodeEmail } from "@/lib/email";

const prisma = new PrismaClient();

/**
 * Sends a verification code to the specified email
 * @param {string} email - The email to send the code to
 * @returns {Promise<boolean>} - Whether the code was sent successfully
 */
export async function sendVerificationCode(email) {
  try {
    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing unused codes for this email
    await prisma.emailVerification.deleteMany({
      where: {
        email,
        used: false,
      },
    });

    // Create new verification code
    await prisma.emailVerification.create({
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

    return true;
  } catch (error) {
    console.error("Error sending verification code:", error);
    return false;
  }
}

/**
 * Verifies a code for the specified email
 * @param {string} email - The email to verify
 * @param {string} code - The code to verify
 * @returns {Promise<boolean>} - Whether the code is valid
 */
export async function verifyEmailCode(email, code) {
  try {
    // Find the most recent unused code for this email
    const verificationCode = await prisma.emailVerification.findFirst({
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
    await prisma.emailVerification.update({
      where: { id: verificationCode.id },
      data: { used: true },
    });

    return true;
  } catch (error) {
    console.error("Error verifying code:", error);
    return false;
  }
}
