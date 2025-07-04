"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/common/Button";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthPage, setIsAuthPage] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if current path is login or register
    const authPageCheck =
      pathname?.includes("/auth/login") || pathname?.includes("/auth/register");
    setIsAuthPage(authPageCheck);

    // Set authentication state
    setIsAuthenticated(status === "authenticated");
    setIsLoading(status === "loading");

    // Add a small delay before showing the content for smooth animation
    if (!isLoading && !isAuthPage) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, status, isLoading, isAuthPage]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  // Don't render navigation elements on login or register pages
  if (isAuthPage) {
    return null;
  }

  // Don't render anything while loading
  if (isLoading) {
    return null;
  }

  // DEBUG: Ispis session i status

  return (
    <nav className="fixed top-0 right-0 z-50 p-4 flex justify-end">
      <div
        className={`transition-all duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-white text-sm">
              Welcome, {session?.user?.name}
            </span>
            <Button
              variant="primary"
              onClick={handleLogout}
              className="px-4 py-2 rounded"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="bg-gradient-to-r from-[#ff7800] to-[#ff5f00] px-4 py-2 rounded text-white hover:from-[#ff5f00] hover:to-[#ff7800] transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};
