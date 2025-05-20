"use client";
import {
  Button,
  FacebookIcon,
  FormField,
  GoogleIcon,
} from "@/components/common";
import { ErrorMessage } from "@/components/custom/ErrorMessage";
import { useAuth } from "@/contexts/AuthContext";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  sendingCode,
  codeError: externalCodeError,
}) => {
  const { t } = useTranslation();
  const { isLoading: authLoading } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");
  const [phoneValue, setPhoneValue] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue,
    setError,
  } = useForm();

  useEffect(() => {
    if (externalCodeError) setCodeError(externalCodeError);
  }, [externalCodeError]);

  useEffect(() => {
    if (externalCodeSent) setCodeSent(externalCodeSent);
  }, [externalCodeSent]);

  const password = watch("password");
  const countryCode = watch("countryCode");

  useEffect(() => {
    if (countryCode) setPhoneValue(countryCode);
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
    const email = getValues("email");
    onSendCode(email);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = getValues();

    if (!isLogin) {
      if (!verificationCode) {
        setError("Verification code is required");
        setCodeError("Verification code is required");
        return;
      }

      if (verificationCode.length !== 6) {
        setError("Verification code must be 6 digits");
        setCodeError("Verification code must be 6 digits");
        return;
      }

      onSubmit({ ...formData, code: verificationCode });
    } else {
      onSubmit(formData);
    }
  };

  const getFieldClassName = (fieldName) =>
    errors[fieldName]?.message ? "border-red-500" : "";

  const handleFieldChange = (e, fieldName) => {
    if (errors[fieldName]) setError(fieldName, { message: "" });
  };

  if (!showEmailForm) {
    return (
      <div className="space-y-4 w-full">
        <ErrorMessage error={error} />
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
      <ErrorMessage error={error} />

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

      {!isLogin && (
        <div className="flex gap-2 mb-2">
          <FormField
            name="firstName"
            type="text"
            placeholder={t("auth.form.first_name")}
            register={register}
            rules={{ required: t("validation.first_name_required") }}
            error={errors.firstName?.message}
            required
            className={`flex-1 ${getFieldClassName("firstName")}`}
            onChange={(e) => handleFieldChange(e, "firstName")}
          />
          <FormField
            name="lastName"
            type="text"
            placeholder={t("auth.form.last_name")}
            register={register}
            rules={{ required: t("validation.last_name_required") }}
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
            className={getFieldClassName("email")}
            onChange={(e) => handleFieldChange(e, "email")}
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
            className={getFieldClassName("password")}
            autoComplete={isLogin ? "current-password" : "new-password"}
            onChange={(e) => handleFieldChange(e, "password")}
          />
        </>
      ) : (
        <PhoneInput
          register={register}
          errors={errors}
          countryCode={countryCode}
          setValue={setValue}
          phoneValue={phoneValue}
          setPhoneValue={setPhoneValue}
          t={t}
        />
      )}

      <VerificationCodeInput
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        codeError={codeError}
        setCodeError={setCodeError}
        handleSendCode={handleSendCode}
        sendingCode={sendingCode}
        codeSent={codeSent}
        setCodeSent={setCodeSent}
        t={t}
      />

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
