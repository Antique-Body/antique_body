import { NextResponse } from "next/server";

import { auth } from "#/auth";
import { userService } from "@/app/api/users/services";

export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { language } = await request.json();

    if (!language) {
      return NextResponse.json(
        { error: "Language is required" },
        { status: 400 }
      );
    }

    // Validate language code
    const validLanguages = ["en", "bs", "de", "hr", "sr", "sl"];
    if (!validLanguages.includes(language)) {
      return NextResponse.json(
        { error: "Invalid language code" },
        { status: 400 }
      );
    }

    try {
      const updatedUser = await userService.updateUserLanguage(
        session.user.id,
        language
      );

      return NextResponse.json({
        message: "Language updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      if (error.message === "User not found") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(
        {
          error: "An error occurred while updating language",
          details: error.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while processing the request",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
