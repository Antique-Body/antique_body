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
    // If all fields are cleared, allow prefill again (edge case)
    const allCleared = fields.every(({ formKey }) => formData[formKey] === "");
    if (allCleared) {
      didPrefill.current = false;
    }
    if (session?.user && !didPrefill.current && allCleared) {
      fields.forEach(({ formKey, sessionKey }) => {
        if (session.user[sessionKey]) {
          onChange({
            target: { name: formKey, value: session.user[sessionKey] },
          });
        }
      });
      didPrefill.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user, ...fields.map((f) => formData[f.formKey])]);
}
