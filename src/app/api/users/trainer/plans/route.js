import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { auth } from "#/auth";

const prisma = new PrismaClient();

// GET: Fetch plans by type (training/nutrition)
export async function GET(req) {
  try {
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
    let plans = [];
    if (type === "nutrition") {
      plans = await prisma.nutritionPlan.findMany({
        where: { trainerInfoId: trainerInfo.id, isActive: true },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          coverImage: true,
          price: true,
          duration: true,
          durationType: true,
          clientCount: true,
          createdAt: true,
          isActive: true,
          isPublished: true,
          days: true,
        },
      });
      plans = plans.map((plan) => ({ ...plan, type: "nutrition" }));
    } else {
      plans = await prisma.trainingPlan.findMany({
        where: { trainerInfoId: trainerInfo.id, isActive: true },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          coverImage: true,
          price: true,
          duration: true,
          durationType: true,
          clientCount: true,
          createdAt: true,
          isActive: true,
          isPublished: true,
        },
      });
      plans = plans.map((plan) => ({ ...plan, type: "training" }));
    }
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create plan by type or payload structure
export async function POST(req) {
  try {
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
    const body = await req.json();
    // Accepts type in body or infers from payload
    const type = body.type || inferPlanType(body);
    let plan;
    if (type === "nutrition") {
      plan = await prisma.nutritionPlan.create({
        data: {
          title: body.title,
          description: body.description,
          coverImage: body.coverImage,
          price: body.price,
          duration: body.duration,
          durationType: body.durationType,
          keyFeatures: body.keyFeatures,
          timeline: body.timeline,
          nutritionInfo: body.nutritionInfo || null,
          mealTypes: body.mealTypes || null,
          dietaryRestrictions: body.dietaryRestrictions || null,
          supplementRecommendations: body.supplementRecommendations || null,
          cookingTime: body.cookingTime || null,
          targetGoal: body.targetGoal || null,
          days: body.days || null,
          recommendedFrequency: body.recommendedFrequency || null,
          adaptability: body.adaptability || null,
          isActive: true,
          isPublished: false,
          trainerInfoId: trainerInfo.id,
        },
      });
    } else {
      plan = await prisma.trainingPlan.create({
        data: {
          title: body.title,
          description: body.description,
          coverImage: body.coverImage,
          price: body.price,
          duration: body.duration,
          durationType: body.durationType,
          keyFeatures: body.keyFeatures,
          timeline: body.timeline,
          features: body.features,
          schedule: body.schedule,
          sessionsPerWeek: body.sessionsPerWeek,
          sessionFormat: body.sessionFormat,
          trainingType: body.trainingType,
          difficultyLevel: body.difficultyLevel,
          isActive: true,
          isPublished: false,
          trainerInfoId: trainerInfo.id,
        },
      });
    }
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper to infer plan type if not provided
function inferPlanType(body) {
  if (body.nutritionInfo || body.mealTypes || body.dietaryRestrictions)
    return "nutrition";
  return "training";
}

// GET: Fetch single plan by id and type
export async function GET_planId(req, { params }) {
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
