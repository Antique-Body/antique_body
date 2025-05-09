"use client";

import "@mdi/font/css/materialdesignicons.css";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";

import AuthProvider from "../components/auth/AuthProvider";
import I18nProvider from "../components/I18nProvider";

import LanguageSelector from "@/components/LanguageSelector";
import "./globals.css";
import { EffectBackground } from "@/components/background";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css" />
            </head>
            <body className={inter.className}>
                <SessionProvider>
                    <I18nProvider>
                        <AuthProvider>
                            <div className="fixed top-4 left-4 z-50">
                                <LanguageSelector />
                            </div>
                            {/* <EffectBackground /> */}
                            {children}
                        </AuthProvider>
                    </I18nProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
