import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { formatPhoneNumber } from "@/lib/utils";

import { verifyEmailCode } from "../services/email";
import { verifyPhoneCode } from "../services/phone";


export async function POST(request) {
  try {
    const { type, code, value, userId } = await request.json();

    if (!type || !code || !value) {
      return NextResponse.json(
        { error: "Type, code, and value are required" },
        { status: 400 }
      );
    }

    let isValid = false;
    let user = null;

    if (type === "email") {
      // Verify email code
      isValid = await verifyEmailCode(value, code);
      if (isValid) {
        // Samo provjeri kod, NE spašavaj novi email u bazu
        // Možeš update-ati emailVerified na true za postojeći email
        user = await prisma.user.findUnique({
          where: { id: userId },
          include: { accounts: true },
        });
      }
    } else if (type === "phone") {
      // Format phone number
      const formattedPhone = formatPhoneNumber(value);
      // Verify phone code
      isValid = await verifyPhoneCode(formattedPhone, code);
      if (isValid) {
        // Samo provjeri kod, NE spašavaj novi phone u bazu
        user = await prisma.user.findUnique({
          where: { id: userId },
          include: { accounts: true },
        });
      }
    } else {
      return NextResponse.json(
        { error: "Invalid verification type. Must be 'email' or 'phone'" },
        { status: 400 }
      );
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } verified successfully`,
      verified: true,
      user: user
        ? {
            id: user.id,
            email: user.email,
            phone: user.phone,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
          }
        : null,
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
