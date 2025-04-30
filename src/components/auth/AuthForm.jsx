"use client";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { Button } from "../common/Button";
import { GoogleIcon } from "../common/Icons";
import { TextField } from "../common/TextField";

import { useAuth } from "./AuthContext";

export const AuthForm = ({ onSubmit, loading, error, isLogin = true, googleSignIn = true }) => {
  const { isLoading: authLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleGoogleSignIn = e => {
    e.preventDefault();
    e.stopPropagation();
    signIn("google", { callbackUrl: "/select-role" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      {error && <div className="mb-4 text-center text-sm text-red-500">{error}</div>}

      {!isLogin && (
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            id="name"
            name="name"
            label="First Name"
            register={register}
            rules={{ required: "First name is required" }}
            error={errors.name}
            required
          />

          <TextField id="lastName" name="lastName" label="Last Name" register={register} error={errors.lastName} />
        </div>
      )}

      <TextField
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
        error={errors.email}
        required
      />

      <TextField
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
        error={errors.password}
        required
        autoComplete="current-password"
      />

      {!isLogin && (
        <TextField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          register={register}
          rules={{ required: "Please confirm your password" }}
          error={errors.confirmPassword}
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
        <div className="mt-6">
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
