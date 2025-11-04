import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPasssword = await bcrypt.hash(password, saltRounds);
  return hashedPasssword;
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};