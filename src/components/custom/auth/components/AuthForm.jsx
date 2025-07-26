"use client";
import { Icon } from "@iconify/react";
import { signIn } from "next-auth/react";

import { Button, ErrorMessage, FormField } from "@/components/common";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthForm } from "@/hooks";

import { PhoneInput } from "./PhoneInput";
import { VerificationCodeInput } from "./VerificationCodeInput";

export const AuthForm = ({
  onSubmit,
  loading,
  error,
  isLogin = true,
  verificationCode,
  setVerificationCode,
  codeSent: externalCodeSent,
  sendingCode: externalSendingCode,
  codeError: externalCodeError,
}) => {
  const { isLoading: authLoading } = useAuth();
  const {
    showEmailForm,
    setShowEmailForm,
    loginMethod,
    setLoginMethod,
    phoneValue,
    setPhoneValue,
    codeError,
    setCodeError,
    codeSent,
    setCodeSent,
    sendingCode,
    register,
    errors,
    watch,
    setValue,
    handleSendCode,
    handleFormSubmit,
    getFieldClassName,
    handleFieldChange,
  } = useAuthForm({
    onSubmit,
    externalCodeError,
    externalCodeSent,
    externalSendingCode,
    isLogin,
  });

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

  // Provjera validnosti forme
  const isFormValid = () => {
    if (loginMethod === "email") {
      if (!watch("email") || !watch("password")) return false;
      if (
        !isLogin &&
        (!watch("firstName") || !watch("lastName") || !verificationCode)
      )
        return false;
    } else {
      if (!watch("phone")) return false;
      if (
        !isLogin &&
        (!watch("firstName") || !watch("lastName") || !verificationCode)
      )
        return false;
    }
    // Provjeri ima li errora
    if (Object.keys(errors).length > 0) return false;
    return true;
  };

  if (!showEmailForm) {
    return (
      <div className="space-y-4 w-full">
        <ErrorMessage error={error || codeError} />

        <Button
          onClick={() => setShowEmailForm(true)}
          className="w-full py-3 sm:py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white font-medium rounded-lg hover:from-[#FF5f00] hover:to-[#FF7800] transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm sm:text-base"
        >
          <Icon icon="mdi:email" className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          {isLogin
            ? "Continue with Email or Phone"
            : "Sign up with Email or Phone"}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gradient-to-r from-white/5 to-white/[0.02] text-gray-400 lg:bg-gradient-to-b lg:from-white/5 lg:to-white/[0.02]">
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleGoogleSignIn}
            className="w-full py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base"
            leftIcon={
              <Icon
                icon="flat-color-icons:google"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            }
          >
            {isLogin ? "Continue with Google" : "Sign up with Google"}
          </Button>

          <Button
            onClick={handleFacebookSignIn}
            className="w-full py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base"
            leftIcon={
              <Icon icon="logos:facebook" className="w-4 h-4 sm:w-5 sm:h-5" />
            }
          >
            {isLogin ? "Continue with Facebook" : "Sign up with Facebook"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5 w-full" noValidate>
      <ErrorMessage error={error || codeError} />

      {/* Method Selection Tabs */}
      <div className="flex space-x-2 mb-6 p-1 bg-white/5 rounded-lg">
        <Button
          type="button"
          onClick={() => {
            setLoginMethod("email");
            setCodeError("");
            setCodeSent(false);
          }}
          className={`flex-1 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-md transition-all duration-300 ${
            loginMethod === "email"
              ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white shadow-lg"
              : "bg-transparent text-gray-300 hover:bg-white/10"
          }`}
          leftIcon={<Icon icon="mdi:email" className="w-4 h-4" />}
        >
          Email
        </Button>
        <Button
          type="button"
          onClick={() => {
            setLoginMethod("phone");
            setCodeError("");
            setCodeSent(false);
          }}
          className={`flex-1 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-md transition-all duration-300 ${
            loginMethod === "phone"
              ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white shadow-lg"
              : "bg-transparent text-gray-300 hover:bg-white/10"
          }`}
          leftIcon={<Icon icon="mdi:phone" className="w-4 h-4" />}
        >
          Phone
        </Button>
      </div>

      {/* Name Fields for Registration */}
      {!isLogin && (
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <FormField
            name="firstName"
            type="text"
            placeholder="First Name"
            register={register}
            rules={{ required: "First name is required" }}
            error={errors.firstName?.message}
            required
            className={`flex-1 bg-white/5 border-white/10 focus:border-[#FF6B00]/50 focus:bg-white/10 rounded-lg h-12 sm:h-[50px] ${getFieldClassName(
              "firstName"
            )}`}
            onChange={(e) => handleFieldChange(e, "firstName")}
          />
          <FormField
            name="lastName"
            type="text"
            placeholder="Last Name"
            register={register}
            rules={{ required: "Last name is required" }}
            error={errors.lastName?.message}
            required
            className={`flex-1 bg-white/5 border-white/10 focus:border-[#FF6B00]/50 focus:bg-white/10 rounded-lg h-12 sm:h-[50px] ${getFieldClassName(
              "lastName"
            )}`}
            onChange={(e) => handleFieldChange(e, "lastName")}
          />
        </div>
      )}

      {/* Email or Phone Fields */}
      {loginMethod === "email" ? (
        <div className="space-y-4">
          <FormField
            name="email"
            type="email"
            placeholder="Email Address"
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
            className={`bg-white/5 border-white/10 focus:border-[#FF6B00]/50 focus:bg-white/10 rounded-lg h-12 sm:h-[50px] ${getFieldClassName(
              "email"
            )}`}
            onChange={(e) => handleFieldChange(e, "email")}
          />
          <FormField
            name="password"
            type="password"
            placeholder="Password"
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
            className={`bg-white/5 border-white/10 focus:border-[#FF6B00]/50 focus:bg-white/10 rounded-lg h-12 sm:h-[50px] ${getFieldClassName(
              "password"
            )}`}
            autoComplete={isLogin ? "current-password" : "new-password"}
            onChange={(e) => handleFieldChange(e, "password")}
          />
          {!isLogin && (
            <VerificationCodeInput
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              setCodeError={setCodeError}
              handleSendCode={() => handleSendCode(isLogin)}
              sendingCode={sendingCode}
              codeSent={codeSent}
              setCodeSent={setCodeSent}
              isEmail={true}
              email={watch("email")}
              phone={null}
              setValue={setValue}
            />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <PhoneInput
            register={register}
            errors={errors}
            countryCode={watch("countryCode")}
            setValue={setValue}
            phoneValue={phoneValue}
            setPhoneValue={setPhoneValue}
          />
          <VerificationCodeInput
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            setCodeError={setCodeError}
            handleSendCode={() => handleSendCode(isLogin)}
            sendingCode={sendingCode}
            codeSent={codeSent}
            setCodeSent={setCodeSent}
            isEmail={false}
            email={null}
            phone={watch("phone")}
            setValue={setValue}
          />
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        loading={loading || authLoading}
        disabled={!isFormValid()}
        className="w-full py-3 sm:py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-lg font-medium text-white hover:from-[#FF5f00] hover:to-[#FF7800] transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none text-sm sm:text-base mt-6"
      >
        {isLogin ? "Sign In" : "Create Account"}
      </Button>

      {/* Back Button */}
      <Button
        type="button"
        onClick={() => setShowEmailForm(false)}
        className="w-full py-2.5 sm:py-3 text-gray-400 hover:text-white transition-colors bg-transparent border-0 text-sm sm:text-base"
      >
        <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
        Back to options
      </Button>
    </form>
  );
};
