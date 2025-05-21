// Common validation functions for API routes

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Basic phone validation - adjust regex based on your requirements
  const phoneRegex = /^\+?[\d\s-]{8,}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const validateRequired = (value) => {
  return value !== undefined && value !== null && value !== "";
};

export const validateObject = (obj, schema) => {
  const errors = {};

  for (const [key, validator] of Object.entries(schema)) {
    if (!validator(obj[key])) {
      errors[key] = `Invalid ${key}`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
