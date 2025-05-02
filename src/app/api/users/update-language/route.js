import { isAuthenticated } from "@/middleware/auth";
import { userService } from "@/services/users";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  try {
    const { authenticated, user } = await isAuthenticated(request);
    console.log('Auth check result:', { authenticated, user });

    if (!authenticated) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { language } = body;
    console.log('Request body:', { language, userEmail: user.email });

    if (!language) {
      return NextResponse.json({ error: "Language is required" }, { status: 400 });
    }

    // Validate language code
    const validLanguages = ['en', 'bs', 'de', 'hr', 'sr', 'sl'];
    if (!validLanguages.includes(language)) {
      return NextResponse.json({ error: "Invalid language code" }, { status: 400 });
    }

    try {
      console.log('Attempting to update user language:', { userEmail: user.email, language });
      const updatedUser = await userService.updateUserLanguage(user.email, language);
      console.log('User updated successfully:', updatedUser);
      
      return NextResponse.json({
        message: "Language updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating language:", error);
      
      if (error.message === "User not found") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      
      return NextResponse.json({ 
        error: "An error occurred while updating language",
        details: error.message 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in update-language route:", error);
    return NextResponse.json({ 
      error: "An error occurred while processing the request",
      details: error.message 
    }, { status: 500 });
  }
} 