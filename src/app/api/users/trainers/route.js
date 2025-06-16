import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit"));
    const page = parseInt(searchParams.get("page")) || 1;

    // Query parameters for Prisma
    const queryOptions = {
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
        location: true,
        specialties: true,
        trainerInfo: true,
        certifications: {
          where: {
            status: "accepted",
          },
        },
        availabilities: true,
      },
      orderBy: [
        {
          paidAds: {
            sort: "desc",
            nulls: "last",
          },
        },
        {
          trainerInfo: {
            rating: "desc",
          },
        },
      ],
    };

    // Add pagination if limit is specified
    if (limit) {
      const skip = (page - 1) * limit;
      queryOptions.take = limit;
      queryOptions.skip = skip;
    }

    const trainers = await prisma.trainerProfile.findMany(queryOptions);
    const totalTrainers = await prisma.trainerProfile.count();

    return NextResponse.json({
      trainers,
      pagination: {
        total: totalTrainers,
        pages: limit ? Math.ceil(totalTrainers / limit) : 1,
        currentPage: page,
        limit: limit || totalTrainers,
      },
    });
  } catch (error) {
    console.error("Error fetching trainers:", error);
    return NextResponse.json(
      { error: "Failed to fetch trainers" },
      { status: 500 }
    );
  }
}
