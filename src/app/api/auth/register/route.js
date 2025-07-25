import { hash } from "bcrypt";
import { NextResponse } from "next/server";

import { verifyEmailCode } from "@/app/api/auth/services/email";
import { verifyPhoneCode } from "@/app/api/auth/services/phone";
import prisma from "@/lib/prisma";
import { checkRateLimit, formatPhoneNumber } from "@/lib/utils";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, phone, password, code } = body;

    // Validate required fields based on registration type
    if (!code) {
      return NextResponse.json(
        { error: "Verification code is required" },
        { status: 400 }
      );
    }

    // Determine registration type and validate accordingly
    const isEmailRegistration = !!email;
    const isPhoneRegistration = !!phone;

    if (!isEmailRegistration && !isPhoneRegistration) {
      return NextResponse.json(
        { error: "Either email or phone number is required" },
        { status: 400 }
      );
    }

    if (isEmailRegistration && isPhoneRegistration) {
      return NextResponse.json(
        { error: "Please provide either email or phone number, not both" },
        { status: 400 }
      );
    }

    let user;

    // Email registration specific validation
    if (isEmailRegistration) {
      if (!password) {
        return NextResponse.json(
          { error: "Password is required for email registration" },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters long" },
          { status: 400 }
        );
      }

      // Check if user already exists with this email
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          emailVerified: {
            not: null, // Check if email is verified (has a date)
          },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }

      // Verify email code
      const isCodeValid = await verifyEmailCode(email, code);
      if (!isCodeValid) {
        return NextResponse.json(
          { error: "Invalid or expired verification code" },
          { status: 400 }
        );
      }

      // Hash password
      const hashedPassword = await hash(password, 12);

      // Create user
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          emailVerified: new Date(),
          phoneVerified: null,
          language: "en", // Set default language
        },
        select: {
          id: true,
          email: true,
          role: true,
          emailVerified: true,
          phoneVerified: true,
        },
      });
    }

    // Phone registration specific validation
    if (isPhoneRegistration) {
      // Check rate limit
      const rateLimitKey = `register_${phone}`;
      const isAllowed = await checkRateLimit(rateLimitKey, 3, 60 * 60 * 1000); // 3 attempts per hour
      if (!isAllowed) {
        return NextResponse.json(
          { error: "Too many registration attempts. Please try again later." },
          { status: 429 }
        );
      }

      // Format phone number
      const formattedPhone = formatPhoneNumber(phone);

      // Check if user already exists with this phone
      const existingUser = await prisma.user.findFirst({
        where: {
          phone: formattedPhone,
        },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "User with this phone number already exists" },
          { status: 400 }
        );
      }

      // Verify phone code
      const isCodeValid = await verifyPhoneCode(formattedPhone, code, true);
      if (!isCodeValid) {
        return NextResponse.json(
          { error: "Invalid or expired verification code" },
          { status: 400 }
        );
      }

      // Create user
      user = await prisma.user.create({
        data: {
          phone: formattedPhone,
          email: null, // Allow null email for phone registration
          password: null, // Allow null password for phone registration
          emailVerified: null, // Use null instead of false
          phoneVerified: new Date(),
          language: "en", // Set default language
        },
        select: {
          id: true,
          phone: true,
          role: true,
          emailVerified: true,
          phoneVerified: true,
        },
      });
    }

    return NextResponse.json({
      message: "Registration successful",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user. Please try again." },
      { status: 500 }
    );
  }
}
