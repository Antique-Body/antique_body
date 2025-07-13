import { NextResponse } from "next/server";
import { auth } from "#/auth";
import prisma from "@/lib/prisma";

// GET: Get custom meal history for client
export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get client info
    const clientInfo = await prisma.clientInfo.findUnique({
      where: { userId: session.user.id },
    });

    if (!clientInfo) {
      return NextResponse.json(
        { error: "Client info not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const mealType = searchParams.get("mealType");
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Build where clause
    const whereClause = {
      clientId: clientInfo.id,
    };

    if (mealType) {
      whereClause.mealType = mealType.toLowerCase();
    }

    // Get custom meals ordered by usage count and last used
    const customMeals = await prisma.customMeal.findMany({
      where: whereClause,
      orderBy: [{ usageCount: "desc" }, { lastUsed: "desc" }],
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: customMeals,
    });
  } catch (error) {
    console.error("Error getting custom meals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Save a new custom meal
export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get client info
    const clientInfo = await prisma.clientInfo.findUnique({
      where: { userId: session.user.id },
    });

    if (!clientInfo) {
      return NextResponse.json(
        { error: "Client info not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      name,
      description,
      mealType,
      calories,
      protein,
      carbs,
      fat,
      ingredients,
    } = body;

    // Validate required fields
    if (
      !name ||
      !mealType ||
      calories === undefined ||
      protein === undefined ||
      carbs === undefined ||
      fat === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if this exact meal already exists for this client
    const existingMeal = await prisma.customMeal.findFirst({
      where: {
        clientId: clientInfo.id,
        name: name.trim(),
        mealType: mealType.toLowerCase(),
        calories: parseFloat(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fat: parseFloat(fat),
      },
    });

    if (existingMeal) {
      // Update usage count and last used date
      const updatedMeal = await prisma.customMeal.update({
        where: { id: existingMeal.id },
        data: {
          usageCount: existingMeal.usageCount + 1,
          lastUsed: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        data: updatedMeal,
        message: "Custom meal usage updated",
      });
    }

    // Create new custom meal
    const customMeal = await prisma.customMeal.create({
      data: {
        clientId: clientInfo.id,
        name: name.trim(),
        description: description?.trim() || null,
        mealType: mealType.toLowerCase(),
        calories: parseFloat(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fat: parseFloat(fat),
        ingredients: ingredients || [],
      },
    });

    return NextResponse.json({
      success: true,
      data: customMeal,
      message: "Custom meal saved successfully",
    });
  } catch (error) {
    console.error("Error saving custom meal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a custom meal
export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get client info
    const clientInfo = await prisma.clientInfo.findUnique({
      where: { userId: session.user.id },
    });

    if (!clientInfo) {
      return NextResponse.json(
        { error: "Client info not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const customMealId = searchParams.get("id");

    if (!customMealId) {
      return NextResponse.json(
        { error: "Custom meal ID is required" },
        { status: 400 }
      );
    }

    // Verify the custom meal belongs to this client
    const customMeal = await prisma.customMeal.findFirst({
      where: {
        id: customMealId,
        clientId: clientInfo.id,
      },
    });

    if (!customMeal) {
      return NextResponse.json(
        { error: "Custom meal not found" },
        { status: 404 }
      );
    }

    // Delete the custom meal
    await prisma.customMeal.delete({
      where: { id: customMealId },
    });

    return NextResponse.json({
      success: true,
      message: "Custom meal deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting custom meal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
