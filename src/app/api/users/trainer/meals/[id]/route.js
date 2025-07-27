import { NextResponse } from "next/server";

import { auth } from "#/auth";
import { validateMeal } from "@/middleware/validation";

import { mealService } from "../../../services";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const meal = await mealService.getMealById(id);

    if (!meal) {
      return NextResponse.json(
        { success: false, error: "Meal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: meal });
  } catch (error) {
    console.error("Error fetching meal:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request, { params }) {
  const prisma = (await import("@/lib/prisma")).default;

  try {
    const { id } = await params;
    const body = await request.json();

    const { valid, errors } = validateMeal(body);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: errors },
        { status: 400 }
      );
    }

    // Check if user is authorized to update this meal
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const meal = await prisma.meal.findUnique({
      where: { id },
      include: {
        trainerInfo: {
          include: {
            trainerProfile: true,
          },
        },
      },
    });

    if (!meal) {
      return NextResponse.json(
        { success: false, error: "Meal not found" },
        { status: 404 }
      );
    }

    // Check if the meal belongs to the authenticated trainer
    if (meal.trainerInfo.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to update this meal" },
        { status: 403 }
      );
    }

    const updatedMeal = await mealService.updateMeal(id, body);

    return NextResponse.json(
      { success: true, data: updatedMeal },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating meal:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  const prisma = (await import("@/lib/prisma")).default;

  try {
    const { id } = await params;

    // Check if user is authorized to delete this meal
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const meal = await prisma.meal.findUnique({
      where: { id },
      include: {
        trainerInfo: {
          include: {
            trainerProfile: true,
          },
        },
      },
    });

    if (!meal) {
      return NextResponse.json(
        { success: false, error: "Meal not found" },
        { status: 404 }
      );
    }

    // Check if the meal belongs to the authenticated trainer
    if (meal.trainerInfo.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to delete this meal" },
        { status: 403 }
      );
    }

    await mealService.deleteMeal(id);

    return NextResponse.json(
      { success: true, message: "Meal deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting meal:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
