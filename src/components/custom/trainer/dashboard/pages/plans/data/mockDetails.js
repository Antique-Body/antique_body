// Mock details for plan preview in training and nutrition plans
const mockDetails = {
    overview: {
        summary:
            "This comprehensive plan is designed to help clients achieve their specific goals through a structured approach tailored to individual needs.",
        keyFeatures: [
            "Personalized approach for each client",
            "Progressive adjustments based on progress",
            "Weekly check-ins and progress tracking",
            "Comprehensive tracking tools and resources",
        ],
        targetAudience: {
            nutrition: "Clients looking to improve their nutrition habits, manage weight, or enhance performance through diet.",
            training: "Clients seeking to improve strength, endurance, mobility, or sport-specific performance.",
        },
    },
    schedule: {
        weeks: {
            nutrition: [
                "Week 1-2: Baseline establishment",
                "Week 3-4: Habit formation",
                "Week 5-8: Progressive implementation",
            ],
            training: ["Week 1-2: Foundation building", "Week 3-4: Volume progression", "Week 5-6: Intensity focus"],
        },
        frequency: {
            nutrition: "Daily meal plans",
            training: "4-5 sessions per week",
        },
        adaptability: "Highly customizable based on client progress and feedback",
    },
    clients: {
        successRate: "87%",
        averageRating: 4.7,
        testimonial: {
            text: "This plan transformed my approach and helped me achieve results I didn't think were possible.",
            author: "Alex T., Client",
        },
    },
};

export default mockDetails;
