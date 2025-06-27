import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { convertToEUR } from "../../../utils/currency";
import { trainerService, exerciseService } from "../services";

import { auth } from "#/auth";
import { validateTrainerProfile } from "@/middleware/validation";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const body = await req.json();

    // Konvertuj pricePerSession u EUR ako postoji i valuta nije EUR
    if (body.pricePerSession && body.currency && body.currency !== "EUR") {
      try {
        const priceInEUR = await convertToEUR(
          body.pricePerSession,
          body.currency
        );
        body.pricePerSession = priceInEUR;
      } catch (err) {
        // Provjeri različite tipove grešaka za usage limit
        const errorMessage = err.message || "";
        const isUsageLimitError =
          errorMessage.includes("usage_limit_reached") ||
          errorMessage.includes("monthly usage limit") ||
          errorMessage.includes("usage limit") ||
          errorMessage.includes("limit has been reached") ||
          errorMessage.includes("subscription") ||
          errorMessage.includes("upgrade");

        if (isUsageLimitError) {
          // Ako je dosegnut limit, nastavi sa originalnom cijenom ali postavi valutu na EUR

          body.currency = "EUR"; // Postavi valutu na EUR
          // body.pricePerSession ostaje ista kao što je unesena
        } else {
          // Za ostale greške, vrati grešku
          return new Response(
            JSON.stringify({
              error: "Currency conversion failed: " + err.message,
            }),
            {
              status: 400,
            }
          );
        }
      }
    }

    // Očekujemo contactEmail i contactPhone u payloadu
    const trainer = await trainerService.createTrainerWithDetails(
      body,
      session.user.id
    );
    return new Response(JSON.stringify(trainer), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if this is a request to create default exercises
    const { searchParams } = new URL(request.url);
    const createDefaults = searchParams.get("createDefaults");

    if (createDefaults === "true") {
      // Find trainer info
      const trainerInfo = await prisma.trainerInfo.findUnique({
        where: { userId: session.user.id },
        include: {
          exercises: true,
        },
      });

      if (!trainerInfo) {
        return NextResponse.json(
          { success: false, error: "Trainer info not found" },
          { status: 404 }
        );
      }

      // Only create if no exercises exist
      if (trainerInfo.exercises.length === 0) {
        await exerciseService.createDefaultExercises(trainerInfo.id);
        return NextResponse.json({
          success: true,
          message: "Default exercises created successfully",
        });
      } else {
        return NextResponse.json({
          success: true,
          message: "Exercises already exist",
          count: trainerInfo.exercises.length,
        });
      }
    }

    // Regular GET request - return trainer profile
    const profile = await trainerService.getTrainerProfileByUserId(
      session.user.id
    );

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Trainer profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("Error in trainer GET:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        {
          status: 401,
        }
      );
    }
    const body = await req.json();
    const { valid, errors } = validateTrainerProfile(body.trainerProfile);
    if (!valid) {
      return new Response(JSON.stringify({ success: false, error: errors }), {
        status: 400,
      });
    }
    // Pozovi servis (koji očekuje validiran input)
    const updatedProfile = await trainerService.updateTrainerProfile(
      session.user.id,
      body.trainerProfile
    );
    return new Response(
      JSON.stringify({ success: true, data: updatedProfile }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating trainer profile:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
      }
    );
  }
}
