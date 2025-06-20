"use client";

import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

import I18nProvider from "../components/custom/shared/I18nProvider";

import { AuthProvider } from "@/contexts/AuthContext";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// UserLocation context and provider
const UserLocationContext = createContext({
  userLocation: null,
  locationResolved: false,
});

export function useUserLocation() {
  return useContext(UserLocationContext);
}

function UserLocationProvider({ children }) {
  const [userLocation, setUserLocation] = useState(null);
  const [locationResolved, setLocationResolved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      console.log("🌍 Attempting to get user location...");

      const fallbackTimeout = setTimeout(() => {
        console.warn("⚠️ Location request timed out. Proceeding without it.");
        setLocationResolved(true);
      }, 5000); // Fallback if no response in 5s

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("✅ User location obtained:", position.coords);
          clearTimeout(fallbackTimeout);
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationResolved(true);
        },
        (err) => {
          console.error("❌ Error getting user location:", err.message);
          clearTimeout(fallbackTimeout);
          setUserLocation(null);
          setLocationResolved(true);
        }
      );
    } else {
      console.warn("🚫 Geolocation not supported or window undefined.");
      setLocationResolved(true);
    }
  }, []);

  return (
    <UserLocationContext.Provider value={{ userLocation, locationResolved }}>
      {children}
    </UserLocationContext.Provider>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <I18nProvider>
            <AuthProvider>
              <UserLocationProvider>{children}</UserLocationProvider>
            </AuthProvider>
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
