import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/common/Button";

export const ModernCta = () => (
  <div className="w-full overflow-hidden">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative rounded-3xl overflow-hidden"
    >
      {/* Main Content */}
      <div className="relative z-10 px-8 py-20 md:px-16 md:py-24 lg:py-28 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              Start your <span className="text-[#FF6B00]">transformation</span>{" "}
              today
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
            >
              Join thousands who have already discovered their ancient strength
              through our platform. The perfect blend of time-tested methods and
              modern science.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link href="/auth/register">
                <Button
                  variant="orangeFilled"
                  size="large"
                  className="w-full sm:w-auto px-8 py-4 text-lg group relative overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full opacity-10"></span>
                  <span className="relative z-10">Try Free for 7 Days</span>
                </Button>
              </Link>

              <div className="relative group">
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="large"
                    className="w-full sm:w-auto px-8 py-4 text-lg group-hover:border-[#FF6B00]/50 transition-colors"
                  >
                    Learn more
                  </Button>
                </Link>

                {/* Hover animation */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-500 group-hover:duration-200"></div>
              </div>
            </motion.div>
          </div>

          {/* Decorative stats row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {[
              { value: "5,000+", label: "Active Members" },
              { value: "300+", label: "Certified Trainers" },
              { value: "98%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-6 rounded-xl backdrop-blur-sm border border-gray-800/50 bg-gradient-to-br from-white/5 to-transparent"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black -z-20"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Glass panel effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/5 to-black/10 backdrop-blur-3xl"></div>

        {/* Animated gradient circles */}
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.4, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#FF6B00]/20 to-transparent blur-[60px]"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.2, 0.3],
            scale: [1, 0.98, 1],
          }}
          transition={{
            duration: 7,
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#FF9A00]/20 to-transparent blur-[70px]"
        ></motion.div>

        {/* Grid pattern */}
      </div>
    </motion.div>
  </div>
);
