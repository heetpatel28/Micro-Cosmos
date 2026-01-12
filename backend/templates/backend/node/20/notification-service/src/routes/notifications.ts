import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { NotificationQueue } from '../services/notificationQueue.js';

export const notificationRouter = Router();
const notificationQueue = new NotificationQueue();

// Validation schemas
const sendNotificationSchema = z.object({
  type: z.enum(['email', 'sms']),
  to: z.string().email().or(z.string().regex(/^\+\d{10,15}$/)),
  subject: z.string().optional(),
  message: z.string().min(1),
  metadata: z.record(z.any()).optional(),
});

/**
 * POST /api/notifications
 * Queue a notification to be sent
 */
notificationRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validated = sendNotificationSchema.parse(req.body);
    const job = await notificationQueue.addNotification(validated);
    
    res.status(202).json({
      message: 'Notification queued',
      jobId: job.id,
      status: 'pending',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to queue notification' });
  }
});

/**
 * GET /api/notifications/status/:jobId
 * Get notification job status
 */
notificationRouter.get('/status/:jobId', async (req: Request, res: Response) => {
  try {
    // This would require access to the queue instance
    // For now, return a placeholder response
    res.json({
      jobId: req.params.jobId,
      status: 'processing',
      message: 'Check queue status via Redis/BullMQ dashboard',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get notification status' });
  }
});

