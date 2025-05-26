"use client";
import React from "react";

import { BrandLogo } from "@/components/custom/BrandLogo";

export const Footer = () => (
    <footer className="mt-12 border-t border-[#222] py-6 text-center text-gray-400">
        <div className="mx-auto max-w-4xl px-4">
            <div className="mb-4 flex items-center justify-center gap-3">
                <BrandLogo size="sm" />
            </div>
            <p className="text-sm">© 2025 AnticBody. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-4">
                <a href="#" className="text-gray-400 transition-colors hover:text-[#FF6B00]">
                    Terms
                </a>
                <a href="#" className="text-gray-400 transition-colors hover:text-[#FF6B00]">
                    Privacy
                </a>
                <a href="#" className="text-gray-400 transition-colors hover:text-[#FF6B00]">
                    Help
                </a>
            </div>
        </div>
    </footer>
);