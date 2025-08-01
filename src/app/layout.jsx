"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

import { I18nProvider } from "@/components/custom/shared";
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
      const fallbackTimeout = setTimeout(() => {
        console.warn("⚠️ Location request timed out. Proceeding without it.");
        setLocationResolved(true);
      }, 5000); // Fallback if no response in 5s

      navigator.geolocation.getCurrentPosition((position) => {
        clearTimeout(fallbackTimeout);
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocationResolved(true);
      });
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
              <Tooltip.Provider>
                <UserLocationProvider>{children}</UserLocationProvider>
              </Tooltip.Provider>
            </AuthProvider>
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
