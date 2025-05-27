"use client";

import countryOptions from "@/app/utils/countryOptions";
import { FormField } from "@/components/common";
import { useTranslation } from "react-i18next";

export const CountrySelect = ({
  register,
  value,
  onChange,
  className,
  required = false,
  displayMode = "full", // 'full', 'flag', 'flagAndName', 'code'
  placeholder,
  error,
  name = "countryCode",
}) => {
  const { t } = useTranslation();
  const getDisplayValue = (option) => {
    switch (displayMode) {
      case "flag":
        return option.label.split(" ")[0]; // Returns only the flag emoji
      case "flagAndName":
        return option.label.split(" (+")[0]; // Returns flag and country name
      case "code":
        return option.value; // Returns only the country code
      default:
        return option.label; // Returns full format (flag + name + code)
    }
  };

  const formattedOptions = countryOptions.map((option) => ({
    ...option,
    label: getDisplayValue(option),
  }));

  return (
    <FormField
      name={name}
      type="searchableSelect"
      options={formattedOptions}
      register={register}
      required={required}
      className={className}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder || t("select_country")}
      error={error}
    />
  );
};
