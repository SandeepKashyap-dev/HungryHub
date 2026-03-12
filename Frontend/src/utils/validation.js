// Frontend validation utilities
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
};

export const validatePassword = (pw) => {
  return typeof pw === "string" && pw.trim().length >= 6;
};

export const validateFullName = (name) => {
  return typeof name === "string" && name.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(name.trim());
};

export const validatePhoneNumber = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  return /^\d{10}$/.test(digits);
};

export const validateAddress = (addr) => {
  return typeof addr === "string" && addr.trim().length >= 5;
};

export const getPasswordStrength = (pw) => {
  let s = 0;
  if (!pw) return s;
  if (pw.length >= 6) s++;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0-5
};
