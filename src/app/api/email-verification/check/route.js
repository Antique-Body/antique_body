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