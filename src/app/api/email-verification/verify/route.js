import { NextResponse } from 'next/server';

import { userService } from '@/services/users';

// Verify email - handles both GET and POST requests
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json(
        { success: false, message: 'Token and email are required' },
        { status: 400 }
      );
    }

    try {
      const updatedUser = await userService.verifyEmail(email, token);
      return NextResponse.json({
        success: true,
        message: 'Email verified successfully',
        user: updatedUser
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred during verification' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { email, token } = data;

    if (!email || !token) {
      return NextResponse.json(
        { success: false, message: 'Email and token are required' },
        { status: 400 }
      );
    }

    try {
      const updatedUser = await userService.verifyEmail(email, token);
      return NextResponse.json({
        success: true,
        message: 'Email verified successfully',
        user: updatedUser
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'An error occurred during verification' },
      { status: 500 }
    );
  }
} 