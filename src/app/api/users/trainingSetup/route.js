import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Validation helpers
const validators = {
  environment: value => ["gym", "outside"].includes(value),
  equipment: value => ["with_equipment", "no_equipment"].includes(value),
  experience: value => ["beginner", "intermediate", "advanced", "expert"].includes(value),
  goal: value => ["strength", "muscle", "lose_weight", "endurance"].includes(value),
  frequency: value => {
    const num = Number(value);
    return !isNaN(num) && num >= 1 && num <= 7;
  },
  measurements: (weight, height, bmi) =>
    typeof weight === "number" &&
    typeof height === "number" &&
    typeof bmi === "number" &&
    weight > 0 &&
    height > 0 &&
    bmi > 0,
};

// Error response helper
const errorResponse = (message, details = null, status = 400) =>
  NextResponse.json({ error: message, ...(details && { details }) }, { status });

// Extract and validate data from request
const extractAndValidateData = body => {
  // Extract measurements from the measurements object if it exists
  const { measurements, environment, equipment, experience, goal, frequency } = body;

  // Get weight, height, and bmi from measurements object or directly from body
  const weight = measurements?.weight || body.weight;
  const height = measurements?.height || body.height;
  const bmi = measurements?.bmi || body.bmi;

  // Validate all required fields
  if (!weight || !height || !bmi || !environment || !equipment || !experience || !goal || !frequency) {
    return { error: "Missing required fields" };
  }

  // Validate enum values
  if (!validators.environment(environment)) {
    return { error: "Invalid environment value", details: "Must be 'gym' or 'outside'" };
  }

  if (!validators.equipment(equipment)) {
    return { error: "Invalid equipment value", details: "Must be 'with_equipment' or 'no_equipment'" };
  }

  if (!validators.experience(experience)) {
    return {
      error: "Invalid experience value",
      details: "Must be 'beginner', 'intermediate', 'advanced', or 'expert'",
    };
  }

  if (!validators.goal(goal)) {
    return { error: "Invalid goal value", details: "Must be 'strength', 'muscle', 'lose_weight', or 'endurance'" };
  }

  if (!validators.frequency(frequency)) {
    return { error: "Invalid frequency value", details: "Frequency must be a number between 1 and 7" };
  }

  // Validate data types
  if (!validators.measurements(weight, height, bmi)) {
    return { error: "Invalid measurement values" };
  }

  // Return validated data
  return {
    data: {
      weight: Number(weight),
      height: Number(height),
      bmi: Number(bmi.toFixed(2)),
      environment,
      equipment,
      experience,
      goal,
      frequency: parseInt(frequency, 10),
    },
  };
};

// Save user preferences to database
const saveUserPreferences = async (userId, data) => {
  try {
    return await prisma.userPreferences.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to save user preferences");
  }
};

export async function POST(request) {
  try {
    // Check if user is authenticated and has trainer role
    const roleCheck = await hasRole(request, ["USER"]);

    if (!roleCheck.authorized) {
      return NextResponse.json({ error: roleCheck.message }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = extractAndValidateData(body);

    if (validationResult.error) {
      return errorResponse(validationResult.error, validationResult.details);
    }

    // Get user ID from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return errorResponse("User not found", null, 404);
    }

    // Save user preferences
    const result = await saveUserPreferences(user.id, validationResult.data);

    // Update the session to reflect that training setup is completed
    session.user.hasCompletedTrainingSetup = true;

    // Return success response
    return NextResponse.json({
      preferences: result,
      hasCompletedTrainingSetup: true,
    });
  } catch (error) {
    console.error("Error saving training setup:", error);
    return errorResponse("Failed to save training setup", error.message, 500);
  }
}
