import { motion } from "framer-motion";
import { useRef, useState } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";

export function ContactForm() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-br from-[#FF6B00]/30 to-transparent blur-xl"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-[#FF9A00]/30 to-transparent blur-xl"></div>

      <div className="backdrop-blur-sm bg-black/40 border border-gray-800 p-8 rounded-xl relative z-10">
        <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
        <form className="space-y-6" ref={formRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              type="text"
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              backgroundStyle="transparent"
            />
            <FormField
              type="text"
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              backgroundStyle="transparent"
            />
          </div>
          <FormField
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            backgroundStyle="transparent"
          />
          <FormField
            type="text"
            name="subject"
            label="Subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="How can we help?"
            backgroundStyle="transparent"
          />
          <FormField
            type="textarea"
            name="message"
            label="Message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message here..."
            backgroundStyle="transparent"
            rows={6}
          />
          <Button
            variant="orangeFilled"
            size="large"
            className="w-full group relative overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full opacity-10"></span>
            <span className="relative z-10">Send Message</span>
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
