// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Check if string is empty or just whitespace
const isEmpty = (str) => !str || str.trim() === "";

// Validate registration data
export const validateRegistration = (data) => {
  const errors = {};

  if (!data) {
    return { valid: false, errors: { general: "No data provided" } };
  }

  const { name, lastName, email, password } = data;

  if (isEmpty(name)) {
    errors.name = "Name is required";
  }

  // lastName is optional, but if provided should not be just whitespace
  if (lastName !== undefined && lastName !== null && isEmpty(lastName)) {
    errors.lastName = "Last name cannot be empty";
  }

  if (isEmpty(email)) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Please provide a valid email";
  }

  if (isEmpty(password)) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate login credentials
export const validateLogin = (data) => {
  const errors = {};

  if (!data) {
    return { valid: false, errors: { general: "No data provided" } };
  }

  const { email, password } = data;

  if (isEmpty(email)) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Please provide a valid email";
  }

  if (isEmpty(password)) {
    errors.password = "Password is required";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate user update data
export const validateUserUpdate = (data) => {
  const errors = {};

  if (!data) {
    return { valid: false, errors: { general: "No data provided" } };
  }

  const { name, lastName, email } = data;

  if (name !== undefined && isEmpty(name)) {
    errors.name = "Name cannot be empty";
  }

  if (lastName !== undefined && isEmpty(lastName)) {
    errors.lastName = "Last name cannot be empty";
  }

  if (email !== undefined) {
    if (isEmpty(email)) {
      errors.email = "Email cannot be empty";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please provide a valid email";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate role update data
export const validateRoleUpdate = (data) => {
  const errors = {};

  if (!data) {
    return { valid: false, errors: { general: "No data provided" } };
  }

  const { role } = data;

  if (isEmpty(role)) {
    errors.role = "Role is required";
  } else if (!["user", "client", "trainer"].includes(role.toLowerCase())) {
    errors.role = "Role must be either user, client or trainer";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate training setup data
export const validateTrainingSetup = (data) => {
  const errors = {};

  if (!data) {
    return { valid: false, errors: { general: "No data provided" } };
  }

  const { title, description, duration, maxParticipants } = data;

  if (isEmpty(title)) {
    errors.title = "Title is required";
  }

  if (isEmpty(description)) {
    errors.description = "Description is required";
  }

  if (!duration || isNaN(duration) || duration <= 0) {
    errors.duration = "Duration must be a positive number";
  }

  if (!maxParticipants || isNaN(maxParticipants) || maxParticipants <= 0) {
    errors.maxParticipants = "Maximum participants must be a positive number";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate email
export const validateEmail = (email) => {
  const errors = {};

  if (isEmpty(email)) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Please provide a valid email";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
