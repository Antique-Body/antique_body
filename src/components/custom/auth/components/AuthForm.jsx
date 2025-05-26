"use client";
import {
  Button,
  FacebookIcon,
  FormField,
  GoogleIcon,
} from "@/components/common";
import { ErrorMessage } from "@/components/custom/ErrorMessage";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthForm } from "@/hooks";
import { Icon } from "@iconify/react";
import { signIn } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { PhoneInput } from "./PhoneInput";
import { VerificationCodeInput } from "./VerificationCodeInput";

export const AuthForm = ({
  onSubmit,
  loading,
  error,
  isLogin = true,
  googleSignIn = true,
  onSendCode,
  verificationCode,
  setVerificationCode,
  codeSent: externalCodeSent,
  sendingCode: externalSendingCode,
  codeError: externalCodeError,
  phoneOnly = true,
}) => {
  const { isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
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
    setSendingCode,
    register,
    handleSubmit,
    errors,
    getValues,
    watch,
    setValue,
    setError,
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

  if (!showEmailForm) {
    return (
      <div className="space-y-4 w-full">
        <ErrorMessage error={error || codeError} />
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
    <form onSubmit={handleFormSubmit} className="space-y-6 w-full" noValidate>
      <ErrorMessage error={error || codeError} />

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
          leftIcon={<Icon icon="mdi:email" className="w-5 h-5" />}
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
          leftIcon={<Icon icon="mdi:phone" className="w-5 h-5" />}
        >
          {t("auth.login.use_phone")}
        </Button>
      </div>

      {!isLogin && (
        <div className="flex gap-2 mb-2">
          <FormField
            name="firstName"
            type="text"
            placeholder="First Name"
            register={register}
            rules={{ required: "First name is required" }}
            error={errors.firstName?.message}
            required
            className={`flex-1 ${getFieldClassName("firstName")}`}
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
            className={`flex-1 ${getFieldClassName("lastName")}`}
            onChange={(e) => handleFieldChange(e, "lastName")}
          />
        </div>
      )}

      {loginMethod === "email" ? (
        <>
          <FormField
            name="email"
            type="email"
            placeholder="Email"
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
            className={getFieldClassName("email")}
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
            className={getFieldClassName("password")}
            autoComplete={isLogin ? "current-password" : "new-password"}
            onChange={(e) => handleFieldChange(e, "password")}
          />
          {!isLogin && (
            <VerificationCodeInput
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              setCodeError={setCodeError}
              handleSendCode={handleSendCode}
              sendingCode={sendingCode}
              codeSent={codeSent}
              setCodeSent={setCodeSent}
              isEmail={true}
              email={getValues("email")}
              phone={null}
              setValue={setValue}
            />
          )}
        </>
      ) : (
        <>
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
            handleSendCode={handleSendCode}
            sendingCode={sendingCode}
            codeSent={codeSent}
            setCodeSent={setCodeSent}
            isEmail={false}
            email={null}
            phone={getValues("phone")}
            setValue={setValue}
          />
        </>
      )}

      <Button
        type="submit"
        loading={loading || authLoading}
        className="w-full py-3 bg-gradient-to-r from-[#ff7800] to-[#ff5f00] rounded-lg font-medium text-white hover:from-[#ff5f00] hover:to-[#ff7800] transition-all duration-300 disabled:opacity-50"
      >
        {isLogin ? "Sign In" : "Register"}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => setShowEmailForm(false)}
        className="w-full py-3 text-gray-400 hover:text-[#ff7800] transition-colors"
      >
        Back
      </Button>
    </form>
  );
};
