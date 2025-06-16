const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// Helper function to generate random date within a range
const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// Helper function to generate random number within a range
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate random element from array
const randomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

// Sample data arrays
const cities = [
  { city: "New York", state: "NY", country: "USA", lat: 40.7128, lon: -74.006 },
  {
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    lat: 34.0522,
    lon: -118.2437,
  },
  { city: "London", country: "UK", lat: 51.5074, lon: -0.1278 },
  { city: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { city: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 },
];

const specialties = [
  "Strength Training",
  "Yoga",
  "CrossFit",
  "HIIT",
  "Pilates",
  "Boxing",
  "Swimming",
  "Running",
  "Cycling",
  "Dance",
];

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
];

const trainingEnvironments = ["Gym", "Home", "Outdoor", "Online", "Studio"];

const trainingTypes = ["One-on-One", "Group", "Semi-Private", "Online"];

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const timeSlots = ["Morning", "Afternoon", "Evening", "Night"];

const experienceLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Professional",
];
const goals = [
  "Weight Loss",
  "Muscle Gain",
  "General Fitness",
  "Sports Performance",
  "Rehabilitation",
];

async function createLocations() {
  console.log("Creating locations...");
  const locations = [];
  for (const cityData of cities) {
    const location = await prisma.location.create({
      data: cityData,
    });
    locations.push(location);
  }
  return locations;
}

async function createTrainers(locations) {
  console.log("Creating trainers...");
  const trainers = [];

  for (let i = 0; i < 10; i++) {
    const location = randomElement(locations);
    const hashedPassword = await bcrypt.hash("Trainer123!", 10);

    const user = await prisma.user.create({
      data: {
        email: `trainer${i + 1}@example.com`,
        phone: `+1${randomInt(2000000000, 9999999999)}`,
        password: hashedPassword,
        role: "trainer",
        emailVerified: true,
        phoneVerified: true,
        trainerProfile: {
          create: {
            firstName: `Trainer${i + 1}`,
            lastName: `Smith${i + 1}`,
            dateOfBirth: randomDate(
              new Date(1980, 0, 1),
              new Date(1995, 11, 31)
            ),
            gender: i % 2 === 0 ? "Male" : "Female",
            trainingSince: randomInt(1, 15),
            description: `Professional trainer with ${randomInt(
              1,
              15
            )} years of experience in various fitness disciplines.`,
            locationId: location.id,
            pricingType: "per_session",
            pricePerSession: randomInt(50, 200),
            currency: "USD",
            contactEmail: `trainer${i + 1}@example.com`,
            contactPhone: `+1${randomInt(2000000000, 9999999999)}`,
            sessionDuration: randomInt(30, 120),
            cancellationPolicy: 24,
            specialties: {
              create: Array.from({ length: randomInt(2, 4) }, () => ({
                name: randomElement(specialties),
              })),
            },
            languages: {
              create: Array.from({ length: randomInt(1, 3) }, () => ({
                name: randomElement(languages),
              })),
            },
            trainingEnvironments: {
              create: Array.from({ length: randomInt(1, 3) }, () => ({
                name: randomElement(trainingEnvironments),
              })),
            },
            trainingTypes: {
              create: Array.from({ length: randomInt(1, 3) }, () => ({
                name: randomElement(trainingTypes),
              })),
            },
            certifications: {
              create: Array.from({ length: randomInt(1, 3) }, () => ({
                name: `${randomElement(specialties)} Certification`,
                issuer: "International Fitness Association",
                expiryDate: randomDate(new Date(), new Date(2025, 11, 31)),
                status: "accepted",
              })),
            },
            trainerInfo: {
              create: {
                rating: randomInt(35, 50) / 10,
                totalSessions: randomInt(100, 1000),
                totalEarnings: randomInt(5000, 50000),
                upcomingSessions: randomInt(0, 20),
              },
            },
            availabilities: {
              create: Array.from({ length: randomInt(3, 5) }, () => ({
                weekday: randomElement(weekdays),
                timeSlot: randomElement(timeSlots),
              })),
            },
          },
        },
      },
    });
    trainers.push(user);
  }
  return trainers;
}

async function createClients(locations) {
  console.log("Creating clients...");
  const clients = [];

  for (let i = 0; i < 10; i++) {
    const location = randomElement(locations);
    const hashedPassword = await bcrypt.hash("Client123!", 10);

    const user = await prisma.user.create({
      data: {
        email: `client${i + 1}@example.com`,
        phone: `+1${randomInt(2000000000, 9999999999)}`,
        password: hashedPassword,
        role: "client",
        emailVerified: true,
        phoneVerified: true,
        clientProfile: {
          create: {
            firstName: `Client${i + 1}`,
            lastName: `Johnson${i + 1}`,
            dateOfBirth: randomDate(
              new Date(1985, 0, 1),
              new Date(2000, 11, 31)
            ),
            gender: i % 2 === 0 ? "Male" : "Female",
            height: randomInt(150, 190), // in cm
            weight: randomInt(50, 100), // in kg
            experienceLevel: randomElement(experienceLevels),
            previousActivities: "Running, Swimming, Cycling",
            primaryGoal: randomElement(goals),
            secondaryGoal: randomElement(goals),
            goalDescription:
              "Looking to improve overall fitness and achieve specific goals.",
            email: `client${i + 1}@example.com`,
            phone: `+1${randomInt(2000000000, 9999999999)}`,
            locationId: location.id,
            description:
              "Active individual seeking professional guidance for fitness goals.",
            medicalConditions: "None",
            allergies: "None",
            languages: {
              create: Array.from({ length: randomInt(1, 2) }, () => ({
                name: randomElement(languages),
              })),
            },
            preferredActivities: {
              create: Array.from({ length: randomInt(2, 4) }, () => ({
                name: randomElement(specialties),
              })),
            },
            clientInfo: {
              create: {},
            },
          },
        },
      },
    });
    clients.push(user);
  }
  return clients;
}

async function main() {
  try {
    console.log("Starting database seeding...");

    // Create locations first
    const locations = await createLocations();

    // Create trainers and clients in parallel
    const [trainers, clients] = await Promise.all([
      createTrainers(locations),
      createClients(locations),
    ]);

    console.log(
      `Successfully created ${trainers.length} trainers and ${clients.length} clients`
    );
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Unhandled error during seeding:", error);
  process.exit(1);
});
