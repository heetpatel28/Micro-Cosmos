import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { notificationRouter } from './routes/notifications.js';
import { healthRouter } from './routes/health.js';
import { NotificationQueue } from './services/notificationQueue.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || {{PORT}};

// Middleware
app.use(cors());
app.use(express.json());

// Initialize notification queue
const notificationQueue = new NotificationQueue();
notificationQueue.startWorker();

// Routes
app.use('/health', healthRouter);
app.use('/api/notifications', notificationRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await notificationQueue.close();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 {{SERVICE_NAME}} server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

