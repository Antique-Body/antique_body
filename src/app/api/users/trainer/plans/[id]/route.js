import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { auth } from "#/auth";

const prisma = new PrismaClient();

/**
 * Retrieves a single training or nutrition plan by its ID for the authenticated trainer.
 * 
 * The plan type is determined by the "type" query parameter ("training" by default). Returns the plan data as JSON if found, or an appropriate error response if not authenticated, not authorized, or not found.
 */
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "training";
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Dohvati trainerInfoId preko userId
    const trainerInfo = await prisma.trainerInfo.findUnique({
      where: { userId: session.user.id },
    });
    if (!trainerInfo) {
      return NextResponse.json(
        { error: "Trainer info not found" },
        { status: 404 }
      );
    }
    let plan;
    if (type === "nutrition") {
      plan = await prisma.nutritionPlan.findUnique({
        where: { id: id, trainerInfoId: trainerInfo.id },
      });
    } else {
      plan = await prisma.trainingPlan.findUnique({
        where: { id: id, trainerInfoId: trainerInfo.id },
      });
    }
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }
    // Filter out internal fields before returning
    const { ...userPlan } = plan;
    return NextResponse.json({ ...userPlan, createdAt: plan.createdAt });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Updates a training or nutrition plan by its ID for the authenticated trainer.
 * 
 * Accepts update data and plan type in the request body, verifies trainer authorization, and updates the corresponding plan record. Returns the updated plan as JSON, or an error response if authorization fails or the plan is not found.
 */
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const trainerInfo = await prisma.trainerInfo.findUnique({
      where: { userId: session.user.id },
    });
    if (!trainerInfo) {
      return NextResponse.json(
        { error: "Trainer info not found" },
        { status: 404 }
      );
    }
    let plan;
    const { type, ...updateData } = body;
    if (type === "nutrition") {
      plan = await prisma.nutritionPlan.update({
        where: { id: id, trainerInfoId: trainerInfo.id },
        data: updateData,
      });
    } else {
      plan = await prisma.trainingPlan.update({
        where: { id: id, trainerInfoId: trainerInfo.id },
        data: updateData,
      });
    }
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Performs a soft delete on a training or nutrition plan by setting its `isActive` field to false.
 * 
 * The plan is identified by its ID and type (either "training" or "nutrition", defaulting to "training"). Only plans belonging to the authenticated trainer are affected. Returns a success response if the operation completes, or an error response if the plan is not found or the user is unauthorized.
 */
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "training";
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const trainerInfo = await prisma.trainerInfo.findUnique({
      where: { userId: session.user.id },
    });
    if (!trainerInfo) {
      return NextResponse.json(
        { error: "Trainer info not found" },
        { status: 404 }
      );
    }
    let plan;
    if (type === "nutrition") {
      plan = await prisma.nutritionPlan.findUnique({
        where: { id: id, trainerInfoId: trainerInfo.id },
      });
      if (!plan) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
      }
      await prisma.nutritionPlan.update({
        where: { id: id, trainerInfoId: trainerInfo.id },
        data: { isActive: false },
      });
    } else {
      plan = await prisma.trainingPlan.findUnique({
        where: { id: id, trainerInfoId: trainerInfo.id },
      });
      if (!plan) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
      }
      await prisma.trainingPlan.update({
        where: { id: id, trainerInfoId: trainerInfo.id },
        data: { isActive: false },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
