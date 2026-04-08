import { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';
import express from 'express';
import { registerRoutes } from '../server/routes';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all routes
async function setupRoutes() {
  await registerRoutes(app);
}

// Main handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await setupRoutes();
  
  // Handle the request through Express
  app(req, res);
}
