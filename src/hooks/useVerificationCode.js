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

  const isInputValid = isEmail ? email : phone;

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
    handleSendCodeWithError,
    isInputValid,
  };
};
