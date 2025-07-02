import { NextResponse } from "next/server";

import { userService } from "@/app/api/users/services";
import { formatPhoneNumber } from "@/lib/utils";

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

    // 1. Email + password login
    if (isEmailLogin && password) {
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
          phone: user.phone,
          role: user.role,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
        },
      });
    }

    // 2. Phone + password login
    if (isPhoneLogin && password) {
      const formattedPhone = formatPhoneNumber(phone);
      const user = await userService.findUserByPhone(formattedPhone);
      if (!user) {
        return NextResponse.json(
          { error: "Invalid phone number or password" },
          { status: 401 }
        );
      }
      if (!user.password) {
        return NextResponse.json(
          {
            error:
              "This account was created with email or code. Please use email or code login.",
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
          { error: "Invalid phone number or password" },
          { status: 401 }
        );
      }
      return NextResponse.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
        },
      });
    }

    // 3. Phone + code login (SMS)
    if (isPhoneLogin && code) {
      const formattedPhone = formatPhoneNumber(phone);
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
          email: user.email,
          phone: user.phone,
          role: user.role,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
        },
      });
    }

    // Ako nije prepoznat login način
    return NextResponse.json(
      { error: "Invalid login credentials" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to login. Please try again." },
      { status: 500 }
    );
  }
}
