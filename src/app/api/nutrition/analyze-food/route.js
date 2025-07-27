import { NextResponse } from "next/server";

import { foodAnalysisService } from "@/app/api/users/services";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const manualInput = formData.get("manualInput") === "true";

    let analysisData = null;

    if (manualInput) {
      // Handle manual input
      const manualFoodName = formData.get("manualFoodName");
      const manualServingSize = formData.get("manualServingSize");
      const manualServingUnit = formData.get("manualServingUnit");
      const manualDescription = formData.get("manualDescription");

      if (!manualFoodName || !manualServingSize || !manualServingUnit) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Please provide food name, serving size, and unit for manual input",
          },
          { status: 400 }
        );
      }

      analysisData = {
        isManual: true,
        foodName: manualFoodName.trim(),
        servingSize: manualServingSize,
        servingUnit: manualServingUnit,
        description: manualDescription?.trim() || "",
      };
    } else {
      // Handle image analysis
      if (!file) {
        return NextResponse.json(
          {
            success: false,
            error: "No image file provided",
          },
          { status: 400 }
        );
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            error: "Please upload a valid image file",
          },
          { status: 400 }
        );
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Image file too large. Please upload an image smaller than 10MB",
          },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      analysisData = Buffer.from(arrayBuffer);
    }

    // Analyze the food
    const result = await foodAnalysisService.analyzeFood(
      analysisData,
      manualInput ? analysisData : null
    );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      );
    }

    // Return successful analysis
    return NextResponse.json({
      success: true,
      ...result.data,
    });
  } catch (error) {
    console.error("Food analysis API error:", error);

    // Handle specific error types
    if (error.message.includes("rate limit")) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please wait a moment before trying again.",
        },
        { status: 429 }
      );
    }

    if (error.message.includes("network") || error.message.includes("fetch")) {
      return NextResponse.json(
        {
          success: false,
          error: "Network error. Please check your connection and try again.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze food. Please try again or use manual input.",
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for health check
export async function GET() {
  return NextResponse.json({
    status: "Food Analysis API is running",
    models: [
      "nateraw/food",
      "google/vit-base-patch16-224",
      "microsoft/resnet-50",
      "Kaludi/food-category-classification-v2.0",
    ],
    databases: ["USDA", "Nutritionix", "OpenFoodFacts"],
  });
}
