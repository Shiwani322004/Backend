// Simple validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateForm = (formData, isLogin = false) => {
  const errors = {};

  // Email validation
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email';
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  // Name validation (only for registration)
  if (!isLogin) {
    if (!formData.fullname) {
      errors.fullname = 'Full name is required';
    } else if (!validateName(formData.fullname)) {
      errors.fullname = 'Name must be at least 2 characters';
    }

    if (!formData.rollNumber) {
      errors.rollNumber = 'Roll number is required';
    }

    if (!formData.class) {
      errors.class = 'Class is required';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};