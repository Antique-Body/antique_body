import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

// GET: Retrieve assigned nutrition plan
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, assignedPlanId } = await params;

    // Get coaching request to verify trainer access
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            clientProfile: {
              select: {
                firstName: true,
                lastName: true,
                dietaryPreferences: true,
              },
            },
          },
        },
        trainer: {
          include: {
            user: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }

    // Check if user is the trainer
    const isTrainer = coachingRequest.trainer.user.id === session.user.id;
    if (!isTrainer) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get assigned nutrition plan
    const assignedPlan = await prisma.dietPlanAssignment.findUnique({
      where: { id: assignedPlanId },
      include: {
        nutritionPlan: true,
        assignedBy: {
          include: {
            trainerProfile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        client: {
          include: {
            clientProfile: {
              select: {
                firstName: true,
                lastName: true,
                dietaryPreferences: true,
              },
            },
          },
        },
      },
    });

    if (!assignedPlan) {
      return NextResponse.json(
        { success: false, error: "Assigned nutrition plan not found" },
        { status: 404 }
      );
    }

    // Check if the assigned plan belongs to the correct client
    if (assignedPlan.clientId !== coachingRequest.client.id) {
      return NextResponse.json(
        { success: false, error: "Plan not assigned to this client" },
        { status: 403 }
      );
    }

    const planData = assignedPlan.planData || (assignedPlan.nutritionPlan ? {
      title: assignedPlan.nutritionPlan.title,
      description: assignedPlan.nutritionPlan.description,
      days: assignedPlan.nutritionPlan.days,
      nutritionInfo: assignedPlan.nutritionPlan.nutritionInfo,
      keyFeatures: assignedPlan.nutritionPlan.keyFeatures,
      timeline: assignedPlan.nutritionPlan.timeline,
      mealTypes: assignedPlan.nutritionPlan.mealTypes,
    } : null);

    return NextResponse.json({
      success: true,
      data: {
        ...assignedPlan,
        client: coachingRequest.client,
        planData,
        // Extract notes and supplementation from plan data
        trainerNotes: planData?.trainerNotes || "",
        supplementationRecommendations: planData?.supplementationRecommendations || "",
      },
    });
  } catch (error) {
    console.error("Error retrieving assigned nutrition plan:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Update assigned nutrition plan
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, assignedPlanId } = await params;
    const body = await request.json();

    // Get coaching request to verify trainer access
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: {
        client: true,
        trainer: {
          include: {
            user: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }

    // Check if user is the trainer
    const isTrainer = coachingRequest.trainer.user.id === session.user.id;
    if (!isTrainer) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get assigned nutrition plan
    const assignedPlan = await prisma.dietPlanAssignment.findUnique({
      where: { id: assignedPlanId },
    });

    if (!assignedPlan) {
      return NextResponse.json(
        { success: false, error: "Assigned nutrition plan not found" },
        { status: 404 }
      );
    }

    // Check if the assigned plan belongs to the correct client
    if (assignedPlan.clientId !== coachingRequest.client.id) {
      return NextResponse.json(
        { success: false, error: "Plan not assigned to this client" },
        { status: 403 }
      );
    }

    // Update the plan data, notes, and supplementation
    const updateData = {
      planData: body.planData,
      updatedAt: new Date(),
    };

    // Add notes and supplementation to the plan data if provided
    if (body.notes !== undefined || body.supplementation !== undefined) {
      const currentPlanData = assignedPlan.planData || {};
      updateData.planData = {
        ...currentPlanData,
        ...body.planData,
        trainerNotes: body.notes !== undefined ? body.notes : currentPlanData.trainerNotes,
        supplementationRecommendations: body.supplementation !== undefined ? body.supplementation : currentPlanData.supplementationRecommendations,
        lastUpdated: new Date().toISOString(),
      };
    }

    const updatedPlan = await prisma.dietPlanAssignment.update({
      where: { id: assignedPlanId },
      data: updateData,
    });

    // Sync changes to client's active diet tracker if this plan is currently active
    try {
      const activeDietPlan = await prisma.dietPlanAssignment.findFirst({
        where: {
          clientId: assignedPlan.clientId,
          status: 'active',
          isActive: true,
        },
        include: {
          dailyLogs: {
            include: {
              mealLogs: true,
            },
          },
        },
      });

      // If this is the active plan, sync the changes to daily logs
      if (activeDietPlan && activeDietPlan.id === assignedPlan.id) {
        console.log('Syncing nutrition plan changes to active diet tracker...');
        
        // Get the updated plan data
        const newPlanData = updateData.planData;
        
        if (newPlanData && newPlanData.days) {
          // Sync each day's meals to existing daily logs
          for (const [dayIndex, dayData] of newPlanData.days.entries()) {
            if (dayData.meals) {
              // Find existing daily log for this day (dayNumber is 1-based)
              const existingDailyLog = activeDietPlan.dailyLogs.find(log => log.dayNumber === dayIndex + 1);
              
              if (existingDailyLog) {
                // Update existing meal logs with new meal data
                for (const [, mealData] of dayData.meals.entries()) {
                  // Find existing meal log by meal name
                  const existingMealLog = existingDailyLog.mealLogs.find(log => log.mealName === mealData.name);
                  
                  if (existingMealLog) {
                    // Update meal log with new data from trainer changes
                    await prisma.mealLog.update({
                      where: { id: existingMealLog.id },
                      data: {
                        mealName: mealData.name,
                        mealTime: mealData.time || existingMealLog.mealTime,
                        // Store all options in selectedOption field with metadata
                        selectedOption: {
                          allOptions: mealData.options || [],
                          selectedIndex: 0, // Default to first option
                          currentOption: mealData.options?.[0] || {},
                        },
                        // Update nutrition based on first option
                        calories: mealData.options?.[0]?.calories || 0,
                        protein: mealData.options?.[0]?.protein || 0,
                        carbs: mealData.options?.[0]?.carbs || 0,
                        fat: mealData.options?.[0]?.fat || 0,
                        updatedAt: new Date(),
                      },
                    });
                  } else if (mealData.options && mealData.options.length > 0) {
                    // Create new meal log if trainer added a new meal
                    await prisma.mealLog.create({
                      data: {
                        dailyDietLogId: existingDailyLog.id,
                        mealName: mealData.name,
                        mealTime: mealData.time || '12:00',
                        // Store all options in selectedOption field with metadata
                        selectedOption: {
                          allOptions: mealData.options,
                          selectedIndex: 0, // Default to first option
                          currentOption: mealData.options[0],
                        },
                        isCompleted: false,
                        calories: mealData.options[0]?.calories || 0,
                        protein: mealData.options[0]?.protein || 0,
                        carbs: mealData.options[0]?.carbs || 0,
                        fat: mealData.options[0]?.fat || 0,
                      },
                    });
                  }
                }
              }
            }
          }
        }

        console.log('Successfully synced nutrition plan changes to client diet tracker');
      }
    } catch (syncError) {
      console.error('Error syncing nutrition plan changes to diet tracker:', syncError);
      // Don't fail the main request if sync fails, just log the error
    }

    return NextResponse.json({
      success: true,
      data: updatedPlan,
      synced: true,
    });
  } catch (error) {
    console.error("Error updating assigned nutrition plan:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}