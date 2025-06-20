import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { exerciseService } from "../../services";

import { auth } from "#/auth";
import { validateExercise } from "@/middleware/validation";

const prisma = new PrismaClient();

export async function GET(_request) {
  try {
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

    // Get exercises for this trainer
    const exercises = await exerciseService.getExercisesByTrainerInfoId(
      trainerProfile.trainerInfo.id
    );

    return NextResponse.json({
      success: true,
      exercises: exercises,
    });
  } catch (error) {
    console.error("Error in exercises API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        exercises: [],
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
