import { Button } from "@/components/common/Button";

export const Testimonials = ({ trainer, renderStars }) => {
    // Default testimonials if not provided
    const defaultTestimonials = [
        {
            id: 1,
            name: "James Wilson",
            avatar: null,
            rating: 5,
            date: "2 months ago",
            text: "Working with this trainer has completely transformed my approach to fitness. Their knowledge of sport-specific training is exceptional, and I've seen major improvements in my performance on the field.",
            relationship: "Client for 8 months",
        },
        {
            id: 2,
            name: "Sophia Chen",
            avatar: null,
            rating: 4.5,
            date: "3 months ago",
            text: "I came to them with a history of injuries and was nervous about getting back into training. Their expertise in rehabilitation and careful approach to programming gave me confidence. I'm now stronger than I was before my injuries!",
            relationship: "Client for 6 months",
        },
        {
            id: 3,
            name: "Michael Rodriguez",
            avatar: null,
            rating: 5,
            date: "1 month ago",
            text: "Not only is this trainer knowledgeable, but they're also incredibly motivating. Sessions are always challenging but fun, and the results speak for themselves. Highly recommend for anyone serious about their athletic development.",
            relationship: "Client for 3 months",
        },
        {
            id: 4,
            name: "Emma Johnson",
            avatar: null,
            rating: 4,
            date: "5 months ago",
            text: "Great coach who really takes the time to understand your goals. The personalized approach makes all the difference, and they're constantly adjusting the program as I progress. Communication is excellent too!",
            relationship: "Client for 12 months",
        },
    ];

    // Calculate average rating
    const testimonials = trainer?.testimonials || defaultTestimonials;
    const avgRating = testimonials.reduce((acc, item) => acc + item.rating, 0) / testimonials.length;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-4">Client Testimonials</h3>

                {/* Rating summary */}
                <div className="bg-[rgba(30,30,30,0.8)] border border-[#444] rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center gap-5">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-4xl font-bold text-[#FF6B00] mb-1">{avgRating.toFixed(1)}</div>
                        <div className="flex gap-1 mb-2">{renderStars(avgRating)}</div>
                        <div className="text-gray-400 text-sm">Based on {testimonials.length} reviews</div>
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                        {[5, 4, 3, 2, 1].map(num => {
                            const count = testimonials.filter(t => Math.floor(t.rating) === num).length;
                            const percentage = (count / testimonials.length) * 100;

                            return (
                                <div key={num} className="flex items-center gap-3">
                                    <div className="text-gray-300 text-sm w-6">{num}★</div>
                                    <div className="flex-1 h-2 bg-[#333] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-gray-300 text-sm w-6">{count}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Individual testimonials */}
            <div className="space-y-5">
                {testimonials.map(testimonial => (
                    <div
                        key={testimonial.id}
                        className="bg-[rgba(30,30,30,0.8)] border border-[#444] rounded-xl p-5 hover:border-[#FF6B00] transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex gap-3 items-center">
                                {testimonial.avatar ? (
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-[#FF6B00]"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex justify-center items-center text-white font-semibold text-lg">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <div className="font-medium text-white">{testimonial.name}</div>
                                    <div className="text-gray-400 text-xs">{testimonial.relationship}</div>
                                </div>
                            </div>
                            <div className="text-gray-400 text-xs">{testimonial.date}</div>
                        </div>

                        <div className="flex gap-1 mb-3">{renderStars(testimonial.rating)}</div>

                        <p className="text-gray-300 text-sm leading-relaxed">"{testimonial.text}"</p>
                    </div>
                ))}
            </div>

            {/* Call to action */}
            <div className="bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)] rounded-xl p-5 text-center">
                <h4 className="text-white font-medium mb-2">Ready to experience results?</h4>
                <p className="text-gray-300 text-sm mb-4">Join these satisfied clients and start your fitness journey today.</p>
                <Button variant="orangeFilled" size="large">
                    Book Your First Session
                </Button>
            </div>
        </div>
    );
};
