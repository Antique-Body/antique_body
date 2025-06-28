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

  useEffect(() => {
    // Prefill samo prvi put, i samo ako su sva polja prazna
    if (!didPrefill.current) {
      const allEmpty = fields.every(({ formKey }) => {
        const isEmpty = !formData[formKey];

        return isEmpty;
      });

      if (allEmpty) {
        fields.forEach(({ formKey, sessionKey }) => {
          let value = session?.user?.[sessionKey];

          // Special handling for firstName/lastName if they don't exist but name does
          if (
            !value &&
            session?.user?.name &&
            (sessionKey === "firstName" || sessionKey === "lastName")
          ) {
            const nameParts = session.user.name.trim().split(" ");
            if (sessionKey === "firstName" && nameParts.length > 0) {
              value = nameParts[0];
            } else if (sessionKey === "lastName" && nameParts.length > 1) {
              value = nameParts.slice(1).join(" "); // Join remaining parts as lastName
            }
          }

          // Ako nema u sessionu, probaj sessionStorage (samo za firstName/lastName)
          if (
            !value &&
            (sessionKey === "firstName" || sessionKey === "lastName")
          ) {
            if (typeof window !== "undefined") {
              value = sessionStorage.getItem(sessionKey) || "";
            }
          }

          if (value) {
            onChange({
              target: { name: formKey, value },
            });
          } else {
          }
        });
        didPrefill.current = true;
      } else {
      }
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);
}
