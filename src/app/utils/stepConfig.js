import {
  VaseIcon,
  ParthenonIcon,
  ColosseumIcon,
  ColumnIcon,
  RunnerIcon,
  DiscusIcon,
} from "@/components/common/Icons";

export const TOTAL_STEPS = 8;

export const stepConfig = [
  {
    stepNumber: 1,
    title: "Do you have any injuries?",
    emoji: "🩹",
    field: "hasInjury",
    options: [
      {
        value: "no",
        emoji: "✅",
        title: "No Injuries",
        description: "I don't have any injuries",
        icon: <RunnerIcon className="w-12 h-12" />,
      },
      {
        value: "past",
        emoji: "🕒",
        title: "Past Injury",
        description: "I had an injury in the past",
        icon: <DiscusIcon className="w-12 h-12" />,
      },
      {
        value: "current",
        emoji: "🤕",
        title: "Current Injury",
        description: "I have a current injury",
        icon: <VaseIcon className="w-12 h-12" />,
      },
      {
        value: "chronic",
        emoji: "⚠️",
        title: "Chronic Injury",
        description: "I have a chronic/recurring injury",
        icon: <ColumnIcon className="w-12 h-12" />,
      },
    ],
  },
  {
    stepNumber: 2,
    title: "Select injured body parts",
    emoji: "🦴",
    field: "injuryLocations",
    isInjuryLocationStep: true,
    dependsOn: {
      field: "hasInjury",
      values: ["past", "current", "chronic"],
    },
  },
  {
    stepNumber: 3,
    title: "Do you want rehabilitation?",
    emoji: "🏥",
    field: "wantsRehabilitation",
    dependsOn: {
      field: "hasInjury",
      values: ["past", "current", "chronic"],
    },
    options: [
      {
        value: "yes",
        emoji: "🧠",
        title: "Yes",
        description: "I want rehabilitation exercises",
        icon: <ParthenonIcon className="w-12 h-12" />,
      },
      {
        value: "no",
        emoji: "💪",
        title: "No",
        description: "I want a regular workout",
        icon: <ColumnIcon className="w-12 h-12" />,
      },
    ],
  },
  {
    stepNumber: 4,
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
    stepNumber: 5,
    title: "What equipment do you have?",
    emoji: "🛠️",
    field: "equipment",
    options: [
      {
        value: "with_equipment",
        emoji: "🏋️‍♂️",
        title: "With Equipment",
        description: "Dumbbells, resistance bands, etc.",
        icon: <ColumnIcon className="w-12 h-12" />,
      },
      {
        value: "no_equipment",
        emoji: "🧘",
        title: "Bodyweight Only",
        description: "No equipment needed",
        icon: <VaseIcon className="w-12 h-12" />,
      },
    ],
  },
  {
    stepNumber: 6,
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
    stepNumber: 7,
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
        value: "lose_weight",
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
    stepNumber: 8,
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
