"use client";
import { Navbar } from "@/components";
import LanguageSelector from '@/components/LanguageSelector';
import Background from "@/components/background";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white relative">
      <Navbar />
      <div className="absolute top-4 left-4 z-50">
        <LanguageSelector />
      </div>
      <Background
        parthenon={true}
        runner={true}
        discus={true}
        colosseum={true}
        column={false}
        vase={false}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-5 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 spartacus-font" >
          {t('welcome_message')} <span className="text-[#ff7800]">{t('brand_name')}</span>
        </h1>

        <div className="text-xl mb-8 text-gray-300" >
          {t('home_subtitle')}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
            <h3 className="text-xl font-semibold mb-3 text-[#ff7800]" >
              {t('personalized_training_title')}
            </h3>
            <p className="text-gray-300" >
              {t('personalized_training_description')}
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
            <h3 className="text-xl font-semibold mb-3 text-[#ff7800]" >
              {t('expert_guidance_title')}
            </h3>
            <p className="text-gray-300" >
              {t('expert_guidance_description')}
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
            <h3 className="text-xl font-semibold mb-3 text-[#ff7800]" >
              {t('ancient_wisdom_title')}
            </h3>
            <p className="text-gray-300" >
              {t('ancient_wisdom_description')}
            </p>
          </div>
        </div>

        <div className="space-x-4 w-full">
          <a
            href="/auth/register"
            className="bg-gradient-to-r from-[#ff7800] to-[#ff5f00] px-8 py-3 rounded font-medium text-white hover:from-[#ff5f00] hover:to-[#ff7800] transition-all duration-300">
            {t('get_started')}
          </a>
          <a
            href="/auth/login"
            className="border border-[#ff7800] px-8 py-3 rounded font-medium text-white hover:bg-[#ff7800] transition-all duration-300">
            {t('learn_more')}
          </a>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
