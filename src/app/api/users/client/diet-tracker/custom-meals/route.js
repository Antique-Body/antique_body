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

    // Validate query parameters
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Limit must be between 1 and 100" },
        { status: 400 }
      );
    }

    if (mealType) {
      const validMealTypes = ["breakfast", "lunch", "dinner", "snack"];
      if (!validMealTypes.includes(mealType.toLowerCase())) {
        return NextResponse.json(
          {
            error:
              "Invalid meal type. Must be one of: breakfast, lunch, dinner, snack",
          },
          { status: 400 }
        );
      }
    }

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

    // Validate required fields - only name and mealType are required
    if (!name || !mealType) {
      return NextResponse.json(
        { error: "Name and meal type are required" },
        { status: 400 }
      );
    }

    // Validate name
    if (name.trim().length === 0 || name.trim().length > 100) {
      return NextResponse.json(
        { error: "Name must be between 1 and 100 characters" },
        { status: 400 }
      );
    }

    // Validate meal type
    const validMealTypes = [
      "breakfast",
      "lunch",
      "dinner",
      "snack",
      "drink",
      "dessert",
      "supplement",
      "other",
    ];
    if (!validMealTypes.includes(mealType.toLowerCase())) {
      return NextResponse.json(
        {
          error:
            "Invalid meal type. Must be one of: breakfast, lunch, dinner, snack, drink, dessert, supplement, other",
        },
        { status: 400 }
      );
    }

    // Validate description if provided
    if (description && description.trim().length > 500) {
      return NextResponse.json(
        { error: "Description must be less than 500 characters" },
        { status: 400 }
      );
    }

    // Validate ingredients if provided
    if (ingredients && !Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: "Ingredients must be an array" },
        { status: 400 }
      );
    }

    if (ingredients && ingredients.length > 50) {
      return NextResponse.json(
        { error: "Ingredients list cannot exceed 50 items" },
        { status: 400 }
      );
    }

    if (ingredients) {
      for (const ingredient of ingredients) {
        if (
          typeof ingredient !== "string" ||
          ingredient.trim().length === 0 ||
          ingredient.trim().length > 100
        ) {
          return NextResponse.json(
            {
              error:
                "Each ingredient must be a non-empty string with maximum 100 characters",
            },
            { status: 400 }
          );
        }
      }
    }

    // Ensure nutritional values are numbers or default to 0
    const processedCalories = parseFloat(calories) || 0;
    const processedProtein = parseFloat(protein) || 0;
    const processedCarbs = parseFloat(carbs) || 0;
    const processedFat = parseFloat(fat) || 0;

    // Check if this exact meal already exists for this client
    const existingMeal = await prisma.customMeal.findFirst({
      where: {
        clientId: clientInfo.id,
        name: name.trim(),
        mealType: mealType.toLowerCase(),
        calories: processedCalories,
        protein: processedProtein,
        carbs: processedCarbs,
        fat: processedFat,
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
        calories: processedCalories,
        protein: processedProtein,
        carbs: processedCarbs,
        fat: processedFat,
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

    // Validate ID format (assuming it's a UUID or similar)
    if (typeof customMealId !== "string" || customMealId.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid custom meal ID format" },
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
