import { NextResponse } from "next/server";

import { exerciseService } from "../users/services";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract filter parameters
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const level = searchParams.get("level") || "";
    const location = searchParams.get("location") || "";
    const equipment = searchParams.get("equipment") || "";
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;

    const result = await exerciseService.getAllExercises({
      search,
      type,
      level,
      location,
      equipment,
      sortBy,
      sortOrder,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      exercises: result.exercises,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error in exercises API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        exercises: [],
        pagination: { total: 0, pages: 1, currentPage: 1, limit: 0 },
      },
      { status: 500 }
    );
  }
}
