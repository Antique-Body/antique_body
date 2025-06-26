import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { mealService } from "../../services";

import { auth } from "#/auth";
import { validateMeal } from "@/middleware/validation";

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

    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: session.user.id },
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
    const mealType = searchParams.get("mealType") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const dietary = searchParams.get("dietary") || "";
    const cuisine = searchParams.get("cuisine") || "";
    const preparationTime = searchParams.get("preparationTime") || "";
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;

    // Get filtered meals for this trainer
    const result = await mealService.getTrainerMealsWithFilters(
      trainerProfile.trainerInfo.id,
      {
        search,
        mealType,
        difficulty,
        dietary,
        cuisine,
        preparationTime,
        sortBy,
        sortOrder,
        page,
        limit,
      }
    );

    return NextResponse.json({
      success: true,
      meals: result.meals,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error in meals API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        meals: [],
        pagination: { total: 0, pages: 1, currentPage: 1, limit: 0 },
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { valid, errors } = validateMeal(body);

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

    const trainerProfile = await prisma.trainerProfile.findUnique({
      where: { userId: session.user.id },
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

    const meal = await mealService.createMealWithDetails(
      body,
      trainerProfile.trainerInfo.id
    );

    return NextResponse.json({ success: true, data: meal }, { status: 201 });
  } catch (error) {
    console.error("Error creating meal:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
