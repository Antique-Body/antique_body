const mockTrainings = {
    name: "Strength & Conditioning Program",
    coach: "Alex Miller",
    startDate: "May 10, 2023",
    endDate: "August 10, 2023",
    progress: {
      completedSessions: 14,
      totalSessions: 48,
      nextMilestone: "Bench Press 80kg",
    },
    days: [
      {
        id: 1,
        name: "Day 1 - Lower Body Power",
        estimatedTime: "45-60 min",
        waterRecommendation: 1000, // ml
        isToday: true,
        isTomorrow: false,
        note: "Focus on form rather than weight. Take your time between sets to fully recover.",
        exercises: [
          {
            id: 101,
            name: "Barbell Back Squat",
            sets: 4,
            reps: "8-10",
            weight: "70kg or 60% of 1RM",
            rest: "90 sec",
            instructions: "Keep chest up, drive through heels, maintain neutral spine throughout the movement.",
            videoUrl: "https://www.youtube.com/embed/ultWZbUMPL8"
          },
          {
            id: 102,
            name: "Romanian Deadlift",
            sets: 3,
            reps: "10-12",
            weight: "60kg or 50% of 1RM",
            rest: "90 sec",
            instructions: "Hinge at the hips, keep back flat, feel the stretch in hamstrings, and maintain slight bend in knees.",
            videoUrl: "https://www.youtube.com/embed/2SHsk9AzdjA"
          },
          {
            id: 103,
            name: "Walking Lunges",
            sets: 3,
            reps: "12 (each leg)",
            weight: "15kg dumbbells",
            rest: "60 sec",
            instructions: "Step forward into lunge, ensure front knee is aligned with ankle, push through heel to next step.",
            videoUrl: "https://www.youtube.com/embed/eFSSXtdPBJo"
          },
          {
            id: 104,
            name: "Leg Press",
            sets: 3,
            reps: "12-15",
            weight: "130kg",
            rest: "90 sec",
            instructions: "Position feet shoulder-width apart, lower weight until knees reach 90 degrees, push through heels.",
            videoUrl: "https://www.youtube.com/embed/IZxyjW7MPJQ"
          },
          {
            id: 105,
            name: "Standing Calf Raises",
            sets: 4,
            reps: "15-20",
            weight: "40kg",
            rest: "45 sec",
            instructions: "Rise onto toes fully, feel stretch at bottom of movement, control throughout range of motion.",
            videoUrl: "https://www.youtube.com/embed/JbyjNymZOt0"
          }
        ]
      },
      {
        id: 2,
        name: "Day 2 - Upper Body Strength",
        estimatedTime: "50-65 min",
        waterRecommendation: 1000, // ml
        isToday: false,
        isTomorrow: true,
        note: "Maintain proper breathing - exhale on exertion, inhale on return. Focus on controlled movements.",
        exercises: [
          {
            id: 201,
            name: "Bench Press",
            sets: 4,
            reps: "8-10",
            weight: "65kg or 60% of 1RM",
            rest: "90 sec",
            instructions: "Maintain stable shoulder position, feet planted on floor, and controlled bar path.",
            videoUrl: "https://www.youtube.com/embed/vcBig73ojpE"
          },
          {
            id: 202,
            name: "Bent Over Rows",
            sets: 4,
            reps: "10-12",
            weight: "50kg",
            rest: "90 sec",
            instructions: "Hinge at hips, pull weight to lower ribs, keep elbows close to body, maintain neutral spine.",
            videoUrl: "https://www.youtube.com/embed/kBWAon7ItDw"
          },
          {
            id: 203,
            name: "Overhead Press",
            sets: 3,
            reps: "8-10",
            weight: "40kg",
            rest: "90 sec",
            instructions: "Start with bar at shoulder height, press upward without arching lower back, lock out at top.",
            videoUrl: "https://www.youtube.com/embed/F3QY5vMz_6I"
          },
          {
            id: 204,
            name: "Pull-Ups",
            sets: 3,
            reps: "8-10",
            weight: "Bodyweight",
            rest: "90 sec",
            instructions: "Grip bar slightly wider than shoulders, pull chin over bar, maintain tight core throughout.",
            videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g"
          },
          {
            id: 205,
            name: "Tricep Dips",
            sets: 3,
            reps: "10-12",
            weight: "Bodyweight",
            rest: "60 sec",
            instructions: "Keep elbows tucked in, lower until upper arms are parallel to floor, press back up to starting position.",
            videoUrl: "https://www.youtube.com/embed/6kALZikXxLc"
          }
        ]
      },
      {
        id: 3,
        name: "Day 3 - Core & Conditioning",
        estimatedTime: "40-55 min",
        waterRecommendation: 1200, // ml
        isToday: false,
        isTomorrow: false,
        note: "Keep intensity high with minimal rest between exercises. Focus on quality of movement over speed.",
        exercises: [
          {
            id: 301,
            name: "Plank Circuit",
            sets: 3,
            reps: "40 sec each variation",
            weight: "Bodyweight",
            rest: "60 sec between sets",
            instructions: "Perform front plank, side plank left, side plank right, and reverse plank for 40 seconds each with minimal transition time.",
            videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c"
          },
          {
            id: 302,
            name: "Medicine Ball Slams",
            sets: 3,
            reps: "15",
            weight: "8kg ball",
            rest: "45 sec",
            instructions: "Raise ball overhead, engage core, and slam ball to ground with force. Catch on bounce or pick up and repeat.",
            videoUrl: "https://www.youtube.com/embed/9Fb3NCY2PLw"
          },
          {
            id: 303,
            name: "Russian Twists",
            sets: 3,
            reps: "20 (10 each side)",
            weight: "10kg",
            rest: "45 sec",
            instructions: "Sit with knees bent, lean back slightly, rotate torso to touch weight to ground on each side.",
            videoUrl: "https://www.youtube.com/embed/JyUqwkVpsi8"
          },
          {
            id: 304,
            name: "Battle Ropes",
            sets: 4,
            reps: "30 seconds",
            weight: "N/A",
            rest: "45 sec",
            instructions: "Alternate waves pattern while maintaining stable lower body position and engaged core.",
            videoUrl: "https://www.youtube.com/embed/r2-JVXCw2fI"
          },
          {
            id: 305,
            name: "Mountain Climbers",
            sets: 3,
            reps: "40 seconds",
            weight: "Bodyweight",
            rest: "30 sec",
            instructions: "Start in push-up position, rapidly alternate bringing knees to chest while maintaining stable shoulders and hips.",
            videoUrl: "https://www.youtube.com/embed/nmwgirgXLYM"
          }
        ]
      }
    ]
  };

  export default mockTrainings;