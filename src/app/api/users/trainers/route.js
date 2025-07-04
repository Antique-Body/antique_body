import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { haversineDistance } from "@/lib/utils";

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
    const tags = searchParams.getAll("tag"); // can be multiple
    const sortBy =
      searchParams.get("sortBy") ||
      (userLat && userLon ? "location" : "rating");
    const sortOrder =
      searchParams.get("sortOrder") || (sortBy === "rating" ? "desc" : "asc");

    // Query parameters for Prisma
    const queryOptions = {
      include: {
        // user: {
        //   select: {
        //     email: true,
        //     phone: true,
        //   },
        // },
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
        galleryImages: {
          orderBy: {
            order: "asc",
          },
        },
      },
      where: {},
    };

    // Search filter (name, description, specialties)
    if (search) {
      const searchTerms = search.toLowerCase().split(" ");
      queryOptions.where.OR = [
        ...searchTerms.map((term) => ({
          OR: [
            { firstName: { contains: term } },
            { lastName: { contains: term } },
            { description: { contains: term } },
            {
              specialties: {
                some: {
                  name: { contains: term },
                },
              },
            },
          ],
        })),
      ];
    }

    // Location filter (city+country string from Google Places)
    if (locations && locations.length > 0) {
      const locationQueries = locations.map((loc) => {
        const addressComponents = loc.split(", ");
        const city = addressComponents[0];
        const country = addressComponents[addressComponents.length - 1];

        // Split city into parts (for handling districts)
        const cityParts = city.split("-").map((part) => part.trim());

        return {
          OR: [
            // Exact city match
            { city },
            // Main city match (before district)
            { city: cityParts[0] },
            // Partial city match
            { city: { contains: cityParts[0] } },
          ],
          country: { contains: country },
        };
      });

      // Combine with existing OR conditions if any
      queryOptions.where.OR = queryOptions.where.OR || [];
      queryOptions.where.OR.push({
        location: {
          OR: locationQueries,
        },
      });
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
              weekday: { in: availabilities },
            },
          },
        },
      ];
    }

    // Add default Prisma orderBy for rating/paidAds if not sorting by distance
    if (sortBy !== "location") {
      if (sortBy === "price") {
        queryOptions.orderBy = [{ pricePerSession: sortOrder }];
      } else if (sortBy === "experience") {
        queryOptions.orderBy = [{ trainerSince: sortOrder }];
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

    let trainers = [];
    let totalTrainers = 0;

    try {
      // For location-based sorting, we need to handle it differently
      if (sortBy === "location" && userLat && userLon) {
        // First get all trainers without pagination to calculate distances
        const allTrainersQuery = { ...queryOptions };
        delete allTrainersQuery.take;
        delete allTrainersQuery.skip;

        let allTrainers = await prisma.trainerProfile.findMany(
          allTrainersQuery
        );
        totalTrainers = allTrainers.length;

        // Map gyms and calculate distances for all trainers
        allTrainers = allTrainers.map((trainer) => {
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

          let distance = null;
          let distanceSource = null;

          // Try to use nearest gym if available
          if (gyms.length > 0) {
            let minGymDist = null;
            gyms.forEach((gym) => {
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

          return {
            ...trainer,
            location: trainer.location ? { ...trainer.location, gyms } : null,
            distance,
            distanceSource,
          };
        });

        // Sort by distance
        allTrainers.sort((a, b) => {
          if (a.distance == null) return 1;
          if (b.distance == null) return -1;
          return a.distance - b.distance;
        });

        // Apply pagination after sorting
        const skip = (page - 1) * limit;
        trainers = allTrainers.slice(skip, skip + limit);
      } else {
        // Normal case - use database pagination
        trainers = await prisma.trainerProfile.findMany(queryOptions);
        totalTrainers = await prisma.trainerProfile.count({
          where: queryOptions.where,
        });

        // Map gyms from trainerGyms to location.gyms
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

        // Calculate distances for non-location sorting (for display purposes)
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
        }
      }
    } catch (error) {
      // If the table doesn't exist or there's any other error, we'll return empty results
      if (error.code === "P2021") {
      } else {
        console.error("Error fetching trainers:", error);
      }
      trainers = [];
      totalTrainers = 0;
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
    console.error("Error in trainers API:", error);
    return NextResponse.json(
      {
        trainers: [],
        pagination: { total: 0, pages: 1, currentPage: 1, limit: 0 },
      },
      { status: 200 }
    );
  }
}
