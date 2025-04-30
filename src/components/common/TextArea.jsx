"use client";
import React from "react";

export const TextArea = ({
  id,
  name,
  label,
  register,
  rules = {},
  error,
  required = false,
  className = "",
  placeholder = "",
  subLabel = "",
  rows = 4,
}) => (
  <div className="mb-4">
    {label && (
      <label className="mb-2 block text-gray-300" htmlFor={id}>
        {label}
      </label>
    )}
    {subLabel && <p className="mb-2 text-sm text-gray-400">{subLabel}</p>}
    <textarea
      id={id}
      name={name}
      rows={rows}
      placeholder={placeholder}
      {...register(name, rules)}
      className={`w-full cursor-pointer rounded border border-[#333] bg-[#1a1a1a] p-2 text-white focus:border-[#ff7800] focus:outline-none ${className}`}
      required={required}
    />
    {error && <p className="text-sm text-red-500">{error.message}</p>}
  </div>
);
