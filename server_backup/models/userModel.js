import { supabase } from "../db.js";

/**
 * Insert a new user into the users table.
 * @param {string} email
 * @param {string} passwordHash - bcrypt hash
 * @returns {Promise<Object>} created user row
 */
export async function createUser(email, passwordHash) {
  const { data, error } = await supabase
    .from("users")
    .insert({ email, password_hash: passwordHash })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch a user by their UUID.
 * @param {string} id - UUID
 * @returns {Promise<Object|null>}
 */
export async function findUserById(id) {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, created_at")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data;
}

/**
 * Fetch a user by email address.
 * @param {string} email
 * @returns {Promise<Object|null>} user row or null if not found
 */
export async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    // PGRST116 = row not found — treat as null instead of throwing
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data;
}
