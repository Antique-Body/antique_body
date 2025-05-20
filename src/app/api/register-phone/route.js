import {
  checkRateLimit,
  findUserByPhone,
  formatPhoneNumber,
  prisma,
  verifyPhoneCode,
} from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phone, name, lastName, code } = await req.json();

    // Validate required fields
    if (!phone || !name || !lastName || !code) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate name and lastName
    if (name.length < 2 || lastName.length < 2) {
      return NextResponse.json(
        { error: "Name and last name must be at least 2 characters long" },
        { status: 400 }
      );
    }

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

    // Verify the code
    const verification = await verifyPhoneCode(formattedPhone, code);
    if (!verification) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByPhone(formattedPhone);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        phone: formattedPhone,
        name,
        lastName,
        emailVerified: false,
        email: null,
        phoneVerified: true, // Set to true since we verified the phone
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        phoneVerified: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
