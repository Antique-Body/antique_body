"use client";
import {
  Button,
  FacebookIcon,
  FormField,
  GoogleIcon,
} from "@/components/common";
import { ErrorMessage } from "@/components/custom/ErrorMessage";
import { useAuth } from "@/contexts/AuthContext";
import { Icon } from "@iconify/react";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");
  const [phoneValue, setPhoneValue] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
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

  useEffect(() => {
    if (externalSendingCode !== undefined) setSendingCode(externalSendingCode);
  }, [externalSendingCode]);

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
    if (loginMethod === "email") {
      const email = getValues("email");
      if (!email) {
        setCodeError("Email is required");
        return;
      }
      setCodeError("");
      setSendingCode(true);
      try {
        const response = await fetch("/api/auth/send-verification-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to send verification code");
        }

        setCodeSent(true);
        setVerificationCode(""); // Reset verification code when sending new one
      } catch (err) {
        console.error("Error sending code:", err);
        setCodeError(err.message);
      } finally {
        setSendingCode(false);
      }
    } else {
      const phone = getValues("phone");
      if (!phone) {
        setCodeError("Phone number is required");
        return;
      }
      setCodeError("");
      setSendingCode(true);
      try {
        const response = await fetch("/api/auth/send-verification-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to send verification code");
        }

        setCodeSent(true);
        setVerificationCode(""); // Reset verification code when sending new one
      } catch (err) {
        console.error("Error sending code:", err);
        setCodeError(err.message);
      } finally {
        setSendingCode(false);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = getValues();

    if (loginMethod === "phone" || !isLogin) {
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
    }

    onSubmit({ ...formData, code: verificationCode });
  };

  const getFieldClassName = (fieldName) =>
    errors[fieldName]?.message ? "border-red-500" : "";

  const handleFieldChange = (e, fieldName) => {
    if (errors[fieldName]) setError(fieldName, { message: "" });
  };

  if (!showEmailForm) {
    return (
      <div className="space-y-4 w-full">
        <ErrorMessage error={error || codeError} />
        <Button
          onClick={() => setShowEmailForm(true)}
          className="w-full bg-gradient-to-r from-[#ff7800] to-[#ff5f00] py-2 rounded font-medium text-white hover:from-[#ff5f00] hover:to-[#ff7800] transition-all duration-300 disabled:opacity-50"
        >
          {isLogin ? "Continue with Email/Phone" : "Register with Email/Phone"}
        </Button>

        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full bg-white text-[#1a1a1a] hover:bg-gray-100 hover:scale-[1.02] transition-all duration-200"
          leftIcon={<GoogleIcon />}
        >
          {isLogin ? "Continue with Google" : "Register with Google"}
        </Button>
        <Button
          onClick={handleFacebookSignIn}
          variant="outline"
          className="w-full bg-white text-[#1a1a1a] hover:bg-gray-100 hover:scale-[1.02] transition-all duration-200"
          leftIcon={<FacebookIcon />}
        >
          {isLogin ? "Continue with Facebook" : "Register with Facebook"}
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
          Use Email
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
          Use Phone
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
            />
          )}
        </>
      ) : (
        <>
          <PhoneInput
            register={register}
            errors={errors}
            countryCode={countryCode}
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
