import crypto from 'crypto';

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    
    // Update user with new verification token
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        emailVerificationToken: verificationToken,
        emailVerified: false
      }
    });
    
    // Send verification email
    try {
      const { sendVerificationEmail } = await import('@/app/utils/email');
      await sendVerificationEmail(user.email, verificationToken);
    } catch (error) {
      console.error("Error sending verification email:", error);
      return NextResponse.json(
        { success: false, message: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    console.error("Reset verification error:", error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 