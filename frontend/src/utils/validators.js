export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return !value || value.toString().length <= maxLength;
};

export const validateCUIT = (cuit) => {
  if (!cuit) return false;
  
  const cleanCuit = cuit.replace(/[^\d]/g, '');
  if (cleanCuit.length !== 11) return false;
  
  const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCuit[i]) * multipliers[i];
  }
  
  const remainder = sum % 11;
  const checkDigit = remainder < 2 ? remainder : 11 - remainder;
  
  return parseInt(cleanCuit[10]) === checkDigit;
};

export const validateMatricula = (matricula) => {
  if (!matricula) return false;
  const matriculaRegex = /^L[VQ]-[A-Z]{3}$/;
  return matriculaRegex.test(matricula.toUpperCase());
};

export const validatePhoneNumber = (phone) => {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = `${fieldRules.label || field} es requerido`;
      return;
    }
    
    if (fieldRules.email && value && !validateEmail(value)) {
      errors[field] = `${fieldRules.label || field} debe ser un email válido`;
      return;
    }
    
    if (fieldRules.minLength && value && !validateMinLength(value, fieldRules.minLength)) {
      errors[field] = `${fieldRules.label || field} debe tener al menos ${fieldRules.minLength} caracteres`;
      return;
    }
    
    if (fieldRules.maxLength && value && !validateMaxLength(value, fieldRules.maxLength)) {
      errors[field] = `${fieldRules.label || field} no puede tener más de ${fieldRules.maxLength} caracteres`;
      return;
    }
    
    if (fieldRules.custom && value && !fieldRules.custom(value)) {
      errors[field] = fieldRules.customMessage || `${fieldRules.label || field} no es válido`;
      return;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};