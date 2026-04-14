import { supabase } from './database.js';

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  created_at: string;
}

/**
 * Insert a new user into the users table.
 * @param email - User email address
 * @param passwordHash - bcrypt hash
 * @returns created user row
 */
export async function createUser(email: string, passwordHash: string): Promise<User> {
  console.log('DB: Attempting to create user with email:', email);
  console.log('DB: Supabase client available:', !!supabase);
  
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({ email, password_hash: passwordHash })
      .select()
      .single();

    if (error) {
      console.error('DB: Create user error:', error);
      console.error('DB: Error code:', error.code);
      console.error('DB: Error details:', error.details);
      throw error;
    }
    
    console.log('DB: User created successfully, ID:', data.id);
    return data;
  } catch (err) {
    console.error('DB: Create user exception:', err);
    throw err;
  }
}

/**
 * Fetch a user by their UUID.
 * @param id - UUID
 * @returns user row or null if not found
 */
export async function findUserById(id: string): Promise<User | null> {
  console.log('DB: Attempting to find user by ID:', id);
  console.log('DB: Supabase client available:', !!supabase);
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, created_at')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('DB: User not found with ID:', id);
        return null;
      }
      console.error('DB: Find user by ID error:', error);
      throw error;
    }

    console.log('DB: User found successfully:', data.id);
    return data;
  } catch (err) {
    console.error('DB: Find user by ID exception:', err);
    throw err;
  }
}

/**
 * Fetch a user by email address.
 * @param email - User email address
 * @returns user row or null if not found
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  console.log('DB: Attempting to find user by email:', email);
  console.log('DB: Supabase client available:', !!supabase);
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      // PGRST116 = row not found - treat as null instead of throwing
      if (error.code === 'PGRST116') {
        console.log('DB: User not found with email:', email);
        return null;
      }
      console.error('DB: Find user by email error:', error);
      throw error;
    }

    console.log('DB: User found by email:', data.id);
    return data;
  } catch (err) {
    console.error('DB: Find user by email exception:', err);
    throw err;
  }
}
