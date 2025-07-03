import React from "react";

import { Card } from "@/components/common/Card";

/**
 * A wrapper component for registration steps that provides consistent styling
 */
export const RegistrationStep = ({
  title,
  description,
  children,
  className = "",
}) => (
  <Card variant="formSection" className={`mb-6 ${className}`}>
    <div className="p-6 sm:p-8 w-full">
      {title && (
        <h2 className="mb-4 text-xl font-medium text-[#FF6B00]">{title}</h2>
      )}
      {description && (
        <p className="mb-3 text-sm text-gray-400">{description}</p>
      )}
      {children}
    </div>
  </Card>
);
