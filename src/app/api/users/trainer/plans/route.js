import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

// GET: Fetch plans by type (training/nutrition)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "training";
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Fetch trainerInfoId using userId
    const trainerInfo = await prisma.trainerInfo.findUnique({
      where: { userId: session.user.id },
    });
    if (!trainerInfo) {
      return NextResponse.json(
        { error: "Trainer info not found" },
        { status: 404 }
      );
    }

    // Check if basic mode is requested (for overview pages)
    const basic = searchParams.get("basic") === "true";

    // DRY: Model and select fields by type
    const modelMap = {
      nutrition: {
        model: prisma.nutritionPlan,
        select: basic
          ? {
              id: true,
              title: true,
              description: true,
              coverImage: true,
              price: true,
              duration: true,
              durationType: true,
              clientCount: true,
              createdAt: true,
            }
          : {
              id: true,
              title: true,
              description: true,
              coverImage: true,
              price: true,
              duration: true,
              durationType: true,
              clientCount: true,
              createdAt: true,
              keyFeatures: true,
              timeline: true,
              nutritionInfo: true,
              mealTypes: true,
              supplementRecommendations: true,
              cookingTime: true,
              targetGoal: true,
              recommendedFrequency: true,
              adaptability: true,
              days: true,
            },
      },
      training: {
        model: prisma.trainingPlan,
        select: basic
          ? {
              id: true,
              title: true,
              description: true,
              coverImage: true,
              price: true,
              duration: true,
              durationType: true,
              clientCount: true,
              createdAt: true,
            }
          : {
              id: true,
              title: true,
              description: true,
              coverImage: true,
              price: true,
              duration: true,
              durationType: true,
              clientCount: true,
              createdAt: true,
              keyFeatures: true,
              timeline: true,
              features: true,
              schedule: true,
              sessionsPerWeek: true,
              sessionFormat: true,
              trainingType: true,
              difficultyLevel: true,
            },
      },
    };
    const planType = type === "nutrition" ? "nutrition" : "training";
    const { model, select } = modelMap[planType];
    const plans = await model.findMany({
      where: { trainerInfoId: trainerInfo.id },
      orderBy: { createdAt: "desc" },
      select,
    });

    // Calculate dynamic clientCount by counting active assigned plans
    const plansWithClientCount = await Promise.all(
      plans.map(async (plan) => {
        // For both training and nutrition plans, we use assignedTrainingPlan table
        // (this might need to be adjusted if nutrition plans have a separate assignment table)
        const clientCount = await prisma.assignedTrainingPlan.count({
          where: {
            originalPlanId: plan.id,
            status: "active",
          },
        });
        return { ...plan, type: planType, clientCount };
      })
    );

    return NextResponse.json(plansWithClientCount);
  } catch (error) {
    return handleApiError("GET /plans", error);
  }
}

// POST: Create plan by type or payload structure
export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Fetch trainerInfoId using userId
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
    // Validation for required fields
    const requiredFields = ["title", "description", "duration", "durationType"];
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required field(s): ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }
    if (
      body.price !== undefined &&
      (typeof body.price !== "number" || isNaN(body.price) || body.price < 0)
    ) {
      return NextResponse.json(
        { error: "Price must be a non-negative number if provided." },
        { status: 400 }
      );
    }
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
          supplementRecommendations: body.supplementRecommendations || null,
          cookingTime: body.cookingTime || null,
          targetGoal: body.targetGoal || null,
          days: body.days || null,
          recommendedFrequency: body.recommendedFrequency || null,
          adaptability: body.adaptability || null,

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

          trainerInfoId: trainerInfo.id,
        },
      });
    }
    return NextResponse.json(plan);
  } catch (error) {
    return handleApiError("POST /plans", error);
  }
}

// Helper to infer plan type if not provided
function inferPlanType(body) {
  if (body.nutritionInfo || body.mealTypes) return "nutrition";
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
    // Fetch trainerInfoId using userId
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
    return handleApiError("GET /plans/:id", error);
  }
}

// Centralized error handler
function handleApiError(routeName, error) {
  console.error(`${routeName} error:`, error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
