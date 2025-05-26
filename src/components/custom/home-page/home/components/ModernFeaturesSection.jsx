import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export const ModernFeaturesSection = ({ features }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  // Function to render icon based on its type
  const renderIcon = (icon) => {
    // If icon is a string (Iconify icon name), render it with the Icon component
    if (typeof icon === "string") {
      return <Icon icon={icon} className="text-3xl" />;
    }
    // If it's already a JSX element, return it directly
    return icon;
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF6B00]/10 to-transparent backdrop-blur-sm mb-4">
          <span className="text-sm font-medium text-[#FF6B00]">
            Revolutionary Approach
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
          <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
            Modern Training Platform
          </span>
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Our platform merges ancient athletic wisdom with cutting-edge
          technology to deliver an unparalleled fitness experience
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Feature navigation */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div className="flex flex-col gap-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative px-6 py-5 rounded-xl transition-all duration-300 cursor-pointer group ${
                  activeFeature === index
                    ? "bg-gradient-to-r from-[#FF6B00]/10 to-transparent border-l-2 border-l-[#FF6B00]"
                    : "hover:bg-white/5 border-l-2 border-l-transparent"
                }`}
                onClick={() => setActiveFeature(index)}
              >
                {/* Glow effect for active item */}
                {activeFeature === index && (
                  <div className="absolute inset-0 bg-[#FF6B00]/5 blur-xl rounded-xl -z-10"></div>
                )}

                <div className="flex items-start gap-5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      activeFeature === index ? "bg-[#FF6B00]/20" : "bg-white/5"
                    }`}
                  >
                    <div
                      className={`transition-all duration-300 ${
                        activeFeature === index
                          ? "text-[#FF6B00] scale-110"
                          : "text-gray-400 group-hover:text-gray-200"
                      }`}
                    >
                      {renderIcon(feature.icon)}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`text-xl font-bold mb-2 transition-all duration-300 ${
                        activeFeature === index
                          ? "text-[#FF6B00]"
                          : "text-white group-hover:text-[#FF6B00]"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`text-sm transition-all duration-300 ${
                        activeFeature === index
                          ? "text-gray-200"
                          : "text-gray-400 group-hover:text-gray-300"
                      }`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Progress indicator */}
                {activeFeature === index && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 w-full h-full overflow-hidden pointer-events-none"
                  >
                    <div className="absolute bottom-0 left-0 w-full h-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                      ></motion.div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature visual */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="relative aspect-[4/3] w-full">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-gray-800 shadow-[0_0_30px_rgba(255,107,0,0.15)] bg-gradient-to-br from-gray-900 to-black"
            >
              {/* Feature visualization */}
              <div className="relative w-full h-full">
                {features[activeFeature].image ? (
                  <Image
                    src={features[activeFeature].image}
                    alt={features[activeFeature].title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="p-8 rounded-full bg-[#FF6B00]/10">
                      <div className="text-5xl text-[#FF6B00]">
                        {renderIcon(features[activeFeature].icon)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent"></div>

                {/* Feature details overlay */}
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {features[activeFeature].title}
                  </h3>
                  <p className="text-gray-300 max-w-lg">
                    {features[activeFeature].description}
                  </p>

                  {/* Tags */}
                  {features[activeFeature].tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {features[activeFeature].tags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Background decorative elements */}
            <div className="absolute -top-5 -left-5 w-full h-full rounded-2xl border-2 border-[#FF6B00]/20 -z-10"></div>
            <div className="absolute -bottom-5 -right-5 w-full h-full rounded-2xl border-2 border-[#FF6B00]/20 -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
