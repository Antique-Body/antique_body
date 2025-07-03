import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "#/auth";

const prisma = new PrismaClient();

// GET: Fetch single plan by id and type
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
    const { trainerInfoId, deletedAt, updatedAt, createdAt, ...userPlan } =
      plan;
    return NextResponse.json(userPlan);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update plan by id
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

// DELETE: Soft delete plan by id
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
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
    // Soft delete: set isActive to false
    let plan = await prisma.trainingPlan.update({
      where: { id: id, trainerInfoId: trainerInfo.id },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
