import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

/**
 * Prefills form fields from session.user only on first load.
 * @param {Object} params
 * @param {Object} params.formData - The form data object
 * @param {Function} params.onChange - The onChange handler for the form
 * @param {Array<{formKey: string, sessionKey: string}>} params.fields - Array of field mappings
 */
export function usePrefillFromSession({ formData, onChange, fields }) {
  const { data: session } = useSession();
  const didPrefill = useRef(false);

  console.log("=== usePrefillFromSession DEBUG ===");
  console.log("session:", session);
  console.log("formData:", formData);
  console.log("fields:", fields);
  console.log("didPrefill.current:", didPrefill.current);

  useEffect(() => {
    console.log("=== useEffect triggered ===");
    console.log("didPrefill.current:", didPrefill.current);
    console.log("session?.user:", session?.user);

    // Prefill samo prvi put, i samo ako su sva polja prazna
    if (!didPrefill.current) {
      console.log("=== Checking if all fields are empty ===");
      const allEmpty = fields.every(({ formKey }) => {
        const isEmpty = !formData[formKey];
        console.log(
          `Field ${formKey}: '${formData[formKey]}' - isEmpty: ${isEmpty}`
        );
        return isEmpty;
      });
      console.log("allEmpty:", allEmpty);

      if (allEmpty) {
        console.log("=== All fields empty, attempting prefill ===");
        fields.forEach(({ formKey, sessionKey }) => {
          let value = session?.user?.[sessionKey];
          console.log(
            `Checking ${formKey} -> ${sessionKey}: session value = '${value}'`
          );

          // Special handling for firstName/lastName if they don't exist but name does
          if (
            !value &&
            session?.user?.name &&
            (sessionKey === "firstName" || sessionKey === "lastName")
          ) {
            const nameParts = session.user.name.trim().split(" ");
            if (sessionKey === "firstName" && nameParts.length > 0) {
              value = nameParts[0];
              console.log(`Parsed firstName from name: '${value}'`);
            } else if (sessionKey === "lastName" && nameParts.length > 1) {
              value = nameParts.slice(1).join(" "); // Join remaining parts as lastName
              console.log(`Parsed lastName from name: '${value}'`);
            }
          }

          // Ako nema u sessionu, probaj sessionStorage (samo za firstName/lastName)
          if (
            !value &&
            (sessionKey === "firstName" || sessionKey === "lastName")
          ) {
            if (typeof window !== "undefined") {
              value = sessionStorage.getItem(sessionKey) || "";
              console.log(`SessionStorage ${sessionKey}: '${value}'`);
            }
          }

          if (value) {
            console.log(
              `=== Calling onChange for ${formKey} with value '${value}' ===`
            );
            onChange({
              target: { name: formKey, value },
            });
          } else {
            console.log(`No value found for ${formKey}`);
          }
        });
        didPrefill.current = true;
        console.log("=== Prefill completed, didPrefill set to true ===");
      } else {
        console.log("=== Not all fields empty, skipping prefill ===");
      }
    } else {
      console.log("=== Already prefilled, skipping ===");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);
}
