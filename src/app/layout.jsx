"use client";

import { ThemeModeToggle } from "@/components/custom/ThemeModeToggle";
import { ThemeSelector } from "@/components/custom/ThemeSelector";
import LanguageSelector from "@/components/LanguageSelector";
import { AuthProvider } from "@/contexts/AuthContext";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import I18nProvider from "../components/I18nProvider";
import "./globals.css";
import { ThemeProvider } from "./utils/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <I18nProvider>
            <AuthProvider>
              <ThemeProvider>
                <div className="fixed top-4 left-4 z-[9999] flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <LanguageSelector />
                    <ThemeModeToggle />
                  </div>
                  <ThemeSelector />
                </div>
                <main className="relative">{children}</main>
              </ThemeProvider>
            </AuthProvider>
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
