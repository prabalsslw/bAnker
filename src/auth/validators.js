export const validatePhone = (phone) => {
  const regex = /^01[3-9]\d{8}$/;
  return regex.test(phone);
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePin = (pin) => {
  const regex = /^\d{4}$/;
  return regex.test(pin);
};