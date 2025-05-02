"use client";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { Button } from "../common/Button";
import { GoogleIcon } from "../common/Icons";
import { FormField } from "../shared/FormField";

import { useAuth } from "./AuthContext";

export const AuthForm = ({ onSubmit, loading, error, isLogin = true, googleSignIn = true }) => {
  const { isLoading: authLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Watch the password field
  const password = watch("password");

  const handleGoogleSignIn = e => {
    e.preventDefault();
    e.stopPropagation();
    signIn("google", { callbackUrl: "/select-role" });
  };

  const processSubmit = data => {
    // For registration, check if passwords match
    if (!isLogin && data.password !== data.confirmPassword) {
      return; // Form validation should catch this
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="w-full space-y-4">
      {error && (
        <div className="mb-4 flex items-center space-x-2 rounded-md border border-red-500/50 bg-red-900/20 p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 flex-shrink-0 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}

      {!isLogin && (
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            id="name"
            name="name"
            label="First Name"
            register={register}
            rules={{ required: "First name is required" }}
            error={errors.name?.message}
            required
          />

          <FormField
            id="lastName"
            name="lastName"
            label="Last Name"
            register={register}
            rules={{ required: "Last name is required" }}
            error={errors.lastName?.message}
            required
          />
        </div>
      )}

      <FormField
        id="email"
        name="email"
        type="email"
        label="Email"
        register={register}
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        }}
        error={errors.email?.message}
        required
      />

      <FormField
        id="password"
        name="password"
        type="password"
        label="Password"
        register={register}
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
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
          label="Confirm Password"
          register={register}
          rules={{
            required: "Please confirm your password",
            validate: value => value === password || "Passwords do not match",
          }}
          error={errors.confirmPassword?.message}
          required
          autoComplete="new-password"
        />
      )}

      <Button
        type="submit"
        loading={loading || authLoading}
        className="w-full rounded bg-gradient-to-r from-[#ff7800] to-[#ff5f00] py-2 font-medium text-white transition-all duration-300 hover:from-[#ff5f00] hover:to-[#ff7800] disabled:opacity-50"
      >
        {isLogin ? "SIGN IN" : "REGISTER"}
      </Button>

      {googleSignIn && (
        <div className="mt-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#333]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#1a1a1a] px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="mt-6 w-full bg-white text-[#1a1a1a] transition-all duration-200 hover:scale-[1.02] hover:bg-gray-100"
            leftIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>
        </div>
      )}
    </form>
  );
};
