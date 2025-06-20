import { NextResponse } from "next/server";

import { exerciseService } from "../users/services";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit"));
    const page = parseInt(searchParams.get("page")) || 1;

    // Filters
    const search = searchParams.get("search") || null;
    const type = searchParams.get("type") || null;
    const level = searchParams.get("level") || null;
    const location = searchParams.get("location") || null;
    const equipment = searchParams.get("equipment") || null;

    // Sorting
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const result = await exerciseService.getAllExercises({
      limit,
      page,
      search,
      type,
      level,
      location,
      equipment,
      sortBy,
      sortOrder,
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
