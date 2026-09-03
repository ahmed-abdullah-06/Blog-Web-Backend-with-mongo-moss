// Helper functions for hashing and comparing passwords using bcrypt

import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// Turns a plain password into a secure hash before saving to DB
async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

// Compares a plain password (login attempt) against the stored hash
async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export { hashPassword, comparePassword };
