"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  return (
    <nav className="fixed top-0 right-0 z-50 p-4 flex justify-end w-full">
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <span className="text-white text-sm">
            Welcome, {session?.user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-[#ff7800] to-[#ff5f00] px-4 py-2 rounded text-white hover:from-[#ff5f00] hover:to-[#ff7800] transition-all duration-300"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          href="/auth/login"
          className="bg-gradient-to-r from-[#ff7800] to-[#ff5f00] px-4 py-2 rounded text-white hover:from-[#ff5f00] hover:to-[#ff7800] transition-all duration-300"
        >
          Login
        </Link>
      )}
    </nav>
  );
}
