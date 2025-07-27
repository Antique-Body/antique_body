import { NextResponse } from "next/server";

import { auth } from "#/auth";

import {
  completeMeal,
  uncompleteMeal,
  changeMealOption,
  getDailyDietLog,
  addCustomMealToDay,
  deleteSnackLog,
} from "../../../services/dietTrackerService";


// GET: Get meals for a specific date
export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const dietPlanAssignmentId = searchParams.get("dietPlanAssignmentId");

    if (!date || !dietPlanAssignmentId) {
      return NextResponse.json(
        { error: "Date and diet plan assignment ID are required" },
        { status: 400 }
      );
    }

    const dailyLog = await getDailyDietLog(dietPlanAssignmentId, date);

    if (!dailyLog) {
      return NextResponse.json(
        { error: "No meals found for this date" },
        { status: 404 }
      );
    }

    return NextResponse.json(dailyLog);
  } catch (error) {
    console.error("Error getting meals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Add a custom meal/snack to a specific day
export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { dietPlanAssignmentId, date, customMeal } = body;

    // Validate required fields
    if (!dietPlanAssignmentId || !date || !customMeal) {
      return NextResponse.json(
        {
          error:
            "Diet plan assignment ID, date, and custom meal data are required",
        },
        { status: 400 }
      );
    }

    // Validate custom meal data
    if (
      !customMeal.name ||
      customMeal.calories === undefined ||
      customMeal.protein === undefined ||
      customMeal.carbs === undefined ||
      customMeal.fat === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "Custom meal must include name, calories, protein, carbs, and fat",
        },
        { status: 400 }
      );
    }

    try {
      const newSnackLog = await addCustomMealToDay(
        dietPlanAssignmentId,
        date,
        customMeal
      );

      return NextResponse.json({
        success: true,
        message: "Snack added successfully",
        data: newSnackLog,
      });
    } catch (validationError) {
      // Check if this is a day validation error
      if (
        validationError.message.includes("Cannot") &&
        (validationError.message.includes("past days") ||
          validationError.message.includes("future days"))
      ) {
        return NextResponse.json(
          { error: validationError.message },
          { status: 403 } // Forbidden - day is not editable
        );
      }

      // Re-throw other errors to be caught by outer catch
      throw validationError;
    }
  } catch (error) {
    console.error("Error adding custom meal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH: Update meal status or options
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, mealLogId, newOption } = body;

    if (!action || !mealLogId) {
      return NextResponse.json(
        { error: "Action and meal log ID are required" },
        { status: 400 }
      );
    }

    let result;

    try {
      switch (action) {
        case "complete":
          result = await completeMeal(mealLogId);
          break;

        case "uncomplete":
          result = await uncompleteMeal(mealLogId);
          break;

        case "change-option":
          if (!newOption) {
            return NextResponse.json(
              { error: "New option is required for change-option action" },
              { status: 400 }
            );
          }
          result = await changeMealOption(mealLogId, newOption);
          break;

        default:
          return NextResponse.json(
            { error: "Invalid action" },
            { status: 400 }
          );
      }

      return NextResponse.json({
        success: true,
        message: `Meal ${action} successful`,
        data: result,
      });
    } catch (validationError) {
      // Check if this is a day validation error
      if (
        validationError.message.includes("Cannot") &&
        (validationError.message.includes("past days") ||
          validationError.message.includes("future days"))
      ) {
        return NextResponse.json(
          { error: validationError.message },
          { status: 403 } // Forbidden - day is not editable
        );
      }

      // Re-throw other errors to be caught by outer catch
      throw validationError;
    }
  } catch (error) {
    console.error("Error updating meal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a snack log
export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const snackLogId = searchParams.get("snackLogId");

    if (!snackLogId) {
      return NextResponse.json(
        { error: "Snack log ID is required" },
        { status: 400 }
      );
    }

    try {
      const result = await deleteSnackLog(snackLogId);

      return NextResponse.json({
        success: true,
        message: result.message,
      });
    } catch (validationError) {
      // Check if this is a day validation error
      if (
        validationError.message.includes("Cannot delete snacks") &&
        (validationError.message.includes("past days") ||
          validationError.message.includes("future days"))
      ) {
        return NextResponse.json(
          { error: validationError.message },
          { status: 403 } // Forbidden - day is not editable
        );
      }

      // Re-throw other errors to be caught by outer catch
      throw validationError;
    }
  } catch (error) {
    console.error("Error deleting snack:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
