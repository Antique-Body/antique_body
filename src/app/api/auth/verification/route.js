import { NextResponse } from 'next/server';

// Helper function to handle verification responses
const handleVerificationResponse = (success, message, status = 200) => {
  return NextResponse.json(
    { success, message },
    { status }
  );
};

// Check verification status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return handleVerificationResponse(
        false,
        'Token and email are required',
        400
      );
    }

    // Add your verification check logic here
    // const isVerified = await checkVerificationStatus(token, email);

    return handleVerificationResponse(
      true,
      'Verification status checked successfully'
    );
  } catch (error) {
    return handleVerificationResponse(
      false,
      error.message,
      500
    );
  }
}

// Verify email
export async function POST(request) {
  try {
    const data = await request.json();
    const { email, token } = data;

    if (!email || !token) {
      return handleVerificationResponse(
        false,
        'Email and token are required',
        400
      );
    }

    // Add your email verification logic here
    // await verifyEmail(email, token);

    return handleVerificationResponse(
      true,
      'Email verified successfully'
    );
  } catch (error) {
    return handleVerificationResponse(
      false,
      error.message,
      500
    );
  }
}

// Resend verification email
export async function PUT(request) {
  try {
    const data = await request.json();
    const { email } = data;

    if (!email) {
      return handleVerificationResponse(
        false,
        'Email is required',
        400
      );
    }

    // Add your resend verification logic here
    // await resendVerificationEmail(email);

    return handleVerificationResponse(
      true,
      'Verification email resent successfully'
    );
  } catch (error) {
    return handleVerificationResponse(
      false,
      error.message,
      500
    );
  }
}

// Reset verification
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return handleVerificationResponse(
        false,
        'Email is required',
        400
      );
    }

    // Add your reset verification logic here
    // await resetVerification(email);

    return handleVerificationResponse(
      true,
      'Verification reset successfully'
    );
  } catch (error) {
    return handleVerificationResponse(
      false,
      error.message,
      500
    );
  }
} 