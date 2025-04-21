import { svgData } from "./svgData";

export const TOTAL_STEPS = 6;

export const stepConfig = [
  {
    stepNumber: 1,
    title: "How do you want to train?",
    emoji: "🔸",
    field: "trainingType",
    options: [
      {
        value: "trainer",
        emoji: "👨‍🏫",
        title: "With a Trainer",
        description: "Follow your coach's custom plan",
      },
      {
        value: "alone",
        emoji: "💪",
        title: "By Myself",
        description: "Choose your own pace",
      },
    ],
  },
  {
    stepNumber: 2,
    title: "Where will you be training?",
    emoji: "🌍",
    field: "environment",
    options: [
      {
        value: "gym",
        emoji: "🏋️",
        title: "In the Gym",
        bgImage: svgData.gym,
      },
      {
        value: "outside",
        emoji: "🌳",
        title: "Outside",
        bgImage: svgData.outside,
      },
    ],
  },
  {
    stepNumber: 3,
    title: "What equipment do you have?",
    emoji: "🛠️",
    field: "equipment",
    options: [
      {
        value: "with-equipment",
        emoji: "🏋️‍♂️",
        title: "With Equipment",
        description: "Dumbbells, resistance bands, etc.",
      },
      {
        value: "no-equipment",
        emoji: "🧘",
        title: "Bodyweight Only",
        description: "No equipment needed",
      },
    ],
  },
  {
    stepNumber: 4,
    title: "How long have you been training?",
    emoji: "⏱️",
    field: "experience",
    options: [
      {
        value: "beginner",
        emoji: "🌱",
        title: "Beginner",
        description: "0-6 months",
      },
      {
        value: "intermediate",
        emoji: "🔄",
        title: "Intermediate",
        description: "6 months - 2 years",
      },
      {
        value: "advanced",
        emoji: "💪",
        title: "2 to 5 years",
        description: "2-5 years",
      },
      {
        value: "expert",
        emoji: "🏆",
        title: "5+ years",
        description: "More than 5 years",
      },
    ],
  },
  {
    stepNumber: 5,
    title: "What's your main goal?",
    emoji: "🎯",
    field: "goal",
    options: [
      {
        value: "strength",
        emoji: "💪",
        title: "Build Strength",
        description: "Increase power & force",
      },
      {
        value: "muscle",
        emoji: "🏋️‍♀️",
        title: "Build Muscle",
        description: "Gain size & definition",
      },
      {
        value: "lose-weight",
        emoji: "🔥",
        title: "Lose Weight",
        description: "Burn fat & reduce weight",
      },
      {
        value: "endurance",
        emoji: "🏃",
        title: "Build Endurance",
        description: "Improve stamina & cardio",
      },
    ],
  },
  {
    stepNumber: 6,
    title: "How many times per week will you train?",
    emoji: "📅",
    field: "frequency",
    isFrequencyStep: true,
  },
];
