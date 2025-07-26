import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { formatPhoneNumber } from "@/lib/utils";

import { sendVerificationCode as sendEmailCode } from "../services/email";
import { sendVerificationCode as sendPhoneCode } from "../services/phone";


export async function POST(request) {
  try {
    const { email, phone, mode } = await request.json();

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

      if (mode === "register" && existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }

      if (mode === "update" && existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }

      if (mode !== "register" && mode !== "update" && !existingUser) {
        return NextResponse.json(
          { error: "User with this email does not exist" },
          { status: 400 }
        );
      }

      success = await sendEmailCode(email);
      type = "email";
    } else {
      // Format phone number
      const formattedPhone = formatPhoneNumber(phone);

      // Check if user exists with this phone
      const existingUser = await prisma.user.findFirst({
        where: {
          phone: formattedPhone,
        },
      });

      if (mode === "register" && existingUser) {
        return NextResponse.json(
          { error: "User with this phone number already exists" },
          { status: 400 }
        );
      }
      if (mode === "update" && existingUser) {
        return NextResponse.json(
          { error: "User with this phone number already exists" },
          { status: 400 }
        );
      }
      if (mode !== "register" && mode !== "update" && !existingUser) {
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
