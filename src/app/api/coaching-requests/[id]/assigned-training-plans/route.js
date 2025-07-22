import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const { id } = await params; // ispravno!
    // Dohvati coaching request
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: {
        client: { include: { user: true } },
        trainer: { include: { user: true } },
      },
    });
    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }
    // Samo trener ili klijent mogu vidjeti
    if (
      session.user.id !== coachingRequest.trainer.userId &&
      session.user.id !== coachingRequest.client.userId
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }
    // Dohvati sve assigned planove za ovog klijenta i trenera
    const assignedPlans = await prisma.assignedTrainingPlan.findMany({
      where: {
        clientId: coachingRequest.clientId,
        trainerId: coachingRequest.trainerId,
      },
      orderBy: { assignedAt: "desc" },
    });
    return NextResponse.json({ success: true, data: assignedPlans });
  } catch (error) {
    console.error("Error fetching assigned training plans:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
