import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config/env.js";

// Hashes a plain text password using bcrypt with the specified number of salt rounds from the environment configuration
const hashPassword = async password => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// Compares a plain text password with a hashed password using bcrypt's compare function, returning true if they match and false otherwise
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export { hashPassword, comparePassword };
