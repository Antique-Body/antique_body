import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Verify email - handles both GET and POST requests
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return new Response(
        JSON.stringify({ success: false, message: 'Token and email are required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Find user with matching email and token
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        emailVerificationToken: token
      }
    });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid verification token or email' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Update user's verification status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null // Clear the token after verification
      }
    });

    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: 'Email verified successfully' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'An error occurred during verification' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { email, token } = data;

    if (!email || !token) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email and token are required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Find user with matching email and token
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        emailVerificationToken: token
      }
    });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid verification token or email' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Update user's verification status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null // Clear the token after verification
      }
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Email verified successfully' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'An error occurred during verification' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 