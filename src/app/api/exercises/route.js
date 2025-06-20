import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { exerciseService } from "../users/services";

import { auth } from "#/auth";
import { validateExercise } from "@/middleware/validation";

const prisma = new PrismaClient();

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

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in exercises API:", error);
    return NextResponse.json(
      {
        exercises: [],
        pagination: { total: 0, pages: 1, currentPage: 1, limit: 0 },
      },
      { status: 200 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { valid, errors } = validateExercise(body);
    
    if (!valid) {
      return NextResponse.json(
        { success: false, error: errors },
        { status: 400 }
      );
    }

    // Get trainer profile ID from the authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!trainerProfile) {
      return NextResponse.json(
        { success: false, error: "Trainer profile not found" },
        { status: 404 }
      );
    }

    const exercise = await exerciseService.createExerciseWithDetails(
      body,
      trainerProfile.id
    );

    return NextResponse.json(
      { success: true, data: exercise },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating exercise:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
} 