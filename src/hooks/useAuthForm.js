import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const useAuthForm = ({
  onSubmit,
  externalCodeError,
  externalCodeSent,
  externalSendingCode,
  isLogin = true,
}) => {
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

    // Only require verification code for phone login
    if (loginMethod === "phone") {
      if (!formData.code) {
        setError("code", { message: "Verification code is required" });
        setCodeError("Verification code is required");
        return;
      }

      if (formData.code.length !== 6) {
        setError("code", { message: "Verification code must be 6 digits" });
        setCodeError("Verification code must be 6 digits");
        return;
      }
    }

    onSubmit(formData);
  };

  const getFieldClassName = (fieldName) =>
    errors[fieldName]?.message ? "border-red-500" : "";

  const handleFieldChange = (e, fieldName) => {
    if (errors[fieldName]) setError(fieldName, { message: "" });
  };

  return {
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
  };
};
