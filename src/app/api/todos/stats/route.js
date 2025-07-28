import { NextResponse } from "next/server";

import { auth } from "#/auth";

import { todoService } from "../services";

// GET /api/todos/stats - Get todo statistics for the user
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const stats = await todoService.getTodoStats(session.user.id);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching todo stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch todo statistics" },
      { status: 500 }
    );
  }
}