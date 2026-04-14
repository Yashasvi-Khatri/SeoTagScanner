import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('=== HEALTH CHECK ===');
  console.log('Method:', req.method);
  console.log('Environment check:');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'MISSING');
  console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'MISSING');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'MISSING');
  
  try {
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        supabase: process.env.SUPABASE_URL ? 'configured' : 'missing',
        jwt: process.env.JWT_SECRET ? 'configured' : 'missing'
      }
    };
    
    console.log('Health check successful:', healthStatus);
    return res.status(200).json(healthStatus);
  } catch (error: any) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
