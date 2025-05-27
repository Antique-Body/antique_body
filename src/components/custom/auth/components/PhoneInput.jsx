import { CountrySelect, FormField } from "@/components/common";
import { usePhoneInput } from "@/hooks";
import { useTranslation } from "react-i18next";

export const PhoneInput = ({
  register,
  errors,
  countryCode,
  setValue,
  phoneValue,
  setPhoneValue,
}) => {
  const { t } = useTranslation();
  const {
    displayValue,
    handlePhoneChange,
    handleCountryCodeChange,
    handlePaste,
  } = usePhoneInput({
    register,
    setValue,
    countryCode,
  });

  return (
    <div className="flex gap-2 mb-2">
      <div className="w-[55%]">
        <CountrySelect
          register={register}
          value={countryCode}
          onChange={handleCountryCodeChange}
          className="max-w-[300px]"
          required
          displayMode="full"
          placeholder={t("select_country_code")}
        />
      </div>
      <FormField
        name="phone"
        type="tel"
        placeholder="61 123 456"
        register={register}
        value={displayValue}
        onChange={handlePhoneChange}
        onKeyDown={(e) => {
          if (
            e.key === "Backspace" &&
            countryCode &&
            displayValue.length <= countryCode.length
          ) {
            e.preventDefault();
          }
        }}
        onPaste={handlePaste}
        rules={{
          required: t("phone_required", {
            defaultValue: t("validation.phone_required"),
          }),
          pattern: {
            value: /^\+?[0-9]{6,12}$/,
            message: t("phone_invalid", {
              defaultValue: t("validation.phone_invalid"),
            }),
          },
        }}
        error={errors.phone?.message}
        required
        className="flex-1"
      />
    </div>
  );
};
