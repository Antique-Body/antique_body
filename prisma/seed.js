/* eslint-disable */
//ts-ignore

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  // Create password hash for test users
  const testPassword = await bcrypt.hash("password123", 10);

  // Wrap cleanup in try-catch to handle cases where tables don't exist yet
  try {
    await prisma.exercise.deleteMany();
  } catch (err) {
    // Safe to ignore: table may not exist yet during initial seed
    console.debug("[seed] Failed to delete exercises:", err);
  }

  try {
    await prisma.trainerSettings.deleteMany();
  } catch (err) {
    // Safe to ignore: table may not exist yet during initial seed
    console.debug("[seed] Failed to delete trainerSettings:", err);
  }

  try {
    await prisma.clientSettings.deleteMany();
  } catch (err) {
    // Safe to ignore: table may not exist yet during initial seed
    console.debug("[seed] Failed to delete clientSettings:", err);
  }

  try {
    await prisma.trainerProfile.deleteMany();
  } catch (err) {
    // Safe to ignore: table may not exist yet during initial seed
    console.debug("[seed] Failed to delete trainerProfile:", err);
  }

  try {
    await prisma.clientProfile.deleteMany();
  } catch (err) {
    // Safe to ignore: table may not exist yet during initial seed
    console.debug("[seed] Failed to delete clientProfile:", err);
  }

  try {
    await prisma.trainerInfo.deleteMany();
  } catch (err) {
    // Safe to ignore: table may not exist yet during initial seed
    console.debug("[seed] Failed to delete trainerInfo:", err);
  }

  try {
    await prisma.clientInfo.deleteMany();
  } catch (err) {
    // Safe to ignore: table may not exist yet during initial seed
    console.debug("[seed] Failed to delete clientInfo:", err);
  }

  try {
    await prisma.trainerGym.deleteMany();
  } catch (err) {
    // Safe to ignore: table may not exist yet during initial seed
    console.debug("[seed] Failed to delete trainerGym:", err);
  }

  try {
    await prisma.user.deleteMany();
  } catch (err) {
    // Safe to ignore: table may not exist yet during initial seed
    console.debug("[seed] Failed to delete user:", err);
  }

  try {
    await prisma.gym.deleteMany();
  } catch (err) {
    // Safe to ignore: table may not exist yet during initial seed
    console.debug("[seed] Failed to delete gym:", err);
  }

  try {
    await prisma.location.deleteMany();
  } catch (err) {
    // Safe to ignore: table may not exist yet during initial seed
    console.debug("[seed] Failed to delete location:", err);
  }

  // Create locations first
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        city: "New York",
        state: "NY",
        country: "USA",
        lat: 40.7128,
        lon: -74.006,
      },
    }),
    prisma.location.create({
      data: {
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        lat: 34.0522,
        lon: -118.2437,
      },
    }),
    prisma.location.create({
      data: {
        city: "London",
        country: "UK",
        lat: 51.5074,
        lon: -0.1278,
      },
    }),
  ]);

  // Create gyms
  const gyms = await Promise.all([
    prisma.gym.create({
      data: {
        name: "Gold's Gym",
        address: "123 Fitness Street, New York",
        lat: 40.7128,
        lon: -74.006,
        locationId: locations[0].id,
      },
    }),
    prisma.gym.create({
      data: {
        name: "LA Fitness",
        address: "456 Workout Ave, Los Angeles",
        lat: 34.0522,
        lon: -118.2437,
        locationId: locations[1].id,
      },
    }),
    prisma.gym.create({
      data: {
        name: "PureGym",
        address: "789 Exercise Road, London",
        lat: 51.5074,
        lon: -0.1278,
        locationId: locations[2].id,
      },
    }),
  ]);

  // Create users and trainer profiles
  const trainers = [
    {
      user: {
        email: "john.doe@example.com",
        phone: "+1234567890",
        password: testPassword,
        role: "trainer",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      profile: {
        firstName: "John",
        lastName: "Doe",
        description:
          "Professional fitness trainer with 10 years of experience specializing in strength training and CrossFit. Certified personal trainer with a passion for helping clients achieve their fitness goals.",
        paidAds: new Date("2025-12-31"),
        locationId: locations[0].id,
        profileImage:
          "https://images.pexels.com/photos/30672394/pexels-photo-30672394/free-photo-of-man-exercising-with-dumbbells-in-gym.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        specialties: [
          "Weight Training",
          "CrossFit",
          "Strength & Conditioning",
          "Sports Performance",
        ],
        languages: ["English", "Spanish"],
        trainingEnvironment: "both",
        trainingTypes: ["One-on-One", "Group Classes", "Online Training"],
        certifications: [
          {
            name: "NASM Certified Personal Trainer",
            issuer: "National Academy of Sports Medicine",
            expiryDate: new Date("2026-12-31"),
            status: "accepted",
          },
          {
            name: "CrossFit Level 3 Trainer",
            issuer: "CrossFit Inc.",
            expiryDate: new Date("2025-12-31"),
            status: "accepted",
          },
        ],
        sessionDuration: 60,
        cancellationPolicy: 24,
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: true,
        autoAcceptBookings: false,
        requireDeposit: true,
        depositAmount: 50,
        timezone: "America/New_York",
      },
    },
    {
      user: {
        email: "sarah.smith@example.com",
        phone: "+1234567891",
        password: testPassword,
        role: "trainer",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      profile: {
        firstName: "Sarah",
        lastName: "Smith",
        description:
          "Yoga and meditation specialist with 8 years of experience. Focused on holistic wellness and mindfulness practices.",
        paidAds: new Date("2024-12-31"),
        locationId: locations[1].id,
        profileImage:
          "https://images.pexels.com/photos/5669179/pexels-photo-5669179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        specialties: ["Yoga", "Meditation", "Mindfulness", "Stress Management"],
        languages: ["English", "Sanskrit"],
        trainingEnvironment: "both",
        trainingTypes: ["Group Classes", "Private Sessions", "Workshops"],
        certifications: [
          {
            name: "RYT-500 Yoga Teacher",
            issuer: "Yoga Alliance",
            expiryDate: new Date("2025-12-31"),
            status: "accepted",
          },
          {
            name: "Mindfulness Meditation Teacher",
            issuer: "Mindfulness Training Institute",
            expiryDate: new Date("2024-12-31"),
            status: "accepted",
          },
        ],
        sessionDuration: 90,
        cancellationPolicy: 12,
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        autoAcceptBookings: true,
        requireDeposit: false,
        timezone: "America/Los_Angeles",
      },
    },
    {
      user: {
        email: "mike.johnson@example.com",
        phone: "+1234567892",
        password: testPassword,
        role: "trainer",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      profile: {
        firstName: "Mike",
        lastName: "Johnson",
        description:
          "Professional boxing and MMA trainer with extensive experience in combat sports. Former professional fighter turned coach.",
        locationId: locations[2].id,
        profileImage:
          "https://images.pexels.com/photos/13318591/pexels-photo-13318591.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        specialties: ["Boxing", "MMA", "Combat Sports", "Strength Training"],
        languages: ["English", "French"],
        trainingEnvironment: "indoor",
        trainingTypes: ["One-on-One", "Group Classes", "Fight Camp"],
        certifications: [
          {
            name: "Professional Boxing Coach",
            issuer: "British Boxing Board of Control",
            expiryDate: new Date("2025-12-31"),
            status: "accepted",
          },
          {
            name: "MMA Conditioning Specialist",
            issuer: "International MMA Federation",
            expiryDate: new Date("2024-12-31"),
            status: "accepted",
          },
        ],
        sessionDuration: 90,
        cancellationPolicy: 24,
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        autoAcceptBookings: false,
        requireDeposit: true,
        depositAmount: 100,
        timezone: "Europe/London",
      },
    },
    {
      user: {
        email: "emma.wilson@example.com",
        phone: "+1234567893",
        password: testPassword,
        role: "trainer",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      profile: {
        firstName: "Emma",
        lastName: "Wilson",
        description:
          "Nutrition and fitness coach specializing in sustainable lifestyle changes and long-term health goals.",
        paidAds: new Date("2025-06-30"),
        locationId: locations[0].id,
        profileImage:
          "https://images.pexels.com/photos/13197535/pexels-photo-13197535.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        specialties: [
          "Nutrition",
          "Fitness",
          "Weight Management",
          "Lifestyle Coaching",
        ],
        languages: ["English", "German"],
        trainingEnvironment: "both",
        trainingTypes: ["One-on-One", "Online Coaching", "Group Programs"],
        certifications: [
          {
            name: "Certified Nutrition Coach",
            issuer: "Precision Nutrition",
            expiryDate: new Date("2025-12-31"),
            status: "pending",
          },
          {
            name: "ACE Personal Trainer",
            issuer: "American Council on Exercise",
            expiryDate: new Date("2024-12-31"),
            status: "pending",
          },
        ],
        sessionDuration: 60,
        cancellationPolicy: 24,
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        autoAcceptBookings: false,
        requireDeposit: false,
        timezone: "America/New_York",
      },
    },
    {
      user: {
        email: "david.brown@example.com",
        phone: "+1234567894",
        password: testPassword,
        role: "trainer",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      profile: {
        firstName: "David",
        lastName: "Brown",
        description:
          "Swimming and water sports specialist with Olympic-level coaching experience.",
        locationId: locations[1].id,
        profileImage:
          "https://images.pexels.com/photos/3912944/pexels-photo-3912944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        specialties: [
          "Swimming",
          "Water Sports",
          "Aquatic Fitness",
          "Rehabilitation",
        ],
        languages: ["English"],
        trainingEnvironment: "both",
        trainingTypes: ["One-on-One", "Group Classes", "Competition Training"],
        certifications: [
          {
            name: "US Swimming Coach",
            issuer: "USA Swimming",
            expiryDate: new Date("2025-12-31"),
            status: "accepted",
          },
          {
            name: "Aquatic Rehabilitation Specialist",
            issuer: "Aquatic Exercise Association",
            expiryDate: new Date("2024-12-31"),
            status: "accepted",
          },
        ],
        sessionDuration: 45,
        cancellationPolicy: 12,
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        autoAcceptBookings: true,
        requireDeposit: false,
        timezone: "America/Los_Angeles",
      },
    },
    {
      user: {
        email: "lisa.chen@example.com",
        phone: "+1234567895",
        password: testPassword,
        role: "trainer",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      profile: {
        firstName: "Lisa",
        lastName: "Chen",
        description:
          "Dance and aerobics instructor specializing in various dance styles and high-energy workouts.",
        paidAds: new Date("2024-09-30"),
        locationId: locations[2].id,
        profileImage:
          "https://images.pexels.com/photos/136405/pexels-photo-136405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        specialties: ["Dance", "Aerobics", "Zumba", "Cardio Dance"],
        languages: ["English", "Mandarin"],
        trainingEnvironment: "both",
        trainingTypes: ["Group Classes", "Private Sessions", "Workshops"],
        certifications: [
          {
            name: "Zumba Instructor",
            issuer: "Zumba Fitness",
            expiryDate: new Date("2024-12-31"),
            status: "pending",
          },
          {
            name: "Dance Fitness Instructor",
            issuer: "International Dance Fitness Association",
            expiryDate: new Date("2025-12-31"),
            status: "pending",
          },
        ],
        sessionDuration: 60,
        cancellationPolicy: 12,
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        autoAcceptBookings: false,
        requireDeposit: false,
        timezone: "Europe/London",
      },
    },
    {
      user: {
        email: "james.miller@example.com",
        phone: "+1234567896",
        password: testPassword,
        role: "trainer",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      profile: {
        firstName: "James",
        lastName: "Miller",
        description:
          "Strength and conditioning coach specializing in athletic performance and injury prevention.",
        locationId: locations[0].id,
        profileImage:
          "https://images.pexels.com/photos/31918876/pexels-photo-31918876/free-photo-of-muscular-man-posing-in-modern-gym-interior.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        specialties: [
          "Strength Training",
          "Conditioning",
          "Sports Performance",
          "Injury Prevention",
        ],
        languages: ["English"],
        trainingEnvironment: "both",
        trainingTypes: ["One-on-One", "Team Training", "Online Coaching"],
        certifications: [
          {
            name: "CSCS",
            issuer: "National Strength and Conditioning Association",
            expiryDate: new Date("2025-12-31"),
            status: "pending",
          },
          {
            name: "Sports Performance Coach",
            issuer: "USA Weightlifting",
            expiryDate: new Date("2024-12-31"),
            status: "pending",
          },
        ],
        sessionDuration: 60,
        cancellationPolicy: 24,
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        autoAcceptBookings: false,
        requireDeposit: true,
        depositAmount: 75,
        timezone: "America/New_York",
      },
    },
    {
      user: {
        email: "anna.kowalski@example.com",
        phone: "+1234567897",
        password: testPassword,
        role: "trainer",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      profile: {
        firstName: "Anna",
        lastName: "Kowalski",
        description:
          "Pilates and flexibility trainer with a focus on posture correction and core strength.",
        paidAds: new Date("2025-03-31"),
        locationId: locations[1].id,
        profileImage:
          "https://images.pexels.com/photos/29850907/pexels-photo-29850907/free-photo-of-muscular-man-lifting-dumbbells-in-gym-setting.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        specialties: [
          "Pilates",
          "Flexibility",
          "Posture Correction",
          "Core Training",
        ],
        languages: ["English", "Polish"],
        trainingEnvironment: "both",
        trainingTypes: ["One-on-One", "Group Classes", "Equipment Classes"],
        certifications: [
          {
            name: "Comprehensive Pilates Instructor",
            issuer: "Pilates Method Alliance",
            expiryDate: new Date("2025-12-31"),
            status: "rejected",
          },
          {
            name: "Posture Specialist",
            issuer: "International Posture Institute",
            expiryDate: new Date("2024-12-31"),
            status: "expired",
          },
        ],
        sessionDuration: 55,
        cancellationPolicy: 12,
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        autoAcceptBookings: true,
        requireDeposit: false,
        timezone: "America/Los_Angeles",
      },
    },
    {
      user: {
        email: "robert.taylor@example.com",
        phone: "+1234567898",
        password: testPassword,
        role: "trainer",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      profile: {
        firstName: "Robert",
        lastName: "Taylor",
        description:
          "Sports rehabilitation specialist with expertise in injury recovery and physical therapy.",
        locationId: locations[2].id,
        profileImage:
          "https://images.pexels.com/photos/29773583/pexels-photo-29773583/free-photo-of-muscular-man-posing-in-gym-for-bodybuilding.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        specialties: [
          "Rehabilitation",
          "Sports Medicine",
          "Injury Recovery",
          "Physical Therapy",
        ],
        languages: ["English"],
        trainingEnvironment: "both",
        trainingTypes: [
          "One-on-One",
          "Rehabilitation Programs",
          "Recovery Sessions",
        ],
        certifications: [
          {
            name: "Sports Rehabilitation Specialist",
            issuer: "American Physical Therapy Association",
            expiryDate: new Date("2025-12-31"),
            status: "accepted",
          },
          {
            name: "Injury Prevention Specialist",
            issuer: "National Academy of Sports Medicine",
            expiryDate: new Date("2024-12-31"),
            status: "accepted",
          },
        ],
        sessionDuration: 60,
        cancellationPolicy: 24,
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        autoAcceptBookings: false,
        requireDeposit: true,
        depositAmount: 120,
        timezone: "Europe/London",
      },
    },
    {
      user: {
        email: "maria.garcia@example.com",
        phone: "+1234567899",
        password: testPassword,
        role: "trainer",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      profile: {
        firstName: "Maria",
        lastName: "Garcia",
        description:
          "HIIT and cardio trainer specializing in high-intensity workouts and endurance training.",
        locationId: locations[0].id,
        profileImage:
          "https://images.pexels.com/photos/4398901/pexels-photo-4398901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        specialties: [
          "HIIT",
          "Cardio",
          "Endurance Training",
          "Circuit Training",
        ],
        languages: ["English", "Spanish"],
        trainingEnvironment: "both",
        trainingTypes: ["Group Classes", "One-on-One", "Online Programs"],
        certifications: [
          {
            name: "HIIT Specialist",
            issuer: "American Council on Exercise",
            expiryDate: new Date("2025-12-31"),
            status: "accepted",
          },
          {
            name: "Endurance Training Coach",
            issuer: "USA Track & Field",
            expiryDate: new Date("2024-12-31"),
            status: "accepted",
          },
        ],
        sessionDuration: 45,
        cancellationPolicy: 12,
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        autoAcceptBookings: true,
        requireDeposit: false,
        timezone: "America/New_York",
      },
    },
  ];

  // Create trainers with their nested structure
  for (const trainer of trainers) {
    const user = await prisma.user.create({
      data: trainer.user,
    });

    // Create TrainerInfo as main container
    const trainerInfo = await prisma.trainerInfo.create({
      data: {
        userId: user.id,
        trainerProfile: {
          create: {
            firstName: trainer.profile.firstName,
            lastName: trainer.profile.lastName,
            description: trainer.profile.description,
            paidAds: trainer.profile.paidAds,
            locationId: trainer.profile.locationId,
            profileImage: trainer.profile.profileImage,
            trainingEnvironment: trainer.profile.trainingEnvironment,
            sessionDuration: trainer.profile.sessionDuration,
            cancellationPolicy: trainer.profile.cancellationPolicy,
            specialties: {
              create: trainer.profile.specialties.map((specialty) => ({
                name: specialty,
              })),
            },
            languages: {
              create: trainer.profile.languages.map((language) => ({
                name: language,
              })),
            },
            trainingTypes: {
              create: trainer.profile.trainingTypes.map((type) => ({
                name: type,
              })),
            },
            certifications: {
              create: trainer.profile.certifications.map((cert) => ({
                name: cert.name,
                issuer: cert.issuer,
                expiryDate: cert.expiryDate,
                status: cert.status,
              })),
            },
          },
        },
        trainerSettings: {
          create: trainer.settings,
        },
      },
      include: {
        trainerProfile: true,
      },
    });

    // Create trainer-gym relationships
    if (trainer.profile.locationId === locations[0].id) {
      await prisma.trainerGym.create({
        data: {
          trainerId: trainerInfo.trainerProfile.id,
          gymId: gyms[0].id,
        },
      });
    } else if (trainer.profile.locationId === locations[1].id) {
      await prisma.trainerGym.create({
        data: {
          trainerId: trainerInfo.trainerProfile.id,
          gymId: gyms[1].id,
        },
      });
    } else {
      await prisma.trainerGym.create({
        data: {
          trainerId: trainerInfo.trainerProfile.id,
          gymId: gyms[2].id,
        },
      });
    }
  }

  // Create clients with their nested structure
  const clients = [
    {
      user: {
        email: "alex.morgan@example.com",
        phone: "+1234567900",
        password: testPassword,
        role: "client",
        language: "en",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      clientInfo: {
        totalSessions: 0,
      },
      profile: {
        firstName: "Alex",
        lastName: "Morgan",
        dateOfBirth: new Date("1990-05-15"),
        gender: "Male",
        height: 180,
        weight: 85,
        experienceLevel: "Intermediate",
        previousActivities:
          "Running (5 years), Weight Training (3 years), Soccer (10 years). Regular gym attendance 4 times per week. Participated in local soccer leagues and completed 2 marathons.",
        primaryGoal: "Muscle Gain",
        secondaryGoal: "Improve Endurance",
        goalDescription:
          "Looking to build muscle mass while maintaining cardiovascular fitness. Interested in strength training and HIIT workouts. Specific goals: Increase bench press by 20kg, reduce 5km run time by 2 minutes, and maintain body fat percentage below 15%.",
        email: "alex.morgan@example.com",
        phone: "+1234567900",
        locationId: locations[0].id,
        profileImage:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        description:
          "Active professional with 10+ years of sports experience. Currently working in finance but maintaining an active lifestyle. Looking to take fitness to the next level with professional guidance. Available for training sessions early mornings and weekends.",
        medicalConditions:
          "None. Regular check-ups show excellent health. Blood pressure: 120/80, Resting heart rate: 62 bpm.",
        allergies: "None. No food allergies or exercise-induced allergies.",
        languages: ["English", "French"],
        preferredActivities: [
          "Weight Training",
          "HIIT",
          "Cardio",
          "Team Sports",
        ],
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        reminderTime: 24,
        privacyLevel: "public",
        shareProgress: true,
        timezone: "America/New_York",
        preferredLanguage: "en",
        measurementUnit: "metric",
      },
    },
    {
      user: {
        email: "sophia.patel@example.com",
        phone: "+1234567901",
        password: testPassword,
        role: "client",
        language: "en",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      clientInfo: {
        totalSessions: 0,
      },
      profile: {
        firstName: "Sophia",
        lastName: "Patel",
        dateOfBirth: new Date("1988-08-22"),
        gender: "Female",
        height: 165,
        weight: 58,
        experienceLevel: "Beginner",
        previousActivities:
          "Yoga (2 years), Swimming (1 year). Attended yoga classes 3 times per week. Basic swimming skills for recreation.",
        primaryGoal: "Weight Loss",
        secondaryGoal: "Improve Flexibility",
        goalDescription:
          "Aiming to lose 10kg through a combination of cardio and strength training, while maintaining flexibility through yoga. Target: Reduce body fat percentage to 22% and improve overall muscle tone. Looking for a sustainable approach to fitness.",
        email: "sophia.patel@example.com",
        phone: "+1234567901",
        locationId: locations[1].id,
        profileImage:
          "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        description:
          "Software engineer transitioning from a sedentary lifestyle to active fitness. Yoga enthusiast looking to expand fitness horizons. Available for training sessions after work hours and weekends. Prefers female trainers.",
        medicalConditions:
          "Mild asthma (controlled with inhaler). No exercise restrictions. Regular check-ups show good health. Blood pressure: 118/75, Resting heart rate: 68 bpm.",
        allergies: "None. No food allergies or exercise-induced allergies.",
        languages: ["English", "Hindi"],
        preferredActivities: ["Yoga", "Swimming", "Pilates", "Light Cardio"],
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        reminderTime: 24,
        privacyLevel: "public",
        shareProgress: true,
        timezone: "America/New_York",
        preferredLanguage: "en",
        measurementUnit: "metric",
      },
    },
    {
      user: {
        email: "marcus.wilson@example.com",
        phone: "+1234567902",
        password: testPassword,
        role: "client",
        language: "en",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      clientInfo: {
        totalSessions: 0,
      },
      profile: {
        firstName: "Marcus",
        lastName: "Wilson",
        dateOfBirth: new Date("1995-03-10"),
        gender: "Male",
        height: 188,
        weight: 92,
        experienceLevel: "Advanced",
        previousActivities:
          "CrossFit (4 years), Boxing (3 years), Marathon Running (5 years). Competitive athlete with multiple marathon completions. CrossFit Level 2 certified. Regular training 6 days per week.",
        primaryGoal: "Sports Performance",
        secondaryGoal: "Maintain Strength",
        goalDescription:
          "Competitive athlete looking to improve sports performance and maintain peak physical condition. Specific goals: Improve CrossFit competition ranking, reduce marathon time to sub-3 hours, and maintain current strength levels while improving endurance.",
        email: "marcus.wilson@example.com",
        phone: "+1234567902",
        locationId: locations[2].id,
        profileImage:
          "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        description:
          "Professional athlete and fitness coach seeking specialized training to enhance performance. Available for training sessions early morning and late evening. Looking for a trainer with competitive sports background.",
        medicalConditions:
          "None. Excellent health metrics. Blood pressure: 115/75, Resting heart rate: 58 bpm. Regular sports physicals show optimal condition.",
        allergies: "None. No food allergies or exercise-induced allergies.",
        languages: ["English"],
        preferredActivities: [
          "CrossFit",
          "Boxing",
          "Running",
          "Strength Training",
        ],
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        reminderTime: 24,
        privacyLevel: "public",
        shareProgress: true,
        timezone: "America/New_York",
        preferredLanguage: "en",
        measurementUnit: "metric",
      },
    },
    {
      user: {
        email: "emma.rodriguez@example.com",
        phone: "+1234567903",
        password: testPassword,
        role: "client",
        language: "en",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      clientInfo: {
        totalSessions: 0,
      },
      profile: {
        firstName: "Emma",
        lastName: "Rodriguez",
        dateOfBirth: new Date("1992-11-30"),
        gender: "Female",
        height: 170,
        weight: 65,
        experienceLevel: "Intermediate",
        previousActivities:
          "Dance (8 years), Cycling (3 years), Group Fitness (2 years). Professional dance instructor. Regular cycling for commuting and recreation. Attended group fitness classes 3-4 times per week.",
        primaryGoal: "Tone Muscles",
        secondaryGoal: "Improve Posture",
        goalDescription:
          "Looking to tone muscles and improve overall posture through a combination of strength training and flexibility exercises. Specific goals: Develop defined muscle tone while maintaining flexibility, correct postural issues from dance, and improve core strength.",
        email: "emma.rodriguez@example.com",
        phone: "+1234567903",
        locationId: locations[0].id,
        profileImage:
          "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        description:
          "Professional dance instructor seeking to enhance fitness routine and address postural issues. Available for training sessions during daytime hours. Prefers trainers with dance or movement background.",
        medicalConditions:
          "None. Good health with regular check-ups. Blood pressure: 116/74, Resting heart rate: 64 bpm. Minor postural issues from dance.",
        allergies: "None. No food allergies or exercise-induced allergies.",
        languages: ["English", "Spanish"],
        preferredActivities: ["Dance", "Cycling", "Group Fitness", "Pilates"],
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        reminderTime: 24,
        privacyLevel: "public",
        shareProgress: true,
        timezone: "America/New_York",
        preferredLanguage: "en",
        measurementUnit: "metric",
      },
    },
    {
      user: {
        email: "james.chen@example.com",
        phone: "+1234567904",
        password: testPassword,
        role: "client",
        language: "en",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      clientInfo: {
        totalSessions: 0,
      },
      profile: {
        firstName: "James",
        lastName: "Chen",
        dateOfBirth: new Date("1985-07-18"),
        gender: "Male",
        height: 175,
        weight: 78,
        experienceLevel: "Beginner",
        previousActivities:
          "Golf (occasional), Walking (daily). Sedentary lifestyle with minimal exercise. Regular walking for 30 minutes daily. Occasional weekend golf.",
        primaryGoal: "General Fitness",
        secondaryGoal: "Stress Relief",
        goalDescription:
          "Seeking to improve overall fitness and use exercise as a stress management tool. Specific goals: Establish regular exercise routine, reduce stress levels, improve energy levels, and maintain healthy weight.",
        email: "james.chen@example.com",
        phone: "+1234567904",
        locationId: locations[1].id,
        profileImage:
          "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        description:
          "Busy executive looking to incorporate fitness into daily routine. Available for training sessions early morning or late evening. Prefers low-impact exercises to start.",
        medicalConditions:
          "None. Regular check-ups show good health. Blood pressure: 122/78, Resting heart rate: 72 bpm. Slightly elevated stress levels.",
        allergies: "None. No food allergies or exercise-induced allergies.",
        languages: ["English", "Mandarin"],
        preferredActivities: ["Walking", "Swimming", "Yoga", "Light Cardio"],
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        reminderTime: 24,
        privacyLevel: "public",
        shareProgress: true,
        timezone: "America/New_York",
        preferredLanguage: "en",
        measurementUnit: "metric",
      },
    },
    {
      user: {
        email: "olivia.kim@example.com",
        phone: "+1234567905",
        password: testPassword,
        role: "client",
        language: "en",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      clientInfo: {
        totalSessions: 0,
      },
      profile: {
        firstName: "Olivia",
        lastName: "Kim",
        dateOfBirth: new Date("1993-04-25"),
        gender: "Female",
        height: 168,
        weight: 62,
        experienceLevel: "Intermediate",
        previousActivities:
          "Martial Arts (3 years), Kickboxing (2 years), HIIT (1 year). Regular training 4-5 times per week. Participated in local martial arts tournaments.",
        primaryGoal: "Build Strength",
        secondaryGoal: "Learn Self-Defense",
        goalDescription:
          "Interested in building functional strength while learning practical self-defense skills. Specific goals: Improve striking power, enhance defensive techniques, and increase overall strength while maintaining flexibility.",
        email: "olivia.kim@example.com",
        phone: "+1234567905",
        locationId: locations[0].id,
        profileImage:
          "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        description:
          "Martial arts enthusiast with background in Taekwondo and Kickboxing. Available for training sessions evenings and weekends. Looking for a trainer with combat sports experience.",
        medicalConditions:
          "None. Excellent health metrics. Blood pressure: 114/72, Resting heart rate: 60 bpm. Regular check-ups show optimal condition.",
        allergies: "None. No food allergies or exercise-induced allergies.",
        languages: ["English", "Korean"],
        preferredActivities: [
          "Martial Arts",
          "Kickboxing",
          "HIIT",
          "Strength Training",
        ],
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        reminderTime: 24,
        privacyLevel: "public",
        shareProgress: true,
        timezone: "America/New_York",
        preferredLanguage: "en",
        measurementUnit: "metric",
      },
    },
    {
      user: {
        email: "daniel.murphy@example.com",
        phone: "+1234567906",
        password: testPassword,
        role: "client",
        language: "en",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      clientInfo: {
        totalSessions: 0,
      },
      profile: {
        firstName: "Daniel",
        lastName: "Murphy",
        dateOfBirth: new Date("1987-09-12"),
        gender: "Male",
        height: 182,
        weight: 88,
        experienceLevel: "Beginner",
        previousActivities:
          "Golf (occasional), Walking (daily). Sedentary lifestyle with minimal exercise. Regular walking for 20 minutes daily. Occasional weekend golf.",
        primaryGoal: "Weight Loss",
        secondaryGoal: "Improve Mobility",
        goalDescription:
          "Looking to lose 15kg and improve overall mobility after years of sedentary work. Specific goals: Reduce body fat percentage to 20%, improve joint mobility, and establish sustainable exercise routine.",
        email: "daniel.murphy@example.com",
        phone: "+1234567906",
        locationId: locations[1].id,
        profileImage:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        description:
          "Office professional seeking to improve health and fitness. Available for training sessions early morning or after work. Requires low-impact exercises due to back condition.",
        medicalConditions:
          "Lower back pain (managed with physical therapy). Regular check-ups show good health. Blood pressure: 125/80, Resting heart rate: 70 bpm.",
        allergies: "None. No food allergies or exercise-induced allergies.",
        languages: ["English"],
        preferredActivities: ["Walking", "Swimming", "Yoga", "Light Cardio"],
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        reminderTime: 24,
        privacyLevel: "public",
        shareProgress: true,
        timezone: "America/New_York",
        preferredLanguage: "en",
        measurementUnit: "metric",
      },
    },
    {
      user: {
        email: "isabella.santos@example.com",
        phone: "+1234567907",
        password: testPassword,
        role: "client",
        language: "en",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      clientInfo: {
        totalSessions: 0,
      },
      profile: {
        firstName: "Isabella",
        lastName: "Santos",
        dateOfBirth: new Date("1996-12-03"),
        gender: "Female",
        height: 172,
        weight: 60,
        experienceLevel: "Advanced",
        previousActivities:
          "Competitive Swimming (8 years), Triathlon (3 years). National level swimmer. Completed 5 triathlons. Training 6 days per week.",
        primaryGoal: "Endurance Training",
        secondaryGoal: "Improve Speed",
        goalDescription:
          "Competitive swimmer looking to improve endurance and speed for triathlon competitions. Specific goals: Reduce swimming time by 5%, improve cycling efficiency, and maintain current running pace while reducing fatigue.",
        email: "isabella.santos@example.com",
        phone: "+1234567907",
        locationId: locations[2].id,
        profileImage:
          "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        description:
          "Professional athlete specializing in swimming and triathlon. Available for training sessions morning and afternoon. Looking for a trainer with competitive sports background.",
        medicalConditions:
          "None. Excellent health metrics. Blood pressure: 112/70, Resting heart rate: 56 bpm. Regular sports physicals show optimal condition.",
        allergies: "None. No food allergies or exercise-induced allergies.",
        languages: ["English", "Portuguese"],
        preferredActivities: [
          "Swimming",
          "Running",
          "Cycling",
          "Strength Training",
        ],
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        reminderTime: 24,
        privacyLevel: "public",
        shareProgress: true,
        timezone: "America/New_York",
        preferredLanguage: "en",
        measurementUnit: "metric",
      },
    },
    {
      user: {
        email: "ryan.zhang@example.com",
        phone: "+1234567908",
        password: testPassword,
        role: "client",
        language: "en",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
      clientInfo: {
        totalSessions: 0,
      },
      profile: {
        firstName: "Ryan",
        lastName: "Zhang",
        dateOfBirth: new Date("1991-06-20"),
        gender: "Male",
        height: 178,
        weight: 75,
        experienceLevel: "Intermediate",
        previousActivities:
          "Basketball (10 years), Weight Training (3 years). College basketball player. Regular gym attendance 4 times per week. Participated in local basketball leagues.",
        primaryGoal: "Sports Performance",
        secondaryGoal: "Injury Prevention",
        goalDescription:
          "Basketball player looking to improve performance and prevent injuries. Specific goals: Improve vertical jump by 5cm, enhance lateral movement speed, and maintain current strength while improving joint stability.",
        email: "ryan.zhang@example.com",
        phone: "+1234567908",
        locationId: locations[0].id,
        profileImage:
          "https://images.pexels.com/photos/1701202/pexels-photo-1701202.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        description:
          "Basketball player seeking performance enhancement. Available for training sessions early morning and evening. Looking for a trainer with sports rehabilitation background.",
        medicalConditions:
          "Previous ankle injury (fully recovered). Regular check-ups show good health. Blood pressure: 118/76, Resting heart rate: 62 bpm.",
        allergies: "None. No food allergies or exercise-induced allergies.",
        languages: ["English", "Mandarin"],
        preferredActivities: [
          "Basketball",
          "Weight Training",
          "Plyometrics",
          "Mobility Work",
        ],
      },
      settings: {
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        reminderTime: 24,
        privacyLevel: "public",
        shareProgress: true,
        timezone: "America/New_York",
        preferredLanguage: "en",
        measurementUnit: "metric",
      },
    },
  ];

  // Create clients with their nested structure
  for (const client of clients) {
    const user = await prisma.user.create({
      data: client.user,
    });

    // Create ClientInfo as main container
    await prisma.clientInfo.create({
      data: {
        userId: user.id,
        totalSessions: client.clientInfo.totalSessions,
        // Create nested ClientProfile
        clientProfile: {
          create: {
            firstName: client.profile.firstName,
            lastName: client.profile.lastName,
            dateOfBirth: client.profile.dateOfBirth,
            gender: client.profile.gender,
            height: client.profile.height,
            weight: client.profile.weight,
            experienceLevel: client.profile.experienceLevel,
            previousActivities: client.profile.previousActivities,
            primaryGoal: client.profile.primaryGoal,
            secondaryGoal: client.profile.secondaryGoal,
            goalDescription: client.profile.goalDescription,
            contactEmail: client.profile.email,
            contactPhone: client.profile.phone,
            locationId: client.profile.locationId,
            profileImage: client.profile.profileImage,
            description: client.profile.description,
            medicalConditions: client.profile.medicalConditions,
            allergies: client.profile.allergies,
            languages: {
              create: client.profile.languages.map((language) => ({
                name: language,
              })),
            },
            preferredActivities: {
              create: client.profile.preferredActivities.map((activity) => ({
                name: activity,
              })),
            },
          },
        },
        // Create nested ClientSettings
        clientSettings: {
          create: client.settings,
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
