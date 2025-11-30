import express from 'express';
import path from 'path';
import generateRoute from './generateRoute';
import { closeBrowser } from '../generator/imageGenerator';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../../public')));

// Serve output images (for debugging)
app.use('/output', express.static(path.join(__dirname, '../../output')));

// API Routes
app.use('/api/generate', generateRoute);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Serve the frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Indie Portfolio Showcaser                            ║
║                                                           ║
║   Server running at: http://localhost:${PORT}              ║
║                                                           ║
║   Endpoints:                                              ║
║   • POST /api/generate      - Generate portfolio image    ║
║   • POST /api/generate/json - Get portfolio data as JSON  ║
║   • GET  /api/health        - Health check                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[Server] Shutting down gracefully...');
  await closeBrowser();
  server.close(() => {
    console.log('[Server] Goodbye!');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('\n[Server] Received SIGTERM, shutting down...');
  await closeBrowser();
  server.close(() => {
    process.exit(0);
  });
});

export default app;

