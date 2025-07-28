import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";
import { validateExercise } from "@/middleware/validation";

import { exerciseService } from "../../../services/exerciseService";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
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
    const { id } = await params;
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
      include: {
        trainerInfo: {
          include: {
            trainerProfile: true,
          },
        },
      },
    });

    if (!exercise) {
      return NextResponse.json(
        { success: false, error: "Exercise not found" },
        { status: 404 }
      );
    }

    // Check if the exercise belongs to the authenticated trainer
    if (exercise.trainerInfo.userId !== session.user.id) {
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
    const { id } = await params;

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
      include: {
        trainerInfo: {
          include: {
            trainerProfile: true,
          },
        },
      },
    });

    if (!exercise) {
      return NextResponse.json(
        { success: false, error: "Exercise not found" },
        { status: 404 }
      );
    }

    // Check if the exercise belongs to the authenticated trainer
    if (exercise.trainerInfo.userId !== session.user.id) {
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
