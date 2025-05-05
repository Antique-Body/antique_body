"use client";

import { Footer } from "@/components/common/Footer";
import { Navigation, HeroSection, ContactSection, FAQSection, CallToAction } from "@/components/custom/contact/components";

export default function ContactPage() {
    return (
        <div className="bg-black min-h-screen text-white">
            <Navigation />
            <HeroSection />
            <ContactSection />
            <FAQSection />
            <CallToAction />
            <Footer />
        </div>
    );
}
