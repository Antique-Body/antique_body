"use client";
import React from "react";

export const TextField = ({
  id,
  name,
  label,
  type = "text",
  register,
  rules = {},
  error,
  required = false,
  className = "",
  placeholder = "",
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-1" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        className={`w-full p-2 bg-[#1a1a1a] border border-[#333] rounded focus:outline-none focus:border-[#ff7800] text-white cursor-pointer ${className}`}
        required={required}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};
