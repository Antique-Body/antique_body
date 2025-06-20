import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { exerciseService } from "../../users/services";

import { auth } from "#/auth";
import { validateExercise } from "@/middleware/validation";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const exercise = await exerciseService.getExerciseById(id);

    if (!exercise) {
      return NextResponse.json(
        { success: false, error: "Exercise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: exercise });
  } catch (error) {
    console.error("Error fetching exercise:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const { valid, errors } = validateExercise(body);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: errors },
        { status: 400 }
      );
    }

    // Check if user is authorized to update this exercise
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: { trainerProfile: true },
    });

    if (!exercise) {
      return NextResponse.json(
        { success: false, error: "Exercise not found" },
        { status: 404 }
      );
    }

    // Check if the exercise belongs to the authenticated trainer
    if (exercise.trainerProfile.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to update this exercise" },
        { status: 403 }
      );
    }

    const updatedExercise = await exerciseService.updateExercise(id, body);

    return NextResponse.json(
      { success: true, data: updatedExercise },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating exercise:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Check if user is authorized to delete this exercise
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: { trainerProfile: true },
    });

    if (!exercise) {
      return NextResponse.json(
        { success: false, error: "Exercise not found" },
        { status: 404 }
      );
    }

    // Check if the exercise belongs to the authenticated trainer
    if (exercise.trainerProfile.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to delete this exercise" },
        { status: 403 }
      );
    }

    await exerciseService.deleteExercise(id);

    return NextResponse.json(
      { success: true, message: "Exercise deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting exercise:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
