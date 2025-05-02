'use client';

import LanguageSelector from "@/components/LanguageSelector";
import { SessionProvider } from 'next-auth/react';
import { Inter } from "next/font/google";
import I18nProvider from '../components/I18nProvider';
import AuthProvider from '../components/auth/AuthProvider';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <I18nProvider>
            <AuthProvider>
              <div className="fixed top-4 left-4 z-50">
                <LanguageSelector />
              </div>
              {children}
            </AuthProvider>
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
} 