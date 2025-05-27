import { Button, FormField } from "@/components/common";
import { useVerificationCode } from "@/hooks";
import { useTranslation } from "react-i18next";
export const VerificationCodeInput = ({
  verificationCode,
  setVerificationCode,
  codeError,
  setCodeError,
  handleSendCode,
  sendingCode,
  codeSent,
  setCodeSent,
  isEmail,
  email,
  phone,
  setValue,
}) => {
  const { t } = useTranslation();

  const { countdown, handleSendCodeWithError, isInputValid } =
    useVerificationCode({
      handleSendCode,
      isEmail,
      email,
      phone,
    });

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-3 items-start">
        <FormField
          name="code"
          type="text"
          placeholder={"Enter 6-digit code"}
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
          className={`flex-1 !mb-0 ${codeError ? "border-red-500" : ""}`}
          error={codeError}
        />
        <Button
          type="button"
          onClick={handleSendCodeWithError}
          loading={sendingCode}
          disabled={sendingCode || codeSent || !isInputValid || countdown > 0}
          className="!mb-0 h-[50px] bg-gradient-to-r from-[#ff7800] to-[#ff5f00] text-white hover:from-[#ff5f00] hover:to-[#ff7800] transition-all duration-300 disabled:opacity-50 rounded-lg font-medium text-sm whitespace-nowrap"
        >
          {codeSent ? t("auth.login.code_sent") : t("auth.login.send_code")}
        </Button>
      </div>
      {codeSent && (
        <Button
          type="button"
          onClick={handleSendCodeWithError}
          loading={sendingCode}
          disabled={sendingCode || countdown > 0}
          variant="ghost"
          className="text-sm text-[#ff7800] hover:text-[#ff5f00] transition-colors h-[50px]"
        >
          {sendingCode
            ? "Sending..."
            : countdown > 0
              ? `Resend in ${countdown}s`
              : "Resend Code"}
        </Button>
      )}
    </div>
  );
};
