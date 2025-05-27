"use client";

import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import I18nProvider from "../components/I18nProvider";

import RootErrorBoundary from "@/components/RootErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <I18nProvider>
            <AuthProvider>
              <RootErrorBoundary>
                {/* <div className="fixed top-4 left-4 z-50">
                  <LanguageSelector />
                </div> */}
                {children}
              </RootErrorBoundary>
            </AuthProvider>
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
