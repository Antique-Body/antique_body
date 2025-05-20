import countryOptions from "@/app/utils/countryOptions";
import { FormField } from "@/components/common";
import { useEffect, useState } from "react";

export const PhoneInput = ({
  register,
  errors,
  countryCode,
  setValue,
  phoneValue,
  setPhoneValue,
}) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (countryCode) {
      setDisplayValue(countryCode);
      setPhoneValue(countryCode);
      setValue("phone", countryCode);
    }
  }, [countryCode, setValue]);

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    if (countryCode && value.length < countryCode.length) {
      setDisplayValue(countryCode);
      setPhoneValue(countryCode);
      setValue("phone", countryCode);
      return;
    }

    const countryCodeLength = countryCode ? countryCode.length : 0;
    const newValue =
      value.slice(0, countryCodeLength) +
      value.slice(countryCodeLength).replace(/\D/g, "");

    setPhoneValue(newValue);
    setDisplayValue(newValue);
    setValue("phone", newValue);
    register("phone").onChange(e);
  };

  return (
    <div className="flex gap-2 mb-2">
      <FormField
        name="countryCode"
        type="searchableSelect"
        options={countryOptions}
        register={register}
        required
        className="max-w-[170px]"
        value={countryCode || ""}
        onChange={(e) => {
          setValue("countryCode", e.target.value);
          setPhoneValue(e.target.value);
          setDisplayValue(e.target.value);
          setValue("phone", e.target.value);
        }}
      />
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
        onPaste={(e) => {
          e.preventDefault();
          const pastedText = e.clipboardData.getData("text");
          if (countryCode) {
            const newValue = countryCode + pastedText.replace(/\D/g, "");
            setDisplayValue(newValue);
            setPhoneValue(newValue);
            setValue("phone", newValue);
          }
        }}
        rules={{
          required: "Phone required",
          pattern: {
            value: /^\+?[0-9]{6,12}$/,
            message: "Invalid phone",
          },
        }}
        error={errors.phone?.message}
        required
        className="flex-1"
      />
    </div>
  );
};
