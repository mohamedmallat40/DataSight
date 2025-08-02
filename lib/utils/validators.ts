// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

// Phone validation
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");

  return phoneRegex.test(cleaned);
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);

    return true;
  } catch {
    return false;
  }
}

// File validation
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function isValidFileSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes;
}

// Form validation schemas
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateField(
  value: any,
  rules: ValidationRule,
): ValidationResult {
  const errors: string[] = [];

  if (
    rules.required &&
    (!value || (typeof value === "string" && value.trim() === ""))
  ) {
    errors.push("This field is required");
  }

  if (value && typeof value === "string") {
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Must be at least ${rules.minLength} characters`);
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Must be no more than ${rules.maxLength} characters`);
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push("Invalid format");
    }
  }

  if (rules.custom && value) {
    const customResult = rules.custom(value);

    if (typeof customResult === "string") {
      errors.push(customResult);
    } else if (!customResult) {
      errors.push("Invalid value");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Contact validation
export const contactValidationRules = {
  firstName: {
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  lastName: {
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  email: {
    required: true,
    custom: (value: string) => isValidEmail(value) || "Invalid email format",
  },
  phone: {
    required: false,
    custom: (value: string) =>
      !value || isValidPhone(value) || "Invalid phone format",
  },
  company: {
    required: false,
    maxLength: 100,
  },
  jobTitle: {
    required: false,
    maxLength: 100,
  },
};

export function validateContact(contact: any): ValidationResult {
  const allErrors: string[] = [];

  Object.entries(contactValidationRules).forEach(([field, rules]) => {
    const result = validateField(contact[field], rules);

    if (!result.isValid) {
      allErrors.push(...result.errors.map((error) => `${field}: ${error}`));
    }
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}
