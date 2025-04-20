"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Background from "@/components/background";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      await signOut({ redirect: false });
      router.push("/auth/login");
    };

    performLogout();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center relative bg-[#0a0a0a] text-white">
      <Background
        parthenon={true}
        runner={true}
        discus={true}
        colosseum={true}
      />

      <div className="w-[90%] max-w-[420px] p-[40px_30px] bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-[15px] shadow-[0_15px_25px_rgba(0,0,0,0.6)] relative z-10 backdrop-blur-sm border border-[#222] overflow-hidden opacity-0 translate-y-5 animate-[0.8s_ease_forwards_fadeIn,1s_ease_forwards_floatUp]">
        {/* Marble effect */}
        <div className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r from-[#ff7800] via-[#ffa500] to-[#ff7800] bg-[length:200%_100%] animate-[2s_linear_infinite_shimmer]"></div>

        <div className="text-center">
          <h1 className="text-[28px] font-bold tracking-[2px] spartacus-font mb-4">
            LOGGING OUT
          </h1>
          <p className="text-gray-400">You are being securely logged out...</p>
        </div>
      </div>
    </main>
  );
}
