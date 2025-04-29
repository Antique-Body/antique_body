import { CheckIcon } from "@/components/common/Icons";

export const About = ({ trainer }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-3">About {trainer?.name}</h3>
                <p className="text-gray-300 leading-relaxed">{trainer?.description || "No description available."}</p>
            </div>

            <div>
                <h4 className="text-lg font-medium text-white mb-2">Training Philosophy</h4>
                <p className="text-gray-300 leading-relaxed">
                    {trainer?.philosophy ||
                        "My approach to training is focused on building sustainable habits and tailoring workouts to individual needs. I believe in a balanced approach that combines strength, conditioning, mobility, and proper recovery techniques."}
                </p>
            </div>

            <div>
                <h4 className="text-lg font-medium text-white mb-2">Education & Background</h4>
                <ul className="list-disc pl-5 text-gray-300 space-y-2">
                    {trainer?.education ? (
                        trainer.education.map((item, index) => <li key={index}>{item}</li>)
                    ) : (
                        <>
                            <li>Bachelor's Degree in Exercise Science</li>
                            <li>Multiple fitness and sport-specific certifications</li>
                            <li>Continuous education in latest training methodologies</li>
                        </>
                    )}
                </ul>
            </div>

            <div>
                <h4 className="text-lg font-medium text-white mb-2">Services</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {trainer?.services ? (
                        trainer.services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)] rounded-lg p-3"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckIcon size={16} stroke="#FF6B00" />
                                    <h5 className="font-medium text-white">{service.name}</h5>
                                </div>
                                <p className="text-gray-300 text-sm">{service.description}</p>
                            </div>
                        ))
                    ) : (
                        <>
                            <div className="bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)] rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckIcon size={16} stroke="#FF6B00" />
                                    <h5 className="font-medium text-white">Personal Training</h5>
                                </div>
                                <p className="text-gray-300 text-sm">
                                    One-on-one customized training sessions to meet your specific goals.
                                </p>
                            </div>

                            <div className="bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)] rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckIcon size={16} stroke="#FF6B00" />
                                    <h5 className="font-medium text-white">Nutrition Planning</h5>
                                </div>
                                <p className="text-gray-300 text-sm">
                                    Customized meal plans and nutritional guidance to complement your training.
                                </p>
                            </div>

                            <div className="bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)] rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckIcon size={16} stroke="#FF6B00" />
                                    <h5 className="font-medium text-white">Performance Assessment</h5>
                                </div>
                                <p className="text-gray-300 text-sm">
                                    Comprehensive analysis of your current fitness level and performance metrics.
                                </p>
                            </div>

                            <div className="bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)] rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckIcon size={16} stroke="#FF6B00" />
                                    <h5 className="font-medium text-white">Remote Coaching</h5>
                                </div>
                                <p className="text-gray-300 text-sm">
                                    Virtual training sessions and programming for clients who prefer training remotely.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
