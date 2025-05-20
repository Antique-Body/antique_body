import { sendEmailVerificationCode } from '@/app/utils/email';
import { NextResponse } from 'next/server';

// Simple in-memory store (for demo only!)
const emailCodeStore = global.emailCodeStore || (global.emailCodeStore = {});

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // Store code for this email (expires in 10 min)
    emailCodeStore[email] = { code, expires: Date.now() + 10 * 60 * 1000 };
    // Send email
    const sent = await sendEmailVerificationCode(email, code);
    if (!sent) {
      return NextResponse.json({ success: false, message: 'Failed to send code' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Code sent' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Helper for other endpoints to verify code
export function verifyEmailCode(email, code) {
  const entry = emailCodeStore[email];
  if (!entry) return false;
  if (entry.expires < Date.now()) return false;
  return entry.code === code;
} 