import { NextResponse } from "next/server";
import { sendVerificationCode as sendEmailCode } from "../services/email";
import { sendVerificationCode as sendPhoneCode } from "../services/phone";

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
      success = await sendEmailCode(email);
      type = "email";
    } else {
      success = await sendPhoneCode(phone);
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
