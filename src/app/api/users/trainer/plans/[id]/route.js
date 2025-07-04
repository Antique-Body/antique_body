import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";
import // ... other validators ...
"@/middleware/validation";

const ALLOWED_TRAINING_FIELDS = [
  "title",
  "description",
  "coverImage",
  "price",
  "duration",
  "durationType",
  "keyFeatures",
  "trainingType",
  "timeline",
  "features",
  "sessionsPerWeek",
  "sessionFormat",
  "difficultyLevel",
  "schedule",
  "isActive",
  "isPublished",
];
const ALLOWED_NUTRITION_FIELDS = [
  "title",
  "description",
  "coverImage",
  "price",
  "duration",
  "durationType",
  "keyFeatures",
  "timeline",
  "nutritionInfo",
  "mealTypes",
  "supplementRecommendations",
  "cookingTime",
  "targetGoal",
  "days",
  "recommendedFrequency",
  "adaptability",
  "isActive",
  "isPublished",
];

function filterAllowedFields(data, allowedFields) {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key))
  );
}

// GET: Fetch single plan by id and type
export async function GET(req, { params }) {
  try {
    const { id } = params;
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
    return NextResponse.json(plan);
  } catch (error) {
    console.error("GET /api/users/trainer/plans/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
    const { type, ...updateData } = body;
    const allowedFields =
      type === "nutrition" ? ALLOWED_NUTRITION_FIELDS : ALLOWED_TRAINING_FIELDS;
    const filteredData = filterAllowedFields(updateData, allowedFields);
    // Optionally, add more validation here (e.g., check types, ranges)
    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update." },
        { status: 400 }
      );
    }
    const model =
      type === "nutrition" ? prisma.nutritionPlan : prisma.trainingPlan;
    const plan = await model.update({
      where: { id: id, trainerInfoId: trainerInfo.id },
      data: filteredData,
    });
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Soft delete plan by id
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
    const model =
      type === "nutrition" ? prisma.nutritionPlan : prisma.trainingPlan;
    const plan = await model.findUnique({
      where: { id: id, trainerInfoId: trainerInfo.id },
    });
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }
    await model.update({
      where: { id: id, trainerInfoId: trainerInfo.id },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    // TODO: Replace with proper logging mechanism
    // logger.error("[DELETE] error:", error); // Example for future logger
    // For now, use console.error as fallback
    console.error("[DELETE] error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
