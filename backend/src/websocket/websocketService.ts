import { Server as HTTPServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';

import { GeneratorService } from '../generator/generatorService.js';
import { SocketLogEvent } from '../types/generation.js';

/**
 * WebSocket Service - Handles real-time communication for generation jobs
 */

export class WebSocketService {
  private io: SocketServer;
  private generatorService: GeneratorService;
  private activeJobs: Map<string, string> = new Map(); // jobId -> socketId

  constructor(httpServer: HTTPServer, generatorService: GeneratorService) {
    this.generatorService = generatorService;

    this.io = new SocketServer(httpServer, {
      path: '/socket.io',
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('subscribe', async (jobId: string) => {
        if (!jobId || typeof jobId !== 'string') {
          socket.emit('error', { message: 'Invalid job ID' });
          return;
        }

        const job = this.generatorService.getJob(jobId);
        if (!job) {
          socket.emit('error', { message: 'Job not found' });
          return;
        }

        // Track active job
        this.activeJobs.set(jobId, socket.id);
        socket.join(`job:${jobId}`);

        // Send current job status
        this.emitToJob(jobId, 'progress', job.progress);
        job.logs.forEach(log => {
          this.emitToJob(jobId, 'log', log);
        });

        // If job is already processing, we'll receive updates
        // If job is pending, start processing
        if (job.status === 'pending') {
          this.startGeneration(jobId);
        } else if (job.status === 'completed' && job.downloadUrl) {
          this.emitToJob(jobId, 'done', { downloadUrl: job.downloadUrl });
        } else if (job.status === 'failed' && job.error) {
          this.emitToJob(jobId, 'error', { error: job.error });
        }
      });

      socket.on('disconnect', () => {
        // Clean up active jobs
        for (const [jobId, socketId] of this.activeJobs.entries()) {
          if (socketId === socket.id) {
            this.activeJobs.delete(jobId);
          }
        }
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  /**
   * Emit event to all clients subscribed to a job
   */
  private emitToJob(
    jobId: string,
    type: SocketLogEvent['type'],
    data: string | number | { downloadUrl: string } | { error: string }
  ): void {
    const event: SocketLogEvent = {
      type,
      jobId,
      data,
    };

    this.io.to(`job:${jobId}`).emit(type, event);
  }

  /**
   * Start generation process for a job
   */
  private async startGeneration(jobId: string): Promise<void> {
    try {
      await this.generatorService.processJob(
        jobId,
        (progress: number) => {
          this.emitToJob(jobId, 'progress', progress);
        },
        (log: string) => {
          this.emitToJob(jobId, 'log', log);
        }
      );

      const job = this.generatorService.getJob(jobId);
      if (job?.status === 'completed' && job.downloadUrl) {
        this.emitToJob(jobId, 'done', { downloadUrl: job.downloadUrl });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.emitToJob(jobId, 'error', { error: errorMessage });
    }
  }

  /**
   * Get Socket.IO instance (for advanced usage)
   */
  getIO(): SocketServer {
    return this.io;
  }
}

