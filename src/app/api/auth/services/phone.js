import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function formatPhoneNumber(phone) {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Add country code if not present
  return cleaned;
}

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

    // TODO: Integrate with SMS service
    console.log(`Verification code for ${formattedPhone}: ${code}`);

    return true;
  } catch (error) {
    console.error("Error sending verification code:", error);
    return false;
  }
}

export async function verifyCode(phone, code, isRegistration = false) {
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

export async function findUserByPhone(phone) {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    return await prisma.user.findUnique({
      where: { phone: formattedPhone },
    });
  } catch (error) {
    console.error("Error finding user by phone:", error);
    return null;
  }
}
