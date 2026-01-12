import { Router, Request, Response } from 'express';
import { z } from 'zod';
import path from 'path';
import fs from 'fs/promises';
import { GeneratorService } from '../generator/generatorService.js';
import { validateGenerationRequest, GenerationRequest, DOMAINS, SERVICES } from '../config/staticConfig.js';
import { config } from '../config/index.js';

import { generationLimiter } from '../middleware/rateLimitMiddleware.js';
import { metricsService } from '../services/metricsService.js';

/**
 * Generation API Routes
 */

const generationSchema = z.object({
  domain: z.string(),
  service: z.string(),
  serviceType: z.enum(['frontend', 'backend', 'infra']),
  stack: z.string(),
  version: z.string(),
  serviceName: z.string().optional(),
  port: z.number().int().positive().optional(),
  dbUrl: z.string().optional(),
  jwtSecret: z.string().optional(),
});

export function createGenerationRoutes(generatorService: GeneratorService): Router {
  const router = Router();

  /**
   * POST /generate
   * Create a new generation job
   */

  /**
   * POST /generate
   * Create a new generation job
   */
  router.post('/generate', generationLimiter, async (req: Request, res: Response) => {
    const startTime = Date.now();
    try {
      // Validate request body
      const validated = generationSchema.safeParse(req.body);
      if (!validated.success) {
        metricsService.recordGeneration(false, Date.now() - startTime);
        return res.status(400).json({
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: validated.error.errors,
        });
      }

      const request = validated.data as GenerationRequest;

      // Validate against static config
      const validation = validateGenerationRequest(request);
      if (!validation.valid) {
        metricsService.recordGeneration(false, Date.now() - startTime);
        return res.status(400).json({
          success: false,
          code: 'COMPATIBILITY_ERROR',
          message: validation.error || 'Invalid service configuration',
        });
      }

      // Create job
      const job = generatorService.createJob(request);
      metricsService.recordGeneration(true, Date.now() - startTime);

      res.status(201).json({
        success: true,
        data: {
          jobId: job.id,
          status: job.status,
          message: 'Generation job created',
        },
      });
      return;
    } catch (error) {
      metricsService.recordGeneration(false, Date.now() - startTime);
      console.error('Error creating generation job:', error);
      res.status(500).json({
        success: false,
        code: 'INTERNAL_ERROR',
        message: 'Failed to create generation job',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
      return;
    }
  });

  /**
   * GET /jobs/:jobId
   * Get job status
   */
  router.get('/jobs/:jobId', async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const job = generatorService.getJob(jobId);

      if (!job) {
        return res.status(404).json({
          error: 'Job not found',
        });
      }

      res.json({
        id: job.id,
        status: job.status,
        progress: job.progress,
        downloadUrl: job.downloadUrl,
        error: job.error,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
      });
      return;
    } catch (error) {
      console.error('Error getting job status:', error);
      res.status(500).json({
        error: 'Failed to get job status',
      });
      return;
    }
  });

  /**
   * GET /download/:jobId
   * Download generated ZIP file
   */
  router.get('/download/:jobId', async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const job = generatorService.getJob(jobId);

      if (!job) {
        return res.status(404).json({
          error: 'Job not found',
        });
      }

      if (job.status !== 'completed' || !job.downloadUrl) {
        return res.status(400).json({
          error: 'Job not completed or download not available',
        });
      }

      const zipPath = path.join(config.generatedDir, `${jobId}.zip`);

      try {
        await fs.access(zipPath);
      } catch {
        return res.status(404).json({
          error: 'ZIP file not found',
        });
      }

      const serviceName = job.request.serviceName || job.request.service;
      res.download(zipPath, `${serviceName}.zip`, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          if (!res.headersSent) {
            res.status(500).json({
              error: 'Failed to download file',
            });
            return;
          }
        }
      });
      return;
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).json({
        error: 'Failed to download file',
      });
      return;
    }
  });

  /**
   * GET /config
   * Get available configuration (domains, services, stacks, versions)
   */
  router.get('/config', (_req: Request, res: Response) => {
    res.json({
      domains: DOMAINS,
      services: SERVICES.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        domains: s.domains,
        serviceType: s.serviceType,
        allowedStacks: s.allowedStacks.map(stack => ({
          id: stack.id,
          name: stack.name,
          versions: stack.versions,
        })),
      })),
    });
  });

  return router;
}

