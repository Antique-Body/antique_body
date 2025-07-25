// Mock data for trainers in the marketplace
export const trainers = [
  {
    id: 1,
    name: "Alexander Petrakis",
    specialty: "Strength Training",
    location: "Athens, Greece",
    rating: 4.9,
    reviewCount: 127,
    clientCount: 15,
    experience: "8 years",
    proximity: "2.5 km away",
    price: 65,
    priceUnit: "session",
    availability: ["Mon", "Wed", "Fri"],
    availableTimes: ["Morning", "Evening"],
    bio: "Former Olympic athlete specializing in strength and conditioning with a focus on ancient Greek training methods.",
    philosophy: "Training should enhance your life, not consume it.",
    certifications: [
      "Certified Strength Coach",
      "Olympic Weightlifting L3",
      "Movement Specialist",
    ],
    specializations: [
      "Olympic Lifting",
      "Functional Strength",
      "Athletic Performance",
    ],
    achievements: [
      "National Weightlifting Champion",
      "Coached 3 Olympic Athletes",
    ],
    languages: ["Greek", "English", "French"],
    image:
      "https://images.pexels.com/photos/30672394/pexels-photo-30672394/free-photo-of-man-exercising-with-dumbbells-in-gym.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: true,
    isVerified: true,
    testimonials: [
      {
        id: 1,
        clientName: "Dimitri Kostas",
        rating: 5,
        comment:
          "Alexander transformed my approach to fitness. His knowledge of ancient training methods combined with modern science has given me strength I never thought possible.",
        date: "2023-05-15",
      },
    ],
    tags: ["Strength", "Olympic", "Performance", "Athletics"],
  },
  {
    id: 2,
    name: "Elena Dimitriou",
    specialty: "HIIT & Endurance",
    location: "Sparta, Greece",
    rating: 4.8,
    reviewCount: 98,
    clientCount: 12,
    experience: "6 years",
    proximity: "3.8 km away",
    price: 55,
    priceUnit: "session",
    availability: ["Tue", "Thu", "Sat"],
    availableTimes: ["Morning", "Afternoon"],
    bio: "Endurance specialist with a background in competitive distance running.",
    philosophy: "Endurance is as much mental as physical.",
    certifications: [
      "Certified Endurance Coach",
      "HIIT Specialist",
      "Marathon Training Expert",
    ],
    specializations: [
      "Long Distance Running",
      "HIIT Programming",
      "Cardiovascular Health",
    ],
    achievements: ["2x Marathon Winner", "Ultra-Marathon Competitor"],
    languages: ["Greek", "English", "Italian"],
    image:
      "https://images.pexels.com/photos/5669179/pexels-photo-5669179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: true,
    isVerified: true,
    testimonials: [
      {
        id: 1,
        clientName: "Sophia Papadopoulos",
        rating: 5,
        comment:
          "Elena's training program helped me improve my marathon time by over 20 minutes.",
        date: "2023-06-02",
      },
    ],
    tags: ["Endurance", "HIIT", "Marathon", "Cardio"],
  },
  {
    id: 3,
    name: "Markos Constantinou",
    specialty: "Wrestling & MMA",
    location: "Thessaloniki, Greece",
    rating: 5.0,
    reviewCount: 87,
    clientCount: 8,
    experience: "10 years",
    proximity: "5.1 km away",
    price: 70,
    priceUnit: "session",
    availability: ["Mon", "Tue", "Thu", "Sat"],
    availableTimes: ["Afternoon", "Evening"],
    bio: "MMA champion with extensive background in traditional Greek wrestling (Pale).",
    philosophy:
      "Combat training builds not just fighters, but disciplined individuals.",
    certifications: ["Certified MMA Coach", "Wrestling Coach Level 3"],
    specializations: [
      "Traditional Greek Wrestling",
      "MMA Techniques",
      "Combat Strength Training",
    ],
    achievements: [
      "National Wrestling Champion",
      "Professional MMA Record: 18-2",
    ],
    education: ["Sports Science Degree"],
    languages: ["Greek", "English", "Russian"],
    image:
      "https://images.pexels.com/photos/13318591/pexels-photo-13318591.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: false,
    isVerified: true,
    testimonials: [
      {
        id: 1,
        clientName: "Alexandros Nikolaidis",
        rating: 5,
        comment:
          "Markos's training combines ancient Greek wrestling techniques with modern MMA.",
        date: "2023-05-25",
      },
    ],
    tags: ["MMA", "Wrestling", "Combat", "Martial Arts"],
  },
  {
    id: 4,
    name: "Sophia Karagianni",
    specialty: "Flexibility & Recovery",
    location: "Crete, Greece",
    rating: 4.7,
    reviewCount: 56,
    clientCount: 10,
    experience: "7 years",
    proximity: "4.2 km away",
    price: 60,
    priceUnit: "session",
    availability: ["Wed", "Fri", "Sun"],
    availableTimes: ["Morning", "Evening"],
    bio: "Yoga instructor combining flexibility training with ancient Greek recovery techniques.",
    image:
      "https://images.pexels.com/photos/13197535/pexels-photo-13197535.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: false,
    isVerified: true,
    testimonials: [
      {
        id: 1,
        clientName: "Nikos Papadakis",
        rating: 4.5,
        comment:
          "Sophia's flexibility program has completely eliminated my chronic back pain.",
        date: "2023-04-12",
      },
    ],
    tags: ["Yoga", "Flexibility", "Recovery", "Mobility"],
  },
  {
    id: 5,
    name: "Nikos Stamatis",
    specialty: "Throwing Sports",
    location: "Olympia, Greece",
    rating: 4.9,
    reviewCount: 72,
    clientCount: 6,
    experience: "12 years",
    proximity: "7.8 km away",
    price: 75,
    priceUnit: "session",
    availability: ["Mon", "Tue", "Thu", "Fri"],
    availableTimes: ["Afternoon"],
    bio: "Former javelin champion specializing in proper technique for all throwing sports.",
    image:
      "https://images.pexels.com/photos/3912944/pexels-photo-3912944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: true,
    isVerified: true,
    testimonials: [
      {
        id: 1,
        clientName: "Andreas Georgiou",
        rating: 5,
        comment: "Nikos transformed my javelin technique.",
        date: "2023-05-08",
      },
    ],
    tags: ["Javelin", "Discus", "Athletics", "Olympic"],
  },
  {
    id: 6,
    name: "Katerina Papadopoulos",
    specialty: "Functional Training",
    location: "Rhodes, Greece",
    rating: 4.9,
    reviewCount: 84,
    clientCount: 11,
    experience: "9 years",
    proximity: "3.5 km away",
    price: 65,
    priceUnit: "session",
    availability: ["Mon", "Wed", "Fri", "Sat"],
    availableTimes: ["Morning", "Afternoon"],
    bio: "Functional training expert focusing on everyday strength and mobility.",
    image:
      "https://images.pexels.com/photos/136405/pexels-photo-136405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: false,
    isVerified: true,
    testimonials: [
      {
        id: 1,
        clientName: "Elena Kostopoulos",
        rating: 5,
        comment:
          "Katerina's functional training program has completely changed how I move.",
        date: "2023-04-28",
      },
    ],
    tags: ["Functional", "Mobility", "Strength", "Movement"],
  },
  {
    id: 7,
    name: "Thanos Mihailidis",
    specialty: "Olympic Lifting",
    location: "Delphi, Greece",
    rating: 4.8,
    reviewCount: 62,
    clientCount: 9,
    experience: "11 years",
    proximity: "6.2 km away",
    price: 70,
    priceUnit: "session",
    availability: ["Tue", "Thu", "Sat"],
    availableTimes: ["Afternoon", "Evening"],
    bio: "Former Olympic weightlifter specializing in clean & jerk and snatch techniques.",
    image:
      "https://images.pexels.com/photos/31918876/pexels-photo-31918876/free-photo-of-muscular-man-posing-in-modern-gym-interior.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: true,
    isVerified: true,
    testimonials: [
      {
        id: 1,
        clientName: "Georgios Papandreou",
        rating: 4.5,
        comment: "Thanos is a master of Olympic lifting.",
        date: "2023-05-20",
      },
    ],
    tags: ["Olympic Lifting", "Weightlifting", "Strength", "Power"],
  },
  {
    id: 8,
    name: "Daphne Nikolaidis",
    specialty: "Mobility & Balance",
    location: "Santorini, Greece",
    rating: 4.9,
    reviewCount: 93,
    clientCount: 14,
    experience: "8 years",
    proximity: "4.7 km away",
    price: 60,
    priceUnit: "session",
    availability: ["Mon", "Wed", "Fri", "Sun"],
    availableTimes: ["Morning", "Evening"],
    bio: "Yoga and gymnastics specialist focusing on improving mobility and balance.",
    image:
      "https://images.pexels.com/photos/29850907/pexels-photo-29850907/free-photo-of-muscular-man-lifting-dumbbells-in-gym-setting.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: false,
    isVerified: true,
    testimonials: [
      {
        id: 1,
        clientName: "Anastasia Eleftheriou",
        rating: 5,
        comment:
          "Daphne's mobility program has completely transformed my movement patterns.",
        date: "2023-03-15",
      },
    ],
    tags: ["Mobility", "Balance", "Yoga", "Core"],
  },
  {
    id: 9,
    name: "Leonidas Papadakis",
    specialty: "Bodyweight Strength",
    location: "Sparta, Greece",
    rating: 5.0,
    reviewCount: 76,
    clientCount: 10,
    experience: "14 years",
    proximity: "5.3 km away",
    price: 65,
    priceUnit: "session",
    availability: ["Tue", "Thu", "Sat"],
    availableTimes: ["Morning", "Afternoon", "Evening"],
    bio: "Bodyweight training expert inspired by Spartan training methods.",
    image:
      "https://images.pexels.com/photos/29773583/pexels-photo-29773583/free-photo-of-muscular-man-posing-in-gym-for-bodybuilding.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: true,
    isVerified: true,
    testimonials: [
      {
        id: 1,
        clientName: "Kostas Mavridis",
        rating: 5,
        comment:
          "Leonidas's Spartan-inspired training methods have given me strength I never thought possible.",
        date: "2023-06-10",
      },
    ],
    tags: ["Bodyweight", "Calisthenics", "Strength", "Spartan"],
  },
  {
    id: 10,
    name: "Aris Theodorakis",
    specialty: "Sports Performance",
    location: "Athens, Greece",
    rating: 4.9,
    reviewCount: 108,
    clientCount: 13,
    experience: "10 years",
    proximity: "3.1 km away",
    price: 75,
    priceUnit: "session",
    availability: ["Mon", "Wed", "Fri"],
    availableTimes: ["Afternoon", "Evening"],
    bio: "Former professional athlete specializing in sports-specific training.",
    image:
      "https://images.pexels.com/photos/4398901/pexels-photo-4398901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: true,
    isVerified: true,
    tags: ["Sports", "Performance", "Athletic", "Training"],
  },
];

// Functions to get unique values for filtering

export const getAllLocations = () => {
  const locations = trainers.map((trainer) => trainer.location);
  return [...new Set(locations)];
};

export const getAllAvailabilityDays = () => {
  const availabilityDays = trainers.flatMap(
    (trainer) => trainer.availability || []
  );
  return [...new Set(availabilityDays)];
};

export const getAllTags = () => {
  const tags = trainers.flatMap((trainer) => trainer.tags || []);
  return [...new Set(tags)];
};

// Extended trainers data for the marketplace
export const extendedTrainers = [
  ...trainers,
  {
    id: 11,
    name: "Maya Antonopoulos",
    specialty: "Pilates & Core",
    location: "Mykonos, Greece",
    rating: 4.7,
    reviewCount: 67,
    clientCount: 9,
    experience: "6 years",
    proximity: "7.2 km away",
    price: 55,
    priceUnit: "session",
    bio: "Pilates instructor focused on building core strength and stability.",
    image: "https://images.pexels.com/photos/6740053/pexels-photo-6740053.jpeg",
    isFeatured: false,
    isVerified: true,
    tags: ["Pilates", "Core", "Stability", "Balance"],
  },
  {
    id: 12,
    name: "Stavros Vasileiadis",
    specialty: "Powerlifting",
    location: "Thessaloniki, Greece",
    rating: 4.9,
    reviewCount: 82,
    clientCount: 8,
    experience: "12 years",
    proximity: "4.9 km away",
    price: 70,
    priceUnit: "session",
    bio: "Elite powerlifter and strength coach specializing in the big three lifts.",
    image:
      "https://images.pexels.com/photos/6551134/pexels-photo-6551134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: true,
    isVerified: true,
    tags: ["Powerlifting", "Strength", "Compound Lifts", "Power"],
  },
  {
    id: 13,
    name: "Helena Mavridou",
    specialty: "CrossTraining",
    location: "Kalamata, Greece",
    rating: 4.8,
    reviewCount: 94,
    clientCount: 12,
    experience: "7 years",
    proximity: "3.4 km away",
    price: 65,
    priceUnit: "session",
    bio: "CrossTraining specialist who combines strength, conditioning, and endurance work.",
    image:
      "https://images.pexels.com/photos/1103242/pexels-photo-1103242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: false,
    isVerified: true,
    tags: ["CrossTraining", "Functional", "Conditioning", "Strength"],
  },
  {
    id: 14,
    name: "Andreas Eleftheriou",
    specialty: "Athletic Performance",
    location: "Corfu, Greece",
    rating: 4.9,
    reviewCount: 78,
    clientCount: 9,
    experience: "9 years",
    proximity: "5.7 km away",
    price: 70,
    priceUnit: "session",
    bio: "Sports performance specialist focused on maximizing athletic potential.",
    image:
      "https://images.pexels.com/photos/1978505/pexels-photo-1978505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: true,
    isVerified: true,
    tags: ["Sports", "Performance", "Speed", "Agility"],
  },
  {
    id: 15,
    name: "Zoe Karamanlis",
    specialty: "Nutrition & Training",
    location: "Athens, Greece",
    rating: 4.8,
    reviewCount: 103,
    clientCount: 15,
    experience: "8 years",
    proximity: "2.8 km away",
    price: 75,
    priceUnit: "session",
    bio: "Nutritionist and trainer who creates holistic programs for optimal health and performance.",
    image:
      "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: true,
    isVerified: true,
    tags: ["Nutrition", "Holistic", "Wellness", "Performance"],
  },
  {
    id: 16,
    name: "Dimitris Panagiotou",
    specialty: "Boxing & Kickboxing",
    location: "Patras, Greece",
    rating: 4.9,
    reviewCount: 86,
    clientCount: 10,
    experience: "11 years",
    proximity: "4.3 km away",
    price: 65,
    priceUnit: "session",
    bio: "Former professional boxer teaching traditional and modern striking techniques.",
    image:
      "https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: false,
    isVerified: true,
    tags: ["Boxing", "Kickboxing", "Combat", "Conditioning"],
  },
  {
    id: 17,
    name: "Anastasia Kostopoulou",
    specialty: "Dance & Movement",
    location: "Nafplio, Greece",
    rating: 4.7,
    reviewCount: 72,
    clientCount: 8,
    experience: "6 years",
    proximity: "6.1 km away",
    price: 55,
    priceUnit: "session",
    bio: "Professional dancer teaching movement as a form of fitness and artistic expression.",
    image:
      "https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: false,
    isVerified: true,
    tags: ["Dance", "Movement", "Expression", "Cardio"],
  },
  {
    id: 18,
    name: "Christos Leventis",
    specialty: "Senior Fitness",
    location: "Rhodes, Greece",
    rating: 4.9,
    reviewCount: 65,
    clientCount: 12,
    experience: "15 years",
    proximity: "3.9 km away",
    price: 65,
    priceUnit: "session",
    bio: "Specialist in fitness for older adults with focus on mobility, strength, and independence.",
    image:
      "https://images.pexels.com/photos/7991663/pexels-photo-7991663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: true,
    isVerified: true,
    tags: ["Senior", "Mobility", "Functional", "Longevity"],
  },
  {
    id: 19,
    name: "Irini Papaioannou",
    specialty: "Rehabilitation",
    location: "Heraklion, Greece",
    rating: 5.0,
    reviewCount: 91,
    clientCount: 8,
    experience: "12 years",
    proximity: "4.2 km away",
    price: 80,
    priceUnit: "session",
    bio: "Physical therapist and trainer specializing in injury rehabilitation and prevention.",
    image:
      "https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: true,
    isVerified: true,
    tags: ["Rehabilitation", "Recovery", "Injury", "Therapy"],
  },
  {
    id: 20,
    name: "Kostas Georgiadis",
    specialty: "Gymnastics & Acrobatics",
    location: "Athens, Greece",
    rating: 4.8,
    reviewCount: 74,
    clientCount: 6,
    experience: "10 years",
    proximity: "5.8 km away",
    price: 75,
    priceUnit: "session",
    bio: "Former gymnast teaching body control, strength, and acrobatic skills to all levels.",
    image:
      "https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    isFeatured: false,
    isVerified: true,
    tags: ["Gymnastics", "Acrobatics", "Body Control", "Strength"],
  },
];
