const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateCUIT = (cuit) => {
  if (!cuit || cuit.length !== 11) return false;
  
  const cleanCuit = cuit.replace(/[^\d]/g, '');
  if (cleanCuit.length !== 11) return false;
  
  // Validación algoritmo CUIT
  const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCuit[i]) * multipliers[i];
  }
  
  const remainder = sum % 11;
  const checkDigit = remainder < 2 ? remainder : 11 - remainder;
  
  return parseInt(cleanCuit[10]) === checkDigit;
};

const validateMatricula = (matricula) => {
  // Validar formato matrícula argentina (LV-XXX o LQ-XXX)
  const matriculaRegex = /^L[VQ]-[A-Z]{3}$/;
  return matriculaRegex.test(matricula.toUpperCase());
};

const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

module.exports = {
  validateEmail,
  validateCUIT,
  validateMatricula,
  validatePhoneNumber
};