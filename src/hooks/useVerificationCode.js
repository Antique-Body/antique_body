import { useEffect, useState } from "react";

export const useVerificationCode = ({
  handleSendCode,
  isEmail,
  email,
  phone,
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Email regex za validaciju
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const isInputValid = isEmail ? email && emailRegex.test(email) : phone;

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendCodeWithError = async () => {
    try {
      await handleSendCode();
      setCodeSent(true);
      setCountdown(30); // Start 30 second countdown
    } catch (error) {
      setCodeError(error.message);
    }
  };

  return {
    verificationCode,
    setVerificationCode,
    codeError,
    setCodeError,
    codeSent,
    setCodeSent,
    sendingCode,
    setSendingCode,
    countdown,
    setCountdown,
    handleSendCodeWithError,
    isInputValid,
  };
};
