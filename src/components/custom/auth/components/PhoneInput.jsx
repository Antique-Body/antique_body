import countryOptions from "@/app/utils/countryOptions";
import { FormField } from "@/components/common";

export const PhoneInput = ({
  register,
  errors,
  countryCode,
  setValue,
  phoneValue,
  setPhoneValue,
  t,
}) => (
  <div className="flex gap-2 mb-2">
    <FormField
      name="countryCode"
      type="select"
      options={countryOptions}
      register={register}
      required
      className="max-w-[170px]"
      countryCode
      value={countryCode || ""}
      onChange={(e) => {
        const value = e.target.value;
        setValue("countryCode", value);
        setPhoneValue(value);
      }}
    />
    <FormField
      name="phone"
      type="tel"
      placeholder={t("auth.form.phone") || "61 123 456"}
      register={register}
      value={phoneValue}
      onChange={(e) => {
        setPhoneValue(e.target.value);
        register("phone").onChange(e);
      }}
      rules={{
        required: t("validation.phone_required") || "Phone required",
        pattern: {
          value: /^[0-9]{6,12}$/,
          message: t("validation.phone_invalid") || "Invalid phone",
        },
      }}
      error={errors.phone?.message}
      required
      className="flex-1"
    />
  </div>
);
