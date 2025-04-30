"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

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
    <main className="relative flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
      <Background parthenon={true} runner={true} discus={true} colosseum={true} />

      <div className="relative z-10 w-[90%] max-w-[420px] translate-y-5 animate-[0.8s_ease_forwards_fadeIn,1s_ease_forwards_floatUp] overflow-hidden rounded-[15px] border border-[#222] bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] p-[40px_30px] opacity-0 shadow-[0_15px_25px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]">
        {/* Marble effect */}
        <div className="absolute left-0 top-0 h-[5px] w-full animate-[2s_linear_infinite_shimmer] bg-gradient-to-r from-[#ff7800] via-[#ffa500] to-[#ff7800] bg-[length:200%_100%]"></div>

        <div className="text-center">
          <h1 className="spartacus-font mb-4 text-[28px] font-bold tracking-[2px]">LOGGING OUT</h1>
          <p className="text-gray-400">You are being securely logged out...</p>
        </div>
      </div>
    </main>
  );
}
