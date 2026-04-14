import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('=== MINIMAL TEST ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  
  try {
    // Test basic imports
    const jwt = await import('jsonwebtoken');
    const bcrypt = await import('bcryptjs');
    
    console.log('JWT imported successfully:', !!jwt);
    console.log('Bcrypt imported successfully:', !!bcrypt);
    
    // Test JWT function
    const testToken = jwt.default.sign({ test: 'data' }, 'test-secret');
    console.log('JWT token created successfully');
    
    return res.status(200).json({
      status: 'ok',
      message: 'Minimal test passed',
      imports: {
        jwt: !!jwt,
        bcrypt: !!bcrypt
      },
      jwtTest: !!testToken
    });
  } catch (error: any) {
    console.error('Minimal test failed:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      stack: error.stack
    });
  }
}
