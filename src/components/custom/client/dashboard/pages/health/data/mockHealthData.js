// Mock health data for the health dashboard
const getCurrentDates = () => {
    const dates = [];
    const today = new Date();

    // Generate dates for last 3 days, today, and next 3 days
    // First add past dates (going backwards from yesterday)
    for (let i = 3; i > 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split("T")[0]);
    }

    // Add today
    dates.push(today.toISOString().split("T")[0]);

    // Add future dates
    for (let i = 1; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split("T")[0]);
    }

    return dates;
};

const dates = getCurrentDates();

// Helper function to create empty health data for future dates
const createEmptyHealthData = (date) => ({
    date,
    steps: 0,
    activeMinutes: 0,
    caloriesBurned: 0,
    distance: 0,
    heartRate: {
        resting: 0,
        average: 0,
        max: 0,
    },
    sleep: {
        hours: 0,
        deep: 0,
        rem: 0,
        light: 0,
        efficiency: 0,
        qualityScore: 0,
    },
    wellness: {
        stressLevel: 0,
        recoveryScore: 0,
        strain: 0,
        readiness: 0,
        bloodPressure: {
            systolic: 0,
            diastolic: 0,
        },
        bloodOxygen: 0,
    },
});

export const mockHealthData = [
    // Past dates (last 3 days)
    {
        date: dates[0], // 3 days ago
        steps: 15842,
        activeMinutes: 106,
        caloriesBurned: 732,
        distance: 12.27,
        heartRate: {
            resting: 58,
            average: 88,
            max: 175,
        },
        sleep: {
            hours: 7.2,
            deep: 20,
            rem: 25,
            light: 55,
            efficiency: 82,
            qualityScore: 78,
        },
        wellness: {
            stressLevel: 35,
            recoveryScore: 82,
            strain: 88,
            readiness: 75,
            bloodPressure: {
                systolic: 118,
                diastolic: 73,
            },
            bloodOxygen: 98,
        },
    },
    {
        date: dates[1], // 2 days ago
        steps: 3254,
        activeMinutes: 28,
        caloriesBurned: 198,
        distance: 2.45,
        heartRate: {
            resting: 72,
            average: 82,
            max: 145,
        },
        sleep: {
            hours: 5.2,
            deep: 15,
            rem: 18,
            light: 67,
            efficiency: 65,
            qualityScore: 45,
        },
        wellness: {
            stressLevel: 75,
            recoveryScore: 45,
            strain: 85,
            readiness: 35,
            bloodPressure: {
                systolic: 135,
                diastolic: 88,
            },
            bloodOxygen: 94,
        },
    },
    {
        date: dates[2], // Yesterday
        steps: 12458,
        activeMinutes: 92,
        caloriesBurned: 586,
        distance: 9.52,
        heartRate: {
            resting: 58,
            average: 82,
            max: 155,
        },
        sleep: {
            hours: 8.5,
            deep: 28,
            rem: 32,
            light: 40,
            efficiency: 95,
            qualityScore: 92,
        },
        wellness: {
            stressLevel: 25,
            recoveryScore: 92,
            strain: 75,
            readiness: 88,
            bloodPressure: {
                systolic: 115,
                diastolic: 72,
            },
            bloodOxygen: 99,
        },
    },
    // Today
    {
        date: dates[3], // Today
        steps: 8723,
        activeMinutes: 58,
        caloriesBurned: 412,
        distance: 6.65,
        heartRate: {
            resting: 65,
            average: 78,
            max: 132,
        },
        sleep: {
            hours: 7.5,
            deep: 22,
            rem: 28,
            light: 50,
            efficiency: 87,
            qualityScore: 75,
        },
        wellness: {
            stressLevel: 42,
            recoveryScore: 75,
            strain: 40,
            readiness: 68,
            bloodPressure: {
                systolic: 121,
                diastolic: 76,
            },
            bloodOxygen: 97,
        },
    },
    // Future dates (next 3 days) - all zeros
    createEmptyHealthData(dates[4]), // Tomorrow
    createEmptyHealthData(dates[5]), // Day after tomorrow
    createEmptyHealthData(dates[6]), // 3 days from now
];

// Weekly stats with more distinctive data for each day
export const mockWeeklyStats = [
    { date: dates[0], day: "3 days ago", steps: 15842, activeMins: 106, calories: 732 }, // High activity day
    { date: dates[1], day: "2 days ago", steps: 3254, activeMins: 28, calories: 198 }, // Worst day
    { date: dates[2], day: "Yesterday", steps: 12458, activeMins: 92, calories: 586 }, // Best day
    { date: dates[3], day: "Today", steps: 8723, activeMins: 58, calories: 412 }, // Moderate day
    { date: dates[4], day: "Tomorrow", steps: 0, activeMins: 0, calories: 0 }, // Future day
    { date: dates[5], day: "2 days ahead", steps: 0, activeMins: 0, calories: 0 }, // Future day
    { date: dates[6], day: "3 days ahead", steps: 0, activeMins: 0, calories: 0 }, // Future day
];

// Activity breakdown mock data
export const mockActivityBreakdown = [
    { activity: "Walking", minutes: 62, color: "#7B61FF" },
    { activity: "Running", minutes: 24, color: "#80FFD1" },
    { activity: "Cycling", minutes: 32, color: "#FFB840" },
    { activity: "Workout", minutes: 28, color: "#FF6B6B" },
    { activity: "Other", minutes: 14, color: "#5E5CE6" },
];

// Health score mock data with clear differentiation
export const mockHealthScore = {
    overall: 78,
    components: {
        activity: 82,
        sleep: 75,
        recovery: 76,
        nutrition: 80,
    },
};

// Color presets for health metrics
export const healthColors = {
    strain: ["#FF9500", "#FF6B00"],
    recovery: ["#ADFF2F", "#32CD32"],
    sleep: ["#5E5CE6", "#BF5AF2"],
    activity: ["#30D158", "#4CD964"],
    nutrition: ["#FF9500", "#FFCC00"],
    readiness: ["#5AC8FA", "#007AFF"],
};
