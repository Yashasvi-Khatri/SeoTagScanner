import { supabase } from "../db.js";

/**
 * Save a scan result for a user.
 * @param {string} userId - UUID of the user
 * @param {string} url - scanned URL
 * @param {Object} result - full analysis data object
 * @returns {Promise<Object>} inserted scan row
 */
export async function saveScan(userId, url, result) {
  console.log('DB: Attempting to save scan for user:', userId);
  console.log('DB: URL:', url);
  console.log('DB: Supabase client available:', !!supabase);
  
  try {
    const { data, error } = await supabase
      .from("scans")
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
 * @param {string} userId - UUID of the user
 * @returns {Promise<Array>} list of scan rows
 */
export async function getUserScans(userId) {
  console.log('DB: Attempting to fetch scans for user:', userId);
  console.log('DB: Supabase client available:', !!supabase);
  
  try {
    const { data, error } = await supabase
      .from("scans")
      .select("id, url, result, scanned_at")
      .eq("user_id", userId)
      .order("scanned_at", { ascending: false });

    if (error) {
      console.error('DB: Get user scans error:', error);
      console.error('DB: Error code:', error.code);
      console.error('DB: Error details:', error.details);
      throw error;
    }
    
    const result = data ?? [];
    console.log('DB: User scans fetched successfully, count:', result.length);
    return result;
  } catch (err) {
    console.error('DB: Get user scans exception:', err);
    throw err;
  }
}

/**
 * Count how many scans a user has done today.
 * @param {string} userId
 * @returns {Promise<number>}
 */
export async function countTodayScans(userId) {
  console.log('DB: Counting today\'s scans for user:', userId);
  console.log('DB: Supabase client available:', !!supabase);
  
  const today = new Date().toISOString().split("T")[0];
  const startOfDay = `${today}T00:00:00.000Z`;
  const endOfDay = `${today}T23:59:59.999Z`;
  
  console.log('DB: Date range:', { startOfDay, endOfDay });

  try {
    const { count, error } = await supabase
      .from("scans")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("scanned_at", startOfDay)
      .lte("scanned_at", endOfDay);

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
