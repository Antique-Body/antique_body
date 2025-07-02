import { PrismaClient } from "@prisma/client";
import twilio from "twilio";

import { userService } from "@/app/api/users/services";
import { formatPhoneNumber } from "@/lib/utils";

const prisma = new PrismaClient();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendVerificationCode(phone) {
  try {
    const formattedPhone = formatPhoneNumber(phone);

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing unused codes for this phone
    await prisma.phoneVerification.deleteMany({
      where: {
        phone: formattedPhone,
      },
    });

    // Create new verification code
    await prisma.phoneVerification.create({
      data: {
        phone: formattedPhone,
        code,
        expires: expiresAt,
      },
    });

    // Send SMS using Twilio
    try {
      await twilioClient.messages.create({
        body: `Your verification code is: ${code}. It will expire in 10 minutes.`,
        to: formattedPhone,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
    } catch (smsError) {
      console.error("Error sending SMS:", smsError);
      // If SMS fails, we still want to return true since the code was generated
      // and stored in the database
    }

    return true;
  } catch (error) {
    console.error("Error sending verification code:", error);
    return false;
  }
}

export async function verifyPhoneCode(phone, code, isRegistration = false) {
  try {
    const formattedPhone = formatPhoneNumber(phone);

    // Find the most recent unused code for this phone
    const verificationCode = await prisma.phoneVerification.findFirst({
      where: {
        phone: formattedPhone,
        code,
        used: false,
        expires: {
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

    // Only mark as used if it's not a registration verification
    if (!isRegistration) {
      await prisma.phoneVerification.update({
        where: { id: verificationCode.id },
        data: { used: true },
      });
    }

    return true;
  } catch (error) {
    console.error("Error verifying code:", error);
    return false;
  }
}

// Re-export findUserByPhone from userService
export const findUserByPhone = userService.findUserByPhone;
