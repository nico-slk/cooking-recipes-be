const isValidEmail = (email: string): any => {
  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}$/;

  return emailRegex.test(email);
};

export default { isValidEmail };
