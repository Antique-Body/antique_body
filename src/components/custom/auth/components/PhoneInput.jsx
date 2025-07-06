import { CountrySelect, FormField } from "@/components/common";
import { usePhoneInput } from "@/hooks";

export const PhoneInput = ({
  register,
  errors,
  countryCode,
  setValue,
  setPhoneValue,
}) => {
  const {
    displayValue,
    handlePhoneChange,
    handleCountryCodeChange,
    handlePaste,
  } = usePhoneInput({
    register,
    setValue,
    countryCode,
    setPhoneValue,
  });

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="w-full sm:w-[45%]">
        <CountrySelect
          register={register}
          value={countryCode}
          onChange={handleCountryCodeChange}
          className="w-full bg-white/5 border-white/10 focus:border-[#FF6B00]/50 focus:bg-white/10 rounded-lg h-12 sm:h-[50px]"
          required
          displayMode="full"
          placeholder="Select country"
        />
      </div>
      <div className="w-full sm:flex-1">
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
            required: "Phone number is required",
            pattern: {
              value: /^\+?[0-9]{6,12}$/,
              message: "Please enter a valid phone number",
            },
          }}
          error={errors.phone?.message}
          required
          className="w-full bg-white/5 border-white/10 focus:border-[#FF6B00]/50 focus:bg-white/10 rounded-lg h-12 sm:h-[50px]"
        />
      </div>
    </div>
  );
};
