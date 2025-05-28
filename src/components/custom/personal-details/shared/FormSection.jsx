"use client";
import { Card } from "@/components/common/Card";

/**
 * Reusable form section component that wraps content in a Card
 * Provides consistent styling and interactive features
 */
export const FormSection = ({
  title,
  description,
  children,
  className = "",
  variant = "dark",
  hover = true,
  icon = null,
}) => (
  <Card
    variant={variant}
    hover={hover}
    className={`mb-6 ${className}`}
    width="100%"
    maxWidth="none"
  >
    {(title || icon) && (
      <div className="mb-4 flex items-center gap-3">
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6B00]/10">
            {icon}
          </div>
        )}
        {title && (
          <h3 className="text-xl font-medium text-[#FF6B00]">{title}</h3>
        )}
      </div>
    )}
    {description && <p className="mb-4 text-sm text-gray-400">{description}</p>}
    {children}
  </Card>
);
