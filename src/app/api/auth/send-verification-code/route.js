import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { sendVerificationCode as sendEmailCode } from "../services/email";
import { sendVerificationCode as sendPhoneCode } from "../services/phone";

import { formatPhoneNumber } from "@/lib/utils";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, phone } = await request.json();

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Either email or phone number is required" },
        { status: 400 }
      );
    }

    let success;
    let type;

    if (email) {
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

      success = await sendEmailCode(email);
      type = "email";
    } else {
      // Format phone number
      const formattedPhone = formatPhoneNumber(phone);
      console.log("Checking send-code for phone:", formattedPhone);

      // Check if user exists with this phone
      const existingUser = await prisma.user.findFirst({
        where: {
          phone: formattedPhone,
          // phoneVerified: true, // Dodaj ako želiš samo verifikovane
        },
      });

      if (!existingUser) {
        return NextResponse.json(
          { error: "User with this phone number does not exist" },
          { status: 400 }
        );
      }

      success = await sendPhoneCode(formattedPhone);
      type = "phone";
    }

    if (!success) {
      return NextResponse.json(
        { error: `Failed to send verification code to ${type}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Verification code sent successfully to ${type}`,
      type,
    });
  } catch (error) {
    console.error("Error sending verification code:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
