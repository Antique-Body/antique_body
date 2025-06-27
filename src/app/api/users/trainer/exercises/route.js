import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { exerciseService } from "../../services";

import { auth } from "#/auth";
import { validateExercise } from "@/middleware/validation";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get trainer info ID from the authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const trainerProfile = await prisma.trainerProfile.findFirst({
      where: {
        trainerInfo: {
          userId: session.user.id,
        },
      },
      include: { trainerInfo: true },
    });

    if (!trainerProfile) {
      return NextResponse.json(
        { success: false, error: "Trainer profile not found" },
        { status: 404 }
      );
    }

    if (!trainerProfile.trainerInfo) {
      return NextResponse.json(
        { success: false, error: "Trainer info not found" },
        { status: 404 }
      );
    }

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

    // Get filtered exercises for this trainer
    const result = await exerciseService.getTrainerExercisesWithFilters(
      trainerProfile.trainerInfo.id,
      {
        search,
        type,
        level,
        location,
        equipment,
        sortBy,
        sortOrder,
        page,
        limit,
      }
    );

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

    // Get trainer info ID from the authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const trainerProfile = await prisma.trainerProfile.findFirst({
      where: {
        trainerInfo: {
          userId: session.user.id,
        },
      },
      include: { trainerInfo: true },
    });

    if (!trainerProfile) {
      return NextResponse.json(
        { success: false, error: "Trainer profile not found" },
        { status: 404 }
      );
    }

    if (!trainerProfile.trainerInfo) {
      return NextResponse.json(
        { success: false, error: "Trainer info not found" },
        { status: 404 }
      );
    }

    const exercise = await exerciseService.createExerciseWithDetails(
      body,
      trainerProfile.trainerInfo.id
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
