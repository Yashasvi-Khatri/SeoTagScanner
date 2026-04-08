import { supabase } from "../db.js";

/**
 * Save a scan result for a user.
 * @param {string} userId - UUID of the user
 * @param {string} url - scanned URL
 * @param {Object} result - full analysis data object
 * @returns {Promise<Object>} inserted scan row
 */
export async function saveScan(userId, url, result) {
  const { data, error } = await supabase
    .from("scans")
    .insert({ user_id: userId, url, result })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch all scans for a user, newest first.
 * @param {string} userId - UUID of the user
 * @returns {Promise<Array>} list of scan rows
 */
export async function getUserScans(userId) {
  const { data, error } = await supabase
    .from("scans")
    .select("id, url, result, scanned_at")
    .eq("user_id", userId)
    .order("scanned_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/**
 * Count how many scans a user has done today.
 * @param {string} userId
 * @returns {Promise<number>}
 */
export async function countTodayScans(userId) {
  const today = new Date().toISOString().split("T")[0];
  const startOfDay = `${today}T00:00:00.000Z`;
  const endOfDay = `${today}T23:59:59.999Z`;

  const { count, error } = await supabase
    .from("scans")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("scanned_at", startOfDay)
    .lte("scanned_at", endOfDay);

  if (error) throw error;
  return count ?? 0;
}
