import { CheckIcon } from "@/components/common/Icons";

export const About = ({ trainer }) => (
  <div className="space-y-6">
    <div>
      <h3 className="mb-3 text-xl font-semibold text-white">About {trainer?.name}</h3>
      <p className="leading-relaxed text-gray-300">{trainer?.description || "No description available."}</p>
    </div>

    <div>
      <h4 className="mb-2 text-lg font-medium text-white">Training Philosophy</h4>
      <p className="leading-relaxed text-gray-300">
        {trainer?.philosophy ||
          "My approach to training is focused on building sustainable habits and tailoring workouts to individual needs. I believe in a balanced approach that combines strength, conditioning, mobility, and proper recovery techniques."}
      </p>
    </div>

    <div>
      <h4 className="mb-2 text-lg font-medium text-white">Education & Background</h4>
      <ul className="list-disc space-y-2 pl-5 text-gray-300">
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
      <h4 className="mb-2 text-lg font-medium text-white">Services</h4>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {trainer?.services ? (
          trainer.services.map((service, index) => (
            <div key={index} className="rounded-lg border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.1)] p-3">
              <div className="mb-1 flex items-center gap-2">
                <CheckIcon size={16} stroke="#FF6B00" />
                <h5 className="font-medium text-white">{service.name}</h5>
              </div>
              <p className="text-sm text-gray-300">{service.description}</p>
            </div>
          ))
        ) : (
          <>
            <div className="rounded-lg border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.1)] p-3">
              <div className="mb-1 flex items-center gap-2">
                <CheckIcon size={16} stroke="#FF6B00" />
                <h5 className="font-medium text-white">Personal Training</h5>
              </div>
              <p className="text-sm text-gray-300">
                One-on-one customized training sessions to meet your specific goals.
              </p>
            </div>

            <div className="rounded-lg border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.1)] p-3">
              <div className="mb-1 flex items-center gap-2">
                <CheckIcon size={16} stroke="#FF6B00" />
                <h5 className="font-medium text-white">Nutrition Planning</h5>
              </div>
              <p className="text-sm text-gray-300">
                Customized meal plans and nutritional guidance to complement your training.
              </p>
            </div>

            <div className="rounded-lg border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.1)] p-3">
              <div className="mb-1 flex items-center gap-2">
                <CheckIcon size={16} stroke="#FF6B00" />
                <h5 className="font-medium text-white">Performance Assessment</h5>
              </div>
              <p className="text-sm text-gray-300">
                Comprehensive analysis of your current fitness level and performance metrics.
              </p>
            </div>

            <div className="rounded-lg border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.1)] p-3">
              <div className="mb-1 flex items-center gap-2">
                <CheckIcon size={16} stroke="#FF6B00" />
                <h5 className="font-medium text-white">Remote Coaching</h5>
              </div>
              <p className="text-sm text-gray-300">
                Virtual training sessions and programming for clients who prefer training remotely.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);
