import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

import { verifyEmailCode } from "@/app/api/auth/services/email";
import { verifyPhoneCode } from "@/app/api/auth/services/phone";
import { checkRateLimit, formatPhoneNumber } from "@/lib/utils";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, lastName, email, phone, password, code } = body;

    // Validate required fields based on registration type
    if (!name || !lastName || !code) {
      return NextResponse.json(
        { error: "Name, last name, and verification code are required" },
        { status: 400 }
      );
    }

    // Validate name fields
    if (name.length < 2 || lastName.length < 2) {
      return NextResponse.json(
        {
          error: "Name and last name must be at least 2 characters long",
        },
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
          emailVerified: true,
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
          name,
          lastName,
          password: hashedPassword,
          emailVerified: true,
          phoneVerified: false,
          language: "en", // Set default language
        },
        select: {
          id: true,
          email: true,
          name: true,
          lastName: true,
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
      console.log("Checking registration for phone:", formattedPhone);

      // Check if user already exists with this phone
      const existingUser = await prisma.user.findFirst({
        where: {
          phone: formattedPhone,
        },
      });
      console.log("Existing user found:", existingUser);
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
          name,
          lastName,
          email: null, // Allow null email for phone registration
          password: null, // Allow null password for phone registration
          emailVerified: false,
          phoneVerified: true,
          language: "en", // Set default language
        },
        select: {
          id: true,
          phone: true,
          name: true,
          lastName: true,
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
