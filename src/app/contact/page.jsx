"use client";

import { LazyMotion, domAnimation } from "framer-motion";

import { EffectBackground } from "@/components/background";
import { Footer } from "@/components/common/Footer";
import { ContactHero, FAQSection, MapSection, CTASection } from "@/components/custom/home-page/contact/components";
import { Navigation } from "@/components/custom/home-page/shared";
export default function ContactPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
        {/* Main background with light effects */}
        <EffectBackground />

        <Navigation />

        {/* Hero Section */}
        <ContactHero />

        {/* FAQ Section */}
        <FAQSection />

        {/* Map Section */}
        <MapSection />

        {/* CTA Section */}
        <CTASection />

        <Footer />
      </div>
    </LazyMotion>
  );
}
