import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('DB: Initializing Supabase connection...');
console.log('DB: SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
console.log('DB: SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('DB: Missing required environment variables');
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('DB: Supabase client initialized successfully');
