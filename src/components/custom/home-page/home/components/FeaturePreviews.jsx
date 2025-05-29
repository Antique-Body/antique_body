import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/common/Button";

export const FeaturePreviews = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  // Feature data
  const features = [
    {
      id: "food-scanner",
      title: "Food Scanner & Analysis",
      description:
        "Analyze your meals instantly with AI-powered food recognition. Get detailed nutritional insights and track your diet effortlessly.",
      icon: "mdi:food-apple",
      color: "from-[#FF6B00] to-[#FF9A00]",
      image:
        "https://images.unsplash.com/photo-1512054502232-10a0a035d672?q=80&w=1200&auto=format&fit=crop",
      stats: [
        { label: "Recognition accuracy", value: "97%" },
        { label: "Food database", value: "100,000+" },
      ],
      highlights: [
        "Real-time nutritional analysis",
        "Personalized dietary recommendations",
        "Seamless meal logging",
      ],
    },
    {
      id: "progress-tracking",
      title: "Progress Tracking",
      description:
        "Visualize your journey with comprehensive analytics. Monitor your improvements, set goals, and celebrate achievements.",
      icon: "mdi:chart-line",
      color: "from-[#3b82f6] to-[#60a5fa]",
      image:
        "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=1200&auto=format&fit=crop",
      stats: [
        { label: "Data points tracked", value: "42" },
        { label: "Average improvement", value: "+23%" },
      ],
      highlights: [
        "Body composition analysis",
        "Performance metrics dashboard",
        "Goal achievement tracking",
      ],
    },
    {
      id: "trainer-dashboard",
      title: "Trainer Dashboard",
      description:
        "Powerful tools for fitness professionals. Manage clients, create custom plans, and deliver exceptional training experiences.",
      icon: "mdi:account-group",
      color: "from-[#22c55e] to-[#4ade80]",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
      stats: [
        { label: "Client capacity", value: "Unlimited" },
        { label: "Workout templates", value: "500+" },
      ],
      highlights: [
        "Client progress monitoring",
        "Automated program delivery",
        "Integrated messaging system",
      ],
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#FF6B00]/5 to-transparent blur-[120px] opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#3b82f6]/5 blur-[100px] opacity-30"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-[#FF6B00] bg-[#FF6B00]/10 rounded-full">
            Platform Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            Unlock Your{" "}
            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
              Full Potential
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools you need to
            transform your fitness journey.
          </p>
        </motion.div>

        {/* Feature Navigation */}
        <div className="mb-16">
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <Button
                key={feature.id}
                variant={activeFeature === index ? "orangeFilled" : "ghost"}
                onClick={() => setActiveFeature(index)}
                className={`relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300`}
                leftIcon={<Icon icon={feature.icon} />}
              >
                {feature.title}
              </Button>
            ))}
          </motion.div>
        </div>

        {/* Feature Content */}
        <motion.div
          key={`feature-content-${activeFeature}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Feature Visual */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative group">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="relative rounded-2xl overflow-hidden aspect-[16/9]"
                >
                  <Image
                    src={features[activeFeature].image}
                    alt={features[activeFeature].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/50 to-black/20"></div>

                  {/* Interactive overlay elements */}
                  <div className="absolute inset-0 p-10 flex flex-col justify-end">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <div className="mb-6">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${features[activeFeature].color} flex items-center justify-center mb-4`}
                        >
                          <Icon
                            icon={features[activeFeature].icon}
                            className="text-3xl text-white"
                          />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">
                          {features[activeFeature].title}
                        </h3>
                        <p className="text-gray-300 text-lg max-w-lg">
                          {features[activeFeature].description}
                        </p>
                      </div>

                      <div className="flex gap-4">
                        {features[activeFeature].stats.map((stat, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.4 + idx * 0.1,
                            }}
                            className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10"
                          >
                            <p className="text-sm text-gray-400 mb-1">
                              {stat.label}
                            </p>
                            <p
                              className={`text-xl font-bold bg-gradient-to-r ${features[activeFeature].color} bg-clip-text text-transparent`}
                            >
                              {stat.value}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Decorative elements */}
                <div
                  className={`absolute -bottom-4 -right-4 w-full h-full rounded-2xl border-2 border-dashed ${
                    activeFeature === 0
                      ? "border-[#FF6B00]/30"
                      : activeFeature === 1
                      ? "border-[#3b82f6]/30"
                      : "border-[#22c55e]/30"
                  } -z-10`}
                ></div>
              </div>
            </div>

            {/* Feature Details */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Feature highlights */}
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4">
                    Key Benefits
                  </h4>
                  <ul className="space-y-4">
                    {features[activeFeature].highlights.map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${features[activeFeature].color} flex items-center justify-center mt-0.5`}
                        >
                          <Icon
                            icon="mdi:check"
                            className="text-sm text-white"
                          />
                        </div>
                        <div>
                          <p className="text-white">{item}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Interactive demo section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className={`p-6 rounded-xl bg-gradient-to-br ${
                    activeFeature === 0
                      ? "from-[#FF6B00]/10 to-black/20"
                      : activeFeature === 1
                      ? "from-[#3b82f6]/10 to-black/20"
                      : "from-[#22c55e]/10 to-black/20"
                  } border ${
                    activeFeature === 0
                      ? "border-[#FF6B00]/20"
                      : activeFeature === 1
                      ? "border-[#3b82f6]/20"
                      : "border-[#22c55e]/20"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${features[activeFeature].color} flex items-center justify-center`}
                    >
                      <Icon icon="mdi:play" className="text-white" />
                    </div>
                    <h4 className="font-medium text-white">See it in action</h4>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Experience how this feature can transform your fitness
                    journey. Try it today and see the difference.
                  </p>
                  <Link href={`/features/${features[activeFeature].id}`}>
                    <Button
                      className={`w-full py-3 bg-gradient-to-r ${features[activeFeature].color} text-white rounded-lg hover:shadow-lg transition-all group`}
                      rightIcon={
                        <Icon
                          icon="mdi:arrow-right"
                          className="group-hover:translate-x-1 inline-block transition-transform"
                        />
                      }
                    >
                      Explore Feature
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          className="mt-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h3 className="text-2xl font-bold text-center mb-12">
            More Powerful Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "mdi:calendar-check",
                title: "Smart Scheduling",
                description:
                  "AI-powered workout planning that adapts to your availability and recovery needs.",
                color: "from-[#f97316] to-[#fb923c]",
              },
              {
                icon: "mdi:account-group",
                title: "Community Challenges",
                description:
                  "Join group challenges and competitions to stay motivated and connect with others.",
                color: "from-[#8b5cf6] to-[#a78bfa]",
              },
              {
                icon: "mdi:message-text",
                title: "Coach Communication",
                description:
                  "Direct messaging with trainers for personalized guidance and feedback.",
                color: "from-[#ec4899] to-[#f472b6]",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
                className="relative p-6 rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm group"
              >
                <div className="mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                  >
                    <Icon icon={feature.icon} className="text-xl text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                <div className="mt-auto">
                  <Link
                    href={`/features`}
                    className="inline-flex items-center text-sm font-medium"
                  >
                    <span
                      className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:underline`}
                    >
                      Learn more
                    </span>
                    <Icon
                      icon="mdi:arrow-right"
                      className="ml-1 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:translate-x-1 transition-transform inline-block"
                    ></Icon>
                  </Link>
                </div>

                {/* Hover effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${feature.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}
                ></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <Link href="/features">
            <Button
              variant="orangeFilled"
              size="large"
              className="group px-8 py-4"
              rightIcon={
                <Icon
                  icon="mdi:arrow-right"
                  className="relative z-10 group-hover:translate-x-1 transition-transform"
                />
              }
            >
              <span className="relative z-10">Explore All Features</span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
