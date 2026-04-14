import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('=== TEST API REQUEST ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Environment check:');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'MISSING');
  console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'SET' : 'MISSING');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'MISSING');
  
  try {
    const testResponse = {
      status: 'ok',
      message: 'Serverless function is working',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      environment: {
        supabase: process.env.SUPABASE_URL ? 'configured' : 'missing',
        jwt: process.env.JWT_SECRET ? 'configured' : 'missing'
      }
    };
    
    console.log('Test successful:', testResponse);
    return res.status(200).json(testResponse);
  } catch (error: any) {
    console.error('Test failed:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
