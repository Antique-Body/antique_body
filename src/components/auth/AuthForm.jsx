"use client";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { GoogleIcon } from "../common/Icons";

import { useAuth } from "./AuthContext";

import { Button, FormField } from "@/components/common/index";

export const AuthForm = ({ onSubmit, loading, error, isLogin = true, googleSignIn = true }) => {
    const { t } = useTranslation();
    const { isLoading: authLoading } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    // Watch the password field
    const password = watch("password");

    const handleGoogleSignIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        signIn("google", { callbackUrl: "/select-role" });
    };

    const processSubmit = (data) => {
        // For registration, check if passwords match
        if (!isLogin && data.password !== data.confirmPassword) {
            return; // Form validation should catch this
        }
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 w-full">
            {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-md flex items-center space-x-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-red-400 text-sm">{error}</span>
                </div>
            )}

            {!isLogin && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                        id="name"
                        name="name"
                        label={t("auth.form.first_name")}
                        register={register}
                        rules={{ required: t("validation.first_name_required") }}
                        error={errors.name?.message}
                        required
                    />

                    <FormField
                        id="lastName"
                        name="lastName"
                        label={t("auth.form.last_name")}
                        register={register}
                        rules={{ required: t("validation.last_name_required") }}
                        error={errors.lastName?.message}
                        required
                    />
                </div>
            )}

            <FormField
                id="email"
                name="email"
                type="email"
                label={t("auth.form.email")}
                register={register}
                rules={{
                    required: t("validation.email_required"),
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t("validation.email_invalid"),
                    },
                }}
                error={errors.email?.message}
                required
            />

            <FormField
                id="password"
                name="password"
                type="password"
                label={t("auth.form.password")}
                register={register}
                rules={{
                    required: t("validation.password_required"),
                    minLength: {
                        value: 6,
                        message: t("validation.password_min_length"),
                    },
                }}
                error={errors.password?.message}
                required
                autoComplete="current-password"
            />

            {!isLogin && (
                <FormField
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label={t("auth.form.confirm_password")}
                    register={register}
                    rules={{
                        required: t("validation.confirm_password_required"),
                        validate: (value) => value === password || t("validation.passwords_do_not_match"),
                    }}
                    error={errors.confirmPassword?.message}
                    required
                    autoComplete="new-password"
                />
            )}

            <Button
                type="submit"
                loading={loading || authLoading}
                className="w-full bg-gradient-to-r from-[#ff7800] to-[#ff5f00] py-2 rounded font-medium text-white hover:from-[#ff5f00] hover:to-[#ff7800] transition-all duration-300 disabled:opacity-50"
            >
                {isLogin ? t("auth.login.sign_in") : t("auth.register.title")}
            </Button>

            {googleSignIn && (
                <div className="mt-2">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#333]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#1a1a1a] text-gray-400">{t("auth.login.or_continue_with")}</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleGoogleSignIn}
                        variant="outline"
                        className="mt-6 w-full bg-white text-[#1a1a1a] hover:bg-gray-100 hover:scale-[1.02] transition-all duration-200"
                        leftIcon={<GoogleIcon />}
                    >
                        {t("auth.login.sign_in_with_google")}
                    </Button>
                </div>
            )}
        </form>
    );
};
