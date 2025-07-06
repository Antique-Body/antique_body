import { useEffect } from "react";

import { Button, FormField } from "@/components/common";
import { useVerificationCode } from "@/hooks";

export const VerificationCodeInput = ({
  verificationCode,
  setVerificationCode,
  codeError,
  setCodeError,
  handleSendCode,
  sendingCode,
  codeSent,
  isEmail,
  email,
  phone,
  setValue,
}) => {
  const { countdown, setCountdown, handleSendCodeWithError, isInputValid } =
    useVerificationCode({
      handleSendCode,
      isEmail,
      email,
      phone,
    });

  // Extract dependency for useEffect
  const contactValue = isEmail ? email : phone;

  useEffect(() => {
    setCountdown(0);
  }, [contactValue, setCountdown]);

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 items-start">
        <div className="w-full sm:flex-1">
          <FormField
            name="code"
            type="text"
            placeholder="Enter 6-digit code"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setVerificationCode(value);
              if (setValue) setValue("code", value);
              if (codeError) setCodeError("");
            }}
            maxLength={6}
            pattern="[0-9]*"
            inputMode="numeric"
            required
            className={`w-full !mb-0 bg-white/5 border-white/10 focus:border-[#FF6B00]/50 focus:bg-white/10 rounded-lg h-12 sm:h-[50px] ${
              codeError ? "border-red-500" : ""
            }`}
            error={codeError}
          />
        </div>
        <Button
          type="button"
          onClick={handleSendCodeWithError}
          loading={sendingCode}
          disabled={sendingCode || codeSent || !isInputValid || countdown > 0}
          className="w-full sm:w-auto sm:min-w-[120px] !mb-0 h-12 sm:h-[50px] bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white hover:from-[#FF5f00] hover:to-[#FF7800] transition-all duration-300 disabled:opacity-50 rounded-lg font-medium text-sm whitespace-nowrap px-4"
        >
          {codeSent ? "Code Sent" : "Send Code"}
        </Button>
      </div>
      {codeSent && (
        <div className="text-center sm:text-left">
          <Button
            type="button"
            onClick={handleSendCodeWithError}
            loading={sendingCode}
            disabled={sendingCode || countdown > 0}
            className="text-sm text-[#FF6B00] hover:text-[#FF5f00] transition-colors bg-transparent border-0 p-0 h-auto font-medium"
          >
            {sendingCode
              ? "Sending..."
              : countdown > 0
              ? `Resend in ${countdown}s`
              : "Resend Code"}
          </Button>
        </div>
      )}
    </div>
  );
};
