import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

export interface NotificationJob {
  type: 'email' | 'sms';
  to: string;
  subject?: string;
  message: string;
  metadata?: Record<string, any>;
}

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

export class NotificationQueue {
  private queue: Queue<NotificationJob>;
  private worker: Worker<NotificationJob>;

  constructor() {
    this.queue = new Queue<NotificationJob>('notifications', { connection });
    this.worker = new Worker<NotificationJob>(
      'notifications',
      this.processNotification.bind(this),
      { connection }
    );

    this.worker.on('completed', (job) => {
      console.log(`✅ Notification sent: ${job.id} - ${job.data.type} to ${job.data.to}`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`❌ Notification failed: ${job?.id}`, err);
    });
  }

  async addNotification(job: NotificationJob) {
    return this.queue.add('send-notification', job, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  async processNotification(job: { data: NotificationJob }) {
    const { type, to, subject, message } = job.data;

    // Placeholder implementation - replace with actual email/SMS service
    console.log(`📧 Processing ${type} notification to ${to}`);
    console.log(`Subject: ${subject || 'N/A'}`);
    console.log(`Message: ${message}`);

    // Simulate async processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, integrate with:
    // - Email: SendGrid, AWS SES, Mailgun, etc.
    // - SMS: Twilio, AWS SNS, etc.

    return { success: true, sentAt: new Date().toISOString() };
  }

  startWorker() {
    console.log('🔔 Notification worker started');
  }

  async close() {
    await this.worker.close();
    await this.queue.close();
    await connection.quit();
  }
}

