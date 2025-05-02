import { InfoIcon } from "../../../components/common/Icons";

/**
 * Tips section component with motivational quotes and tips based on registration step
 */
export const TipsSection = ({ step, userType = "client" }) => {
  const quotes = {
    client: [
      {
        quote: "The only bad workout is the one that didn't happen.",
        author: "Unknown",
      },
      {
        quote: "Fitness is not about being better than someone else. It's about being better than you used to be.",
        author: "Khloe Kardashian",
      },
      {
        quote: "The difference between try and triumph is just a little umph!",
        author: "Marvin Phillips",
      },
      {
        quote: "The body achieves what the mind believes.",
        author: "Napoleon Hill",
      },
      {
        quote: "You don't have to be great to start, but you have to start to be great.",
        author: "Zig Ziglar",
      },
    ],
  };

  // Pick a random quote based on user type
  const userQuotes = quotes[userType] || quotes.client;
  const randomQuote = userQuotes[Math.floor(Math.random() * userQuotes.length)];

  // Steps for trainers
  const renderTrainerTips = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-2">
            <p>✓ Use your full professional name as it will appear to clients</p>
            <p>✓ Be specific about your experience level - honesty builds trust</p>
            <p>✓ Your bio should highlight your training philosophy and approach</p>
            <p>✓ Location details help match you with nearby clients</p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-2">
            <p>✓ List all relevant certifications - these build credibility</p>
            <p>✓ Your specialty helps clients find trainers with specific expertise</p>
            <p>✓ Include certification numbers if applicable for verification</p>
            <p>✓ Consider adding specialized training methods you're certified in</p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-2">
            <p>✓ List all locations where you're available to train clients</p>
            <p>✓ Select all activities you're qualified to coach</p>
            <p>✓ Being specific about sports expertise helps match with the right clients</p>
            <p>✓ Consider adding online training if you offer virtual sessions</p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-2">
            <p>✓ Use a professional headshot that clearly shows your face</p>
            <p>✓ Ensure your contact details are accurate and professional</p>
            <p>✓ Consider which email and phone number clients will use to reach you</p>
            <p>✓ Double-check all information before completing your profile</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto mb-4 mt-8 max-w-2xl text-center">
      {userType === "trainer" ? (
        <div className="mb-6 rounded-xl border border-[#222] bg-[rgba(20,20,20,0.8)] p-6 text-left shadow-lg">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-medium text-[#FF6B00]">
            <InfoIcon size={20} />
            Profile Setup Tips
          </h3>
          <div className="space-y-4 text-gray-300">{renderTrainerTips()}</div>
        </div>
      ) : (
        <div>
          <blockquote className="text-lg italic text-gray-300">"{randomQuote.quote}"</blockquote>
          <p className="mt-2 text-[#FF6B00]">- {randomQuote.author}</p>
        </div>
      )}
    </div>
  );
};
