"use client";

import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

import I18nProvider from "../components/custom/shared/I18nProvider";

// import RootErrorBoundary from "@/components/RootErrorBoundary";
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
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocationResolved(true);
      });
    } else {
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
              <UserLocationProvider>
                {/* <RootErrorBoundary> */}
                {/* <div className="fixed top-4 left-4 z-50">
                    <LanguageSelector />
                  </div> */}
                {children}
                {/* </RootErrorBoundary> */}
              </UserLocationProvider>
            </AuthProvider>
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
