"use client";
import React from "react";
import { AntiqueBodyLogo } from "@/components/custom/BrandLogo";

export const Footer = () => {
    return (
        <footer className="mt-12 py-6 border-t border-[#222] text-center text-gray-400">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-center items-center gap-3 mb-4">
                    <AntiqueBodyLogo size="sm" />
                </div>
                <p className="text-sm">© 2025 AnticBody. All rights reserved.</p>
                <div className="flex justify-center mt-4 space-x-4">
                    <a href="#" className="text-gray-400 hover:text-[#FF6B00] transition-colors">
                        Terms
                    </a>
                    <a href="#" className="text-gray-400 hover:text-[#FF6B00] transition-colors">
                        Privacy
                    </a>
                    <a href="#" className="text-gray-400 hover:text-[#FF6B00] transition-colors">
                        Help
                    </a>
                </div>
            </div>
        </footer>
    );
};
