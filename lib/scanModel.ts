import { supabase } from './database.js';

export interface Scan {
  id: string;
  user_id: string;
  url: string;
  result: any;
  scanned_at: string;
}

/**
 * Save a scan result for a user.
 * @param userId - UUID of the user
 * @param url - scanned URL
 * @param result - full analysis data object
 * @returns inserted scan row
 */
export async function saveScan(userId: string, url: string, result: any): Promise<Scan> {
  console.log('DB: Attempting to save scan for user:', userId);
  console.log('DB: URL:', url);
  console.log('DB: Supabase client available:', !!supabase);
  
  try {
    const { data, error } = await supabase
      .from('scans')
      .insert({ user_id: userId, url, result })
      .select()
      .single();

    if (error) {
      console.error('DB: Save scan error:', error);
      console.error('DB: Error code:', error.code);
      console.error('DB: Error details:', error.details);
      throw error;
    }
    
    console.log('DB: Scan saved successfully, ID:', data.id);
    return data;
  } catch (err) {
    console.error('DB: Save scan exception:', err);
    throw err;
  }
}

/**
 * Fetch all scans for a user, newest first.
 * @param userId - UUID of the user
 * @returns list of scan rows
 */
export async function getUserScans(userId: string): Promise<Scan[]> {
  console.log('DB: Attempting to fetch scans for user:', userId);
  console.log('DB: Supabase client available:', !!supabase);
  
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('id, url, result, scanned_at')
      .eq('user_id', userId)
      .order('scanned_at', { ascending: false });

    if (error) {
      console.error('DB: Get user scans error:', error);
      console.error('DB: Error code:', error.code);
      console.error('DB: Error details:', error.details);
      throw error;
    }
    
    const result = (data ?? []) as Scan[];
    console.log('DB: User scans fetched successfully, count:', result.length);
    return result;
  } catch (err) {
    console.error('DB: Get user scans exception:', err);
    throw err;
  }
}

/**
 * Count how many scans a user has done today.
 * @param userId - UUID of the user
 * @returns number of scans today
 */
export async function countTodayScans(userId: string): Promise<number> {
  console.log('DB: Counting today\'s scans for user:', userId);
  console.log('DB: Supabase client available:', !!supabase);
  
  const today = new Date().toISOString().split('T')[0];
  const startOfDay = `${today}T00:00:00.000Z`;
  const endOfDay = `${today}T23:59:59.999Z`;
  
  console.log('DB: Date range:', { startOfDay, endOfDay });

  try {
    const { count, error } = await supabase
      .from('scans')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('scanned_at', startOfDay)
      .lte('scanned_at', endOfDay);

    if (error) {
      console.error('DB: Count today scans error:', error);
      console.error('DB: Error code:', error.code);
      console.error('DB: Error details:', error.details);
      throw error;
    }
    
    const result = count ?? 0;
    console.log('DB: Today\'s scans count:', result);
    return result;
  } catch (err) {
    console.error('DB: Count today scans exception:', err);
    throw err;
  }
}
