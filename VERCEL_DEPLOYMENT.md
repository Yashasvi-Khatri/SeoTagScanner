# Vercel Deployment Guide

## Overview
Your SEO Tag Scanner app has been converted to use Vercel Serverless Functions. The Express backend is now deployed as individual API endpoints in the `/api` folder.

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Convert to Vercel serverless functions"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the framework

### 3. Configure Environment Variables
In your Vercel project dashboard, add these Environment Variables:

```
SUPABASE_URL=https://dzdapevcmsbbkmcnrwlb.supabase.co
SUPABASE_ANON_KEY=sb_publishable_O56fkimTFtV5j01rlPGnew_bMlzfXw0
JWT_SECRET=fd3a6b2d8a1e4d19e7d571669aec6062cbf2e29ef88731f41682e187d1a186aa
NODE_ENV=production
```

### 4. Deploy
Click "Deploy" - Vercel will build and deploy your app.

## Architecture Overview

### Serverless Functions Structure
```
/api/
  auth/
    register.ts    - POST /api/auth/register
    login.ts       - POST /api/auth/login  
    me.ts          - GET /api/auth/me
  scan/
    index.ts       - GET /api/scan
    history.ts     - GET /api/scan/history
```

### Frontend
- Built with Vite in `/client` folder
- Deploys to `/client/dist`
- Uses relative API paths (no base URL needed)

### Configuration Files
- `vercel.json` - Routes and build configuration
- `.vercelignore` - Excludes server folder
- Updated `package.json` build script

## API Endpoints

All endpoints maintain the same functionality:

### Authentication
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile

### SEO Analysis  
- `GET /api/scan?url=...` - Analyze website SEO
- `GET /api/scan/history` - Get scan history

## Key Changes Made

### 1. Serverless Functions
- Converted Express routes to individual handler functions
- Each function exports `default async function handler(req, res)`
- Added method validation and JWT authentication inline

### 2. Client Updates
- Already using relative API paths (no changes needed)
- All API calls work seamlessly with serverless functions

### 3. Build Configuration
- Updated `package.json` build script
- Created `vercel.json` for routing
- Added `.vercelignore` to exclude server folder

### 4. Environment Variables
- Same variables as local development
- Configure in Vercel dashboard

## Testing After Deployment

1. **Frontend**: Visit your Vercel URL
2. **API Test**: 
   ```bash
   # Test registration
   curl -X POST https://your-app.vercel.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   
   # Test login
   curl -X POST https://your-app.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

## Benefits of Vercel Deployment

- **Serverless**: No server management needed
- **Global CDN**: Automatic global distribution
- **Automatic HTTPS**: Free SSL certificates
- **Zero Config**: Automatic framework detection
- **Instant Rollbacks**: Deploy previews and rollbacks
- **Cost Effective**: Pay per usage, generous free tier

## Troubleshooting

### Common Issues

1. **Build Errors**: Check client dependencies in `package.json`
2. **API Errors**: Verify environment variables in Vercel dashboard
3. **CORS Issues**: Serverless functions handle CORS automatically
4. **Database Connection**: Ensure Supabase URL and keys are correct

### Logs and Debugging
- Check Vercel Functions logs in dashboard
- Use `console.log` in serverless functions
- Monitor build logs for dependency issues

## Performance Considerations

- **Cold Starts**: First request may be slower (2-3 seconds)
- **Timeout**: Functions timeout after 10 seconds (configurable)
- **Memory**: Default 512MB, can be increased if needed
- **Concurrent**: Handles multiple simultaneous requests

Your app is now ready for Vercel deployment!
