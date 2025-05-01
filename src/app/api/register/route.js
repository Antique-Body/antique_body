import { sendVerificationEmail } from "@/app/utils/email";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import crypto from "crypto";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();

    const { email, password, name, lastName } = body;

    if (!email || !password || !name || !lastName) {
     
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Simple password validation - at least 6 characters
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Hash password
      const hashedPassword = await hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          name,
          lastName,
          password: hashedPassword,
          emailVerificationToken: verificationToken,
          emailVerified: false,
        },
      });


      // Send verification email
      try {
        const emailSent = await sendVerificationEmail(email, verificationToken);
        if (!emailSent) {
          // Don't return error here, just log it
        }
      } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        // Don't return error here, just log it
      }

      return NextResponse.json({
        message: "Registration successful. Please check your email to verify your account.",
      });
    } catch (prismaError) {
      console.error("Prisma error:", prismaError);
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Registration error details:", error);
    return NextResponse.json(
      { error: "Failed to register user. Please try again." },
      { status: 500 }
    );
  }
} 