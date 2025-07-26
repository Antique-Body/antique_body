import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import { trainerService, exerciseService } from "../services";
import { createDefaultPlansForTrainer } from "../services/planService";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";
import { validateTrainerProfile } from "@/middleware/validation";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const body = await req.json();

    // Removed pricePerSession logic

    // Očekujemo contactEmail i contactPhone u payloadu
    const { trainerProfile, trainerInfoId } =
      await trainerService.createTrainerWithDetails(body, session.user.id);
    // After trainer is created, create default plans (non-blocking)
    if (trainerInfoId) {
      try {
        await createDefaultPlansForTrainer(trainerInfoId);
      } catch (err) {
        console.error("Failed to create default plans:", err);
      }
    }
    return new Response(JSON.stringify(trainerProfile), { status: 201 });
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

    const { searchParams } = new URL(request.url);
    const createDefaults = searchParams.get("createDefaults");
    const mode = searchParams.get("mode"); // 'basic', 'edit', 'settings'

    // Check if this is a request to create default exercises
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

    // Handle different data fetching modes
    let profile;

    switch (mode) {
      case "basic":
        profile = await trainerService.getTrainerProfileBasic(session.user.id);
        break;
      case "edit":
        profile = await trainerService.getTrainerProfileForEdit(
          session.user.id
        );
        break;
      case "settings":
        profile = await trainerService.getTrainerSettings(session.user.id);
        break;
      default:
        // Default to basic mode for dashboard
        profile = await trainerService.getTrainerProfileBasic(session.user.id);
        break;
    }

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

    // Ako payload NEMA trainerProfile, radi se o account settings updateu
    if (!body.trainerProfile) {
      // Dohvati usera
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { accounts: true },
      });
      if (!user) throw new Error("User not found");
      // Ako je OAuth korisnik, onemogući promjene email/password
      const isOAuth = user.accounts?.some(
        (acc) => acc.provider === "google" || acc.provider === "facebook"
      );
      if (isOAuth && (body.email !== user.email || body.newPassword)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Cannot change email or password for OAuth users.",
          }),
          { status: 400 }
        );
      }
      // Provjeri email/phone verifikaciju ako su mijenjani
      if (body.email && body.email !== user.email && !body.emailVerified) {
        throw new Error("Email not verified");
      }
      if (body.phone && body.phone !== user.phone && !body.phoneVerified) {
        throw new Error("Phone not verified");
      }
      // Promjena passworda
      if (body.newPassword) {
        if (!body.currentPassword) throw new Error("Current password required");
        if (!user.password)
          throw new Error("No password set. Use password reset.");
        const isMatch = await bcrypt.compare(
          body.currentPassword,
          user.password
        );
        if (!isMatch) throw new Error("Current password is incorrect");
        const hashed = await bcrypt.hash(body.newPassword, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashed },
        });
      }
      // Update email/phone
      await prisma.user.update({
        where: { id: user.id },
        data: {
          email: body.email,
          phone: body.phone,
          // emailVerified/phoneVerified su već postavljeni kroz verify-code endpoint
        },
      });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // Ako payload IMA trainerProfile, radi standardni update profila
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
