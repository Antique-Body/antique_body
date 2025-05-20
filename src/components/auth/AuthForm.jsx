"use client";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import countryOptions from "../../app/utils/countryOptions";
import { Button } from "../common/Button";
import { FormField } from "../common/FormField";
import { FacebookIcon, GoogleIcon } from "../common/Icons";
import { useAuth } from "./AuthContext";

export const AuthForm = ({
  onSubmit,
  loading,
  error,
  isLogin = true,
  googleSignIn = true,
}) => {
  const { t } = useTranslation();
  const { isLoading: authLoading } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue,
  } = useForm();

  // Watch the password field
  const password = watch("password");
  const countryCode = watch("countryCode");

  // Update phone value when country code changes
  useEffect(() => {
    if (countryCode) {
      setPhoneValue(countryCode);
    }
  }, [countryCode]);

  const handleGoogleSignIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    signIn("google", { callbackUrl: "/select-role" });
  };

  const handleFacebookSignIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    signIn("facebook", { callbackUrl: "/select-role" });
  };

  const handleSendCode = async () => {
    if (loginMethod === "email") {
      const email = getValues("email");
      if (!email) {
        setCodeError(t("validation.email_required"));
        return;
      }
    } else {
      const phone = getValues("phone");
      if (!phone) {
        setCodeError(t("validation.phone_required"));
        return;
      }
    }

    setCodeError("");
    setSendingCode(true);
    try {
      // Simulate code sending
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCodeSent(true);
    } catch (err) {
      console.error("Error sending code:", err);
      setCodeError(t("auth.login.code_send_error"));
    } finally {
      setSendingCode(false);
    }
  };

  const processSubmit = (data) => {
    if (!isLogin && data.password !== data.confirmPassword) {
      return;
    }

    if (loginMethod === "phone" && !verificationCode) {
      return;
    }

    onSubmit({
      ...data,
      verificationCode: loginMethod === "phone" ? verificationCode : undefined,
    });
  };

  if (!showEmailForm) {
    return (
      <div className="space-y-4 w-full">
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

        <Button
          onClick={() => setShowEmailForm(true)}
          className="w-full bg-gradient-to-r from-[#ff7800] to-[#ff5f00] py-2 rounded font-medium text-white hover:from-[#ff5f00] hover:to-[#ff7800] transition-all duration-300 disabled:opacity-50"
        >
          {isLogin
            ? t("auth.login.continue_with_email_phone")
            : t("auth.register.register_with_email_phone")}
        </Button>

        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full bg-white text-[#1a1a1a] hover:bg-gray-100 hover:scale-[1.02] transition-all duration-200"
          leftIcon={<GoogleIcon />}
        >
          {isLogin
            ? t("auth.login.continue_with_google")
            : t("auth.register.register_with_google")}
        </Button>
        <Button
          onClick={handleFacebookSignIn}
          variant="outline"
          className="w-full bg-white text-[#1a1a1a] hover:bg-gray-100 hover:scale-[1.02] transition-all duration-200"
          leftIcon={<FacebookIcon />}
        >
          {isLogin
            ? t("auth.login.continue_with_facebook")
            : t("auth.register.register_with_facebook")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-6 w-full">
      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center space-x-3">
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

      <div className="flex space-x-3 mb-6">
        <Button
          type="button"
          variant={loginMethod === "email" ? "primary" : "outline"}
          onClick={() => {
            setLoginMethod("email");
            setCodeError("");
            setCodeSent(false);
          }}
          className="flex-1 py-3 text-base font-medium"
        >
          {t("auth.login.use_email")}
        </Button>
        <Button
          type="button"
          variant={loginMethod === "phone" ? "primary" : "outline"}
          onClick={() => {
            setLoginMethod("phone");
            setCodeError("");
            setCodeSent(false);
          }}
          className="flex-1 py-3 text-base font-medium"
        >
          {t("auth.login.use_phone")}
        </Button>
      </div>

      {isLogin ? (
        <>
          {loginMethod === "email" ? (
            <>
              <FormField
                name="email"
                type="email"
                placeholder={t("auth.form.email")}
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
                name="password"
                type="password"
                placeholder={t("auth.form.password")}
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
            </>
          ) : (
            <>
              {/* Phone input with country code select and number */}
              <div className="flex gap-2 mb-2">
                <FormField
                  name="countryCode"
                  type="select"
                  options={countryOptions}
                  register={register}
                  required
                  className="max-w-[140px]"
                  countryCode
                  value={countryCode || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setValue("countryCode", value);
                    setPhoneValue(value);
                  }}
                />
                <FormField
                  name="phone"
                  type="tel"
                  placeholder={t("auth.form.phone") || "61 123 456"}
                  register={register}
                  value={phoneValue}
                  onChange={(e) => {
                    console.log(e, "aloo");
                    setPhoneValue(e.target.value);
                    register("phone").onChange(e);
                  }}
                  rules={{
                    required:
                      t("validation.phone_required") || "Phone required",
                    pattern: {
                      value: /^[0-9]{6,12}$/,
                      message: t("validation.phone_invalid") || "Invalid phone",
                    },
                  }}
                  error={errors.phone?.message}
                  required
                  className="flex-1"
                />
              </div>
              {/* 6-digit code input */}
              <div className="flex space-x-3 items-start">
                <FormField
                  name="code"
                  type="text"
                  placeholder={
                    t("auth.login.code_placeholder") || "Enter 6-digit code"
                  }
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  required
                  className="flex-1 !mb-0"
                  error={codeError}
                />
                <Button
                  type="button"
                  onClick={handleSendCode}
                  loading={sendingCode}
                  disabled={sendingCode || codeSent}
                  className="!mb-0 h-[46px] bg-gradient-to-r from-[#ff7800] to-[#ff5f00] text-white hover:from-[#ff5f00] hover:to-[#ff7800] transition-all duration-300 disabled:opacity-50 rounded-lg font-medium text-sm whitespace-nowrap"
                >
                  {codeSent
                    ? t("auth.login.code_sent")
                    : t("auth.login.send_code")}
                </Button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {/* First Name and Last Name fields */}
          <div className="flex gap-2 mb-2">
            <FormField
              name="firstName"
              type="text"
              placeholder={t("auth.form.first_name")}
              register={register}
              rules={{
                required: t("validation.first_name_required"),
              }}
              error={errors.firstName?.message}
              required
              className="flex-1"
            />
            <FormField
              name="lastName"
              type="text"
              placeholder={t("auth.form.last_name")}
              register={register}
              rules={{
                required: t("validation.last_name_required"),
              }}
              error={errors.lastName?.message}
              required
              className="flex-1"
            />
          </div>
          {loginMethod === "email" ? (
            <>
              <FormField
                name="email"
                type="email"
                placeholder={t("auth.form.email")}
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
                name="password"
                type="password"
                placeholder={t("auth.form.password")}
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
                autoComplete="new-password"
              />
              {/* 6-digit code input */}
              <div className="flex space-x-3 items-start">
                <FormField
                  name="code"
                  type="text"
                  placeholder={
                    t("auth.login.code_placeholder") || "Enter 6-digit code"
                  }
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  required
                  className="flex-1 !mb-0"
                  error={codeError}
                />
                <Button
                  type="button"
                  onClick={handleSendCode}
                  loading={sendingCode}
                  disabled={sendingCode || codeSent}
                  className="!mb-0 h-[46px] bg-gradient-to-r from-[#ff7800] to-[#ff5f00] text-white hover:from-[#ff5f00] hover:to-[#ff7800] transition-all duration-300 disabled:opacity-50 rounded-lg font-medium text-sm whitespace-nowrap"
                >
                  {codeSent
                    ? t("auth.login.code_sent")
                    : t("auth.login.send_code")}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Phone input with country code select and number */}
              <div className="flex gap-2 mb-2">
                <FormField
                  name="countryCode"
                  type="select"
                  options={countryOptions}
                  register={register}
                  required
                  className="max-w-[170px]"
                  countryCode
                  value={countryCode || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setValue("countryCode", value);
                    setPhoneValue(value);
                  }}
                />
                <FormField
                  name="phone"
                  type="tel"
                  placeholder={t("auth.form.phone") || "61 123 456"}
                  register={register}
                  value={phoneValue}
                  onChange={(e) => {
                    console.log(e, "eee");
                    setPhoneValue(e.target.value);
                    register("phone").onChange(e);
                  }}
                  rules={{
                    required:
                      t("validation.phone_required") || "Phone required",
                    pattern: {
                      value: /^[0-9]{6,12}$/,
                      message: t("validation.phone_invalid") || "Invalid phone",
                    },
                  }}
                  error={errors.phone?.message}
                  required
                  className="flex-1"
                />
              </div>
              {/* 6-digit code input */}
              <div className="flex space-x-3 items-start">
                <FormField
                  name="code"
                  type="text"
                  placeholder={
                    t("auth.login.code_placeholder") || "Enter 6-digit code"
                  }
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  required
                  className="flex-1 !mb-0"
                  error={codeError}
                />
                <Button
                  type="button"
                  onClick={handleSendCode}
                  loading={sendingCode}
                  disabled={sendingCode || codeSent}
                  className="!mb-0 h-[46px] bg-gradient-to-r from-[#ff7800] to-[#ff5f00] text-white hover:from-[#ff5f00] hover:to-[#ff7800] transition-all duration-300 disabled:opacity-50 rounded-lg font-medium text-sm whitespace-nowrap"
                >
                  {codeSent
                    ? t("auth.login.code_sent")
                    : t("auth.login.send_code")}
                </Button>
              </div>
            </>
          )}
        </>
      )}

      <Button
        type="submit"
        loading={loading || authLoading}
        className="w-full py-3 bg-gradient-to-r from-[#ff7800] to-[#ff5f00] rounded-lg font-medium text-white hover:from-[#ff5f00] hover:to-[#ff7800] transition-all duration-300 disabled:opacity-50"
      >
        {isLogin ? t("auth.login.sign_in") : t("auth.register.title")}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => setShowEmailForm(false)}
        className="w-full py-3 text-gray-400 hover:text-[#ff7800] transition-colors"
      >
        {t("auth.login.back")}
      </Button>
    </form>
  );
};
