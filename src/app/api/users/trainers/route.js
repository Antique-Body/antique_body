import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { haversineDistance } from "@/lib/utils";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit"));
    const page = parseInt(searchParams.get("page")) || 1;
    const userLat = searchParams.get("lat");
    const userLon = searchParams.get("lon");
    // Filters
    const search = searchParams.get("search") || null;
    const locations = searchParams.getAll("location"); // can be multiple
    const availabilities = searchParams.getAll("availability"); // can be multiple
    const priceMin = searchParams.get("priceMin")
      ? parseFloat(searchParams.get("priceMin"))
      : null;
    const priceMax = searchParams.get("priceMax")
      ? parseFloat(searchParams.get("priceMax"))
      : null;
    const rating = searchParams.get("rating")
      ? parseFloat(searchParams.get("rating"))
      : null;
    const tags = searchParams.getAll("tag"); // can be multiple
    const sortBy =
      searchParams.get("sortBy") ||
      (userLat && userLon ? "location" : "rating");
    const sortOrder =
      searchParams.get("sortOrder") || (sortBy === "rating" ? "desc" : "asc");

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
        trainerGyms: {
          include: {
            gym: true,
          },
        },
      },
      where: {},
    };

    // Search filter (name, description, specialties)
    if (search) {
      queryOptions.where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { description: { contains: search } },
        {
          specialties: {
            some: {
              name: { contains: search },
            },
          },
        },
      ];
    }
    // Location filter (city+country string)
    if (locations && locations.length > 0) {
      queryOptions.where.OR = [
        ...(queryOptions.where.OR || []),
        {
          location: {
            OR: locations.map((loc) => {
              const [city, country] = loc.split(",").map((s) => s.trim());
              return {
                city: city || undefined,
                country: country || undefined,
              };
            }),
          },
        },
      ];
    }
    // Price filter
    if (priceMin !== null || priceMax !== null) {
      queryOptions.where.AND = [
        ...(queryOptions.where.AND || []),
        {
          pricePerSession: {
            gte: priceMin !== null ? priceMin : undefined,
            lte: priceMax !== null ? priceMax : undefined,
          },
        },
      ];
    }
    // Rating filter
    if (rating !== null && !isNaN(rating) && rating > 0) {
      queryOptions.where.AND = [
        ...(queryOptions.where.AND || []),
        {
          trainerInfo: {
            rating: {
              gte: rating,
            },
          },
        },
      ];
    }
    // Tags filter (specialties)
    if (tags && tags.length > 0) {
      queryOptions.where.AND = [
        ...(queryOptions.where.AND || []),
        {
          specialties: {
            some: {
              name: { in: tags },
            },
          },
        },
      ];
    }
    // Availability filter (weekday + timeSlot as string)
    if (availabilities && availabilities.length > 0) {
      queryOptions.where.AND = [
        ...(queryOptions.where.AND || []),
        {
          availabilities: {
            some: {
              OR: availabilities.map((a) => {
                const [weekday, timeSlot] = a.split(" ");
                return {
                  weekday: weekday,
                  timeSlot: timeSlot,
                };
              }),
            },
          },
        },
      ];
    }

    // Add default Prisma orderBy for rating/paidAds if not sorting by distance
    if (sortBy !== "location") {
      if (sortBy === "rating") {
        queryOptions.orderBy = [
          { paidAds: { sort: "desc", nulls: "last" } },
          { trainerInfo: { rating: sortOrder } },
        ];
      } else if (sortBy === "price") {
        queryOptions.orderBy = [{ pricePerSession: sortOrder }];
      } else if (sortBy === "experience") {
        queryOptions.orderBy = [{ trainingSince: sortOrder }];
      } else if (sortBy === "name") {
        queryOptions.orderBy = [
          { firstName: sortOrder },
          { lastName: sortOrder },
        ];
      }
    }

    // Add pagination if limit is specified
    if (limit) {
      const skip = (page - 1) * limit;
      queryOptions.take = limit;
      queryOptions.skip = skip;
    }

    let trainers = await prisma.trainerProfile.findMany(queryOptions);
    const totalTrainers = await prisma.trainerProfile.count({
      where: queryOptions.where,
    });

    // Mapiraj gymove iz trainerGyms u location.gyms
    trainers = trainers.map((trainer) => {
      let gyms = [];
      if (Array.isArray(trainer.trainerGyms)) {
        gyms = trainer.trainerGyms
          .filter((tg) => tg.gym)
          .map((tg) => ({
            value: tg.gym.placeId,
            label: tg.gym.name,
            address: tg.gym.address,
            lat: tg.gym.lat,
            lon: tg.gym.lon,
          }));
      }
      return {
        ...trainer,
        location: trainer.location ? { ...trainer.location, gyms } : null,
      };
    });

    // If user location is provided, calculate distance for each trainer
    if (userLat && userLon) {
      trainers = trainers.map((trainer) => {
        let distance = null;
        let distanceSource = null;
        // Try to use nearest gym if available
        if (
          trainer.location &&
          Array.isArray(trainer.location.gyms) &&
          trainer.location.gyms.length > 0
        ) {
          let minGymDist = null;
          trainer.location.gyms.forEach((gym) => {
            if (
              typeof gym.lat === "number" &&
              typeof gym.lon === "number" &&
              !isNaN(gym.lat) &&
              !isNaN(gym.lon)
            ) {
              const d = haversineDistance(
                parseFloat(userLat),
                parseFloat(userLon),
                gym.lat,
                gym.lon
              );
              if (minGymDist === null || d < minGymDist) {
                minGymDist = d;
              }
            }
          });
          if (minGymDist !== null) {
            distance = minGymDist;
            distanceSource = "gym";
          }
        }
        // If no gym distance, fall back to city location
        if (
          distance === null &&
          trainer.location &&
          typeof trainer.location.lat === "number" &&
          typeof trainer.location.lon === "number" &&
          !isNaN(trainer.location.lat) &&
          !isNaN(trainer.location.lon)
        ) {
          distance = haversineDistance(
            parseFloat(userLat),
            parseFloat(userLon),
            trainer.location.lat,
            trainer.location.lon
          );
          distanceSource = "city";
        }
        return { ...trainer, distance, distanceSource };
      });
      // Always sort by distance ascending if sortBy=location
      if (sortBy === "location") {
        trainers = trainers.sort((a, b) => {
          if (a.distance == null) return 1;
          if (b.distance == null) return -1;
          return a.distance - b.distance;
        });
      }
    }

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
