import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { exerciseService } from "../../services";

import { auth } from "#/auth";
import { validateExercise } from "@/middleware/validation";

const prisma = new PrismaClient();

export async function GET(_request) {
  try {
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

    const exercises = await exerciseService.getExercisesByTrainerId(
      trainerProfile.id
    );

    return NextResponse.json({ success: true, data: exercises });
  } catch (error) {
    console.error("Error fetching trainer exercises:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { valid, errors } = validateExercise(body);

    if (!valid) {
      return NextResponse.json(
        { success: false, error: errors },
        { status: 400 }
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
