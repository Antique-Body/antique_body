import { useEffect, useState } from "react";

export const usePhoneInput = ({
  register,
  setValue,
  countryCode,
  setPhoneValue: setPhoneValueExternal,
}) => {
  const [displayValue, setDisplayValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");

  useEffect(() => {
    if (countryCode) {
      setDisplayValue(countryCode);
      setPhoneValue(countryCode);
      setValue("phone", countryCode);
      if (setPhoneValueExternal) setPhoneValueExternal(countryCode);
    }
  }, [countryCode, setValue, setPhoneValueExternal]);

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    if (countryCode && value.length < countryCode.length) {
      setDisplayValue(countryCode);
      setPhoneValue(countryCode);
      setValue("phone", countryCode);
      if (setPhoneValueExternal) setPhoneValueExternal(countryCode);
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
    if (setPhoneValueExternal) setPhoneValueExternal(newValue);
  };

  const handleCountryCodeChange = (e) => {
    setValue("countryCode", e.target.value);
    setPhoneValue(e.target.value);
    setDisplayValue(e.target.value);
    setValue("phone", e.target.value);
    if (setPhoneValueExternal) setPhoneValueExternal(e.target.value);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    if (countryCode) {
      const newValue = countryCode + pastedText.replace(/\D/g, "");
      setDisplayValue(newValue);
      setPhoneValue(newValue);
      setValue("phone", newValue);
    }
  };

  return {
    displayValue,
    phoneValue,
    handlePhoneChange,
    handleCountryCodeChange,
    handlePaste,
  };
};
