import { VaseIcon, ParthenonIcon, ColosseumIcon, ColumnIcon, RunnerIcon, DiscusIcon } from "@/components/common/Icons";

export const TOTAL_STEPS = 9;

export const stepConfig = [
  {
    stepNumber: 1,
    title: "Where will you be training?",
    emoji: "🌍",
    field: "environment",
    options: [
      {
        value: "gym",
        emoji: "🏋️",
        title: "In the Gym",
        icon: <ParthenonIcon className="w-12 h-12" />,
      },
      {
        value: "outside",
        emoji: "🌳",
        title: "Outside",
        icon: <ColosseumIcon className="w-12 h-12" />,
      },
    ],
  },
  {
    stepNumber: 2,
    title: "What equipment do you have?",
    emoji: "🛠️",
    field: "equipment",
    options: [
      {
        value: "with-equipment",
        emoji: "🏋️‍♂️",
        title: "With Equipment",
        description: "Dumbbells, resistance bands, etc.",
        icon: <ColumnIcon className="w-12 h-12" />,
      },
      {
        value: "no-equipment",
        emoji: "🧘",
        title: "Bodyweight Only",
        description: "No equipment needed",
        icon: <VaseIcon className="w-12 h-12" />,
      },
    ],
  },
  {
    stepNumber: 3,
    title: "How long have you been training?",
    emoji: "⏱️",
    field: "experience",
    options: [
      {
        value: "beginner",
        emoji: "🌱",
        title: "Beginner",
        description: "0-6 months",
        icon: <RunnerIcon className="w-12 h-12" />,
      },
      {
        value: "intermediate",
        emoji: "🔄",
        title: "Intermediate",
        description: "6 months - 2 years",
        icon: <DiscusIcon className="w-12 h-12" />,
      },
      {
        value: "advanced",
        emoji: "💪",
        title: "2 to 5 years",
        description: "2-5 years",
        icon: <ParthenonIcon className="w-12 h-12" />,
      },
      {
        value: "expert",
        emoji: "🏆",
        title: "5+ years",
        description: "More than 5 years",
        icon: <ColosseumIcon className="w-12 h-12" />,
      },
    ],
  },
  {
    stepNumber: 4,
    title: "What's your main goal?",
    emoji: "🎯",
    field: "goal",
    options: [
      {
        value: "strength",
        emoji: "💪",
        title: "Build Strength",
        description: "Increase power & force",
        icon: <ColumnIcon className="w-12 h-12" />,
      },
      {
        value: "muscle",
        emoji: "🏋️‍♀️",
        title: "Build Muscle",
        description: "Gain size & definition",
        icon: <VaseIcon className="w-12 h-12" />,
      },
      {
        value: "lose-weight",
        emoji: "🔥",
        title: "Lose Weight",
        description: "Burn fat & reduce weight",
        icon: <RunnerIcon className="w-12 h-12" />,
      },
      {
        value: "endurance",
        emoji: "🏃",
        title: "Build Endurance",
        description: "Improve stamina & cardio",
        icon: <DiscusIcon className="w-12 h-12" />,
      },
    ],
  },
  {
    stepNumber: 5,
    title: "How many times per week will you train?",
    emoji: "📅",
    field: "frequency",
    isFrequencyStep: true,
  },
  {
    stepNumber: 9,
    title: "What are your measurements?",
    emoji: "📏",
    field: "measurements",
    isMeasurementsStep: true,
  },
];
