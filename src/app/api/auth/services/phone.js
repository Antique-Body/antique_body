import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function formatPhoneNumber(phone) {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Add country code if not present
  if (!cleaned.startsWith("1")) {
    return `1${cleaned}`;
  }

  return cleaned;
}

export async function sendVerificationCode(phone) {
  try {
    const formattedPhone = formatPhoneNumber(phone);

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing unused codes for this phone
    await prisma.phoneVerificationCode.deleteMany({
      where: {
        phone: formattedPhone,
        used: false,
      },
    });

    // Create new verification code
    await prisma.phoneVerificationCode.create({
      data: {
        phone: formattedPhone,
        code,
        expiresAt,
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

export async function verifyCode(phone, code) {
  try {
    const formattedPhone = formatPhoneNumber(phone);

    // Find the most recent unused code for this phone
    const verificationCode = await prisma.phoneVerificationCode.findFirst({
      where: {
        phone: formattedPhone,
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
    await prisma.phoneVerificationCode.update({
      where: { id: verificationCode.id },
      data: { used: true },
    });

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
