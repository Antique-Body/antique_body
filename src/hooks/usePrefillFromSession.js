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
      const allEmpty = fields.every(({ formKey }) => !formData[formKey]);
      if (allEmpty) {
        fields.forEach(({ formKey, sessionKey }) => {
          let value = session?.user?.[sessionKey];
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
          }
        });
        didPrefill.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);
}
