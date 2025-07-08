import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { status, rejectionReason } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Request ID is required" },
        { status: 400 }
      );
    }

    if (!status || !["accepted", "rejected", "cancelled"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid status is required (accepted, rejected, cancelled)",
        },
        { status: 400 }
      );
    }

    // Get the coaching request
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            clientProfile: true,
          },
        },
        trainer: {
          include: {
            trainerProfile: true,
            user: true,
          },
        },
      },
    });

    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }

    // Verify that the current user is the trainer for this request
    if (coachingRequest.trainer.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to update this request" },
        { status: 403 }
      );
    }

    // Check if request is already responded to
    if (coachingRequest.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Request has already been responded to" },
        { status: 400 }
      );
    }

    // Update the coaching request
    const updatedRequest = await prisma.coachingRequest.update({
      where: { id },
      data: {
        status: status,
        rejectionReason:
          status === "rejected"
            ? rejectionReason
            : coachingRequest.rejectionReason,
        respondedAt: new Date(),
      },
      include: {
        client: {
          include: {
            clientProfile: {
              include: {
                location: true,
                languages: true,
                preferredActivities: true,
              },
            },
          },
        },
        trainer: {
          include: {
            trainerProfile: {
              include: {
                location: true,
                specialties: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating coaching request:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Request ID is required" },
        { status: 400 }
      );
    }

    // Get the coaching request
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }

    // Verify that the current user is the client for this request
    if (coachingRequest.client.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to delete this request" },
        { status: 403 }
      );
    }

    // Only allow deletion if request is pending
    if (coachingRequest.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Can only delete pending requests" },
        { status: 400 }
      );
    }

    // Use a transaction to delete the request and create a cooldown
    await prisma.$transaction(async (tx) => {
      // Delete the coaching request
      await tx.coachingRequest.delete({
        where: { id },
      });

      // Create a cooldown record (24 hours from now)
      const COOLDOWN_HOURS =
        parseInt(process.env.COACHING_REQUEST_COOLDOWN_HOURS, 10) || 24;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + COOLDOWN_HOURS);

      await tx.coachingRequestCooldown.create({
        data: {
          clientId: coachingRequest.clientId,
          trainerId: coachingRequest.trainerId,
          expiresAt,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Coaching request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting coaching request:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
