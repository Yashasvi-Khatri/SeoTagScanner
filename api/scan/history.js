import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function requireAuth(req: VercelRequest): Promise<string> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization token required");
  }
  
  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  
  const decoded = jwt.verify(token, secret) as any;
  return decoded.userId;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const userId = await requireAuth(req);
    
    const { data: scans, error } = await supabase
      .from("scans")
      .select("id, url, result, scanned_at")
      .eq("user_id", userId)
      .order("scanned_at", { ascending: false });
    
    if (error) throw error;
    
    const history = (scans || []).map((s: any) => ({
      id: s.id,
      url: s.url,
      title: s.result?.title ?? null,
      description: s.result?.metaTags?.description?.content ?? null,
      created_at: s.scanned_at
    }));
    
    return res.status(200).json(history);
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to fetch scan history" });
  }
}
