import { motion } from "framer-motion";

export const ContactInfoCard = ({ title, content, subContent, icon, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-6 hover:border-[#FF6B00]/30 transition-all duration-300"
        >
            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-gradient-to-br from-[#FF6B00]/5 to-transparent blur-xl"></div>

            <div className="mb-4 p-3 w-14 h-14 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center group-hover:bg-[#FF6B00]/20 transition-colors duration-300">
                {icon}
            </div>

            <h3 className="text-xl font-semibold mb-2 group-hover:text-[#FF6B00] transition-colors duration-300">{title}</h3>
            <p className="text-gray-300">{content}</p>
            {subContent && <p className="text-gray-400 text-sm mt-1">{subContent}</p>}
        </motion.div>
    );
};
