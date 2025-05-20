import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import twilio from "twilio";

const prisma = new PrismaClient();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Helper function to format phone number
function formatPhoneNumber(phone) {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // If the number starts with 0, replace it with the country code
  if (cleaned.startsWith("0")) {
    return `+387${cleaned.slice(1)}`;
  }

  // If the number doesn't start with +, add it
  if (!phone.startsWith("+")) {
    return `+${cleaned}`;
  }

  return phone;
}

// Helper function to validate phone number
function isValidPhoneNumber(phone) {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Check if the number is a valid length (between 8 and 15 digits)
  if (cleaned.length < 8 || cleaned.length > 15) {
    return false;
  }

  // Check if it's not a short code (less than 6 digits)
  if (cleaned.length < 6) {
    return false;
  }

  return true;
}

export async function POST(request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);

    // Validate phone number
    if (!isValidPhoneNumber(formattedPhone)) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid phone number (e.g., 061234567 or +38761234567)",
        },
        { status: 400 }
      );
    }

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the code in the database with 10-minute expiration
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    try {
      // Delete any existing verification codes for this phone number
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
          expires,
        },
      });

      // Send SMS using Twilio
      await twilioClient.messages.create({
        body: `Your verification code for Antique Body is: ${code}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone,
      });

      // Always return the code for testing
      console.log("Verification code:", code);
      return NextResponse.json({
        message: "Verification code sent successfully",
        code,
      });
    } catch (error) {
      console.error("Error in verification process:", error);

      // Delete the verification code if anything fails
      await prisma.phoneVerification.deleteMany({
        where: {
          phone: formattedPhone,
        },
      });

      // Check if it's a Twilio error
      if (error.code === 21265) {
        return NextResponse.json(
          {
            error:
              "Invalid phone number format. Please enter a valid phone number (e.g., 061234567 or +38761234567)",
          },
          { status: 400 }
        );
      }

      if (error.code === 21214) {
        return NextResponse.json(
          {
            error:
              "Invalid phone number. Please check the number and try again.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Failed to send verification code. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending verification code:", error);
    return NextResponse.json(
      { error: "Failed to send verification code. Please try again." },
      { status: 500 }
    );
  }
}
