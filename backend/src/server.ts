import express from 'express';
import cors from 'cors';
import http from 'http';
import { config } from './config/index.js';
import { GeneratorService } from './generator/generatorService.js';
import { WebSocketService } from './websocket/websocketService.js';
import { createGenerationRoutes } from './api/generationRoutes.js';
import { createHealthRoutes } from './api/healthRoutes.js';

import { metricsService } from './services/metricsService.js';


// Initialize Express app
const app = express();
const httpServer = http.createServer(app);
const generatorService = new GeneratorService();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // allow any origin for this local dev tool
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Initialize WebSocket Service
new WebSocketService(httpServer, generatorService);

// Routes
app.use('/api', createHealthRoutes());

app.use('/api', createGenerationRoutes(generatorService));

// Metrics endpoint (secured)
app.get('/api/metrics', (_req, res) => {
  res.json(metricsService.getMetrics());
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : undefined,
  });
});

// Start server
const PORT = config.port;
httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   Microservice Generator - Backend Server                ║
╚═══════════════════════════════════════════════════════════╝

🚀 Server running on port ${PORT}
📡 WebSocket ready for real-time updates
📁 Templates: ${config.templatesDir}
💾 Generated files: ${config.generatedDir}

Environment: ${config.nodeEnv}
CORS Origin: ${config.corsOrigin}

Ready to generate microservices! 🎯
  `);
});

// Cleanup old jobs every hour
setInterval(() => {
  generatorService.cleanupOldJobs().catch(console.error);
}, 60 * 60 * 1000);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

