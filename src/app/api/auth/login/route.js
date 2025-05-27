import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { userService } from "@/app/api/users/services";
import { formatPhoneNumber } from "@/lib/utils";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, phone, password, code } = body;

    // Determine login type
    const isEmailLogin = !!email;
    const isPhoneLogin = !!phone;

    if (!isEmailLogin && !isPhoneLogin) {
      return NextResponse.json(
        { error: "Either email or phone number is required" },
        { status: 400 }
      );
    }

    if (isEmailLogin && isPhoneLogin) {
      return NextResponse.json(
        { error: "Please provide either email or phone number, not both" },
        { status: 400 }
      );
    }

    // Email login
    if (isEmailLogin) {
      if (!password) {
        return NextResponse.json(
          { error: "Password is required for email login" },
          { status: 400 }
        );
      }

      // Find user by email
      const user = await userService.findUserByEmail(email);

      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      if (!user.password) {
        return NextResponse.json(
          {
            error:
              "This account was created with phone number. Please use phone login.",
          },
          { status: 400 }
        );
      }

      // Verify password
      const isPasswordValid = await userService.verifyUserPassword(
        user.id,
        password
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          role: user.role,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
        },
      });
    }

    // Phone login
    if (isPhoneLogin) {
      if (!code) {
        return NextResponse.json(
          { error: "Verification code is required for phone login" },
          { status: 400 }
        );
      }

      // Format phone number
      const formattedPhone = formatPhoneNumber(phone);

      // Find user by phone
      const user = await userService.findUserByPhone(formattedPhone);

      if (!user) {
        return NextResponse.json(
          { error: "Invalid phone number or verification code" },
          { status: 401 }
        );
      }

      // Verify code
      const isCodeValid = await userService.verifyPhoneCode(
        formattedPhone,
        code
      );
      if (!isCodeValid) {
        return NextResponse.json(
          { error: "Invalid phone number or verification code" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        message: "Login successful",
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          lastName: user.lastName,
          role: user.role,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
        },
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to login. Please try again." },
      { status: 500 }
    );
  }
}
