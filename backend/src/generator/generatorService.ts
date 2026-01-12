import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/index.js';
import { GenerationRequest } from '../config/staticConfig.js';
import { GenerationJob } from '../types/generation.js';
import { TemplateEngine, ReplacementValues } from './templateEngine.js';

/**
 * Generator Service - Orchestrates the microservice generation process
 */

export class GeneratorService {
  private templateEngine: TemplateEngine;
  private jobs: Map<string, GenerationJob> = new Map();

  constructor() {
    this.templateEngine = new TemplateEngine();
  }

  /**
   * Create a new generation job
   */
  createJob(request: GenerationRequest): GenerationJob {
    const job: GenerationJob = {
      id: uuidv4(),
      request,
      status: 'pending',
      progress: 0,
      logs: [],
      createdAt: new Date(),
    };

    this.jobs.set(job.id, job);
    return job;
  }

  /**
   * Get job by ID
   */
  getJob(jobId: string): GenerationJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Update job status and emit logs via callback
   */
  private async updateJob(
    jobId: string,
    updates: Partial<GenerationJob>,
    logCallback?: (log: string) => void
  ): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    Object.assign(job, updates);

    if (updates.logs) {
      const newLogs = updates.logs.slice(job.logs.length);
      newLogs.forEach(log => {
        if (logCallback) logCallback(log);
      });
    }

    this.jobs.set(jobId, job);
  }

  /**
   * Generate default replacement values from request
   */
  private getDefaultValues(request: GenerationRequest): ReplacementValues {
    const serviceName = request.serviceName ||
      `${request.service}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    return {
      serviceName,
      port: request.port || 3000,
      dbUrl: request.dbUrl || 'mongodb://localhost:27017/mydb',
      jwtSecret: request.jwtSecret || this.generateRandomSecret(),
      env: process.env.NODE_ENV || 'development',
      nodeVersion: request.stack === 'node' ? request.version : undefined,
      domain: request.domain,
      stack: request.stack,
      version: request.version,
    };
  }

  /**
   * Generate random secret for JWT
   */
  private generateRandomSecret(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Process generation job
   */
  async processJob(
    jobId: string,
    progressCallback?: (progress: number) => void,
    logCallback?: (log: string) => void
  ): Promise<string> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    let workingDir = '';

    try {
      await this.updateJob(jobId, { status: 'processing', progress: 0 }, logCallback);

      // Step 1: Validate template exists
      const log = (msg: string) => {
        job.logs.push(msg);
        if (logCallback) logCallback(msg);
      };

      log('🔍 Validating template...');
      const templateExists = await this.templateEngine.templateExists(job.request);
      if (!templateExists) {
        // DEBUG LOGGING
        const debugPath = path.join(config.templatesDir, job.request.serviceType, job.request.stack, job.request.version, job.request.service);
        console.log(`❌ Debug: Config Templates Dir: ${config.templatesDir}`);
        console.log(`❌ Debug: Calculated Path: ${debugPath}`);

        try {
          const fs = await import('fs/promises');
          const parentDir = path.dirname(debugPath);
          console.log(`❌ Debug: Checking parent dir: ${parentDir}`);

          try {
            const contents = await fs.readdir(parentDir);
            console.log(`❌ Debug: Parent dir contents: ${contents.join(', ')}`);
          } catch (e) {
            console.log(`❌ Debug: Failed to read parent dir: ${e}`);
            // If parent doesn't exist, try grandparent
            const grandParent = path.dirname(parentDir);
            const grandContents = await fs.readdir(grandParent).catch(err => [`Error: ${err}`]);
            console.log(`❌ Debug: Grandparent (${grandParent}) contents: ${grandContents.join(', ')}`);
          }
        } catch (e) {
          console.log(`❌ Debug: General FS error: ${e}`);
        }

        const error = new Error(`Template not found for ${job.request.service}`);
        (error as any).code = 'TEMPLATE_NOT_FOUND';
        throw error;
      }
      if (progressCallback) progressCallback(10);

      // Step 2: Create working directory
      log('📁 Creating working directory...');
      // Ensure unique isolated directory
      workingDir = path.join(config.tempDir, jobId);

      // Safety check: ensure we are writing to temp dir
      if (!path.resolve(workingDir).startsWith(path.resolve(config.tempDir))) {
        const error = new Error('Security Error: Invalid working directory path');
        (error as any).code = 'SECURITY_ERROR';
        throw error;
      }

      await fs.mkdir(workingDir, { recursive: true });
      if (progressCallback) progressCallback(20);

      // Step 3: Generate files from template
      log('⚙️  Generating files from template...');
      const values = this.getDefaultValues(job.request);

      try {
        await this.templateEngine.generate(job.request, workingDir, values);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        (error as any).code = 'GENERATION_FAILED';
        throw error;
      }

      log(`✅ Generated ${values.serviceName}`);
      if (progressCallback) progressCallback(60);

      // Step 4: Create ZIP archive
      log('📦 Creating ZIP archive...');
      const zipPath = await this.createZipArchive(workingDir, jobId);
      if (progressCallback) progressCallback(80);

      // Step 5: Move ZIP to generated directory
      log('💾 Saving generated package...');
      const finalZipPath = path.join(config.generatedDir, `${jobId}.zip`);
      await fs.mkdir(config.generatedDir, { recursive: true });
      await fs.copyFile(zipPath, finalZipPath);
      await fs.unlink(zipPath);
      if (progressCallback) progressCallback(90);

      // Step 6: Cleanup working directory
      log('🧹 Cleaning up temporary files...');
      await fs.rm(workingDir, { recursive: true, force: true });
      if (progressCallback) progressCallback(100);

      // Step 7: Update job status
      const downloadUrl = `/api/download/${jobId}`;
      await this.updateJob(jobId, {
        status: 'completed',
        progress: 100,
        downloadUrl,
        completedAt: new Date(),
      }, logCallback);

      log('✅ Generation complete!');
      return downloadUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorCode = (error as any).code || 'INTERNAL_ERROR';

      await this.updateJob(jobId, {
        status: 'failed',
        error: errorMessage,
        errorCode: errorCode,
        completedAt: new Date(),
      }, logCallback);

      if (logCallback) {
        logCallback(`❌ Error: ${errorMessage}`);
      }

      // Cleanup on error
      if (workingDir) {
        try {
          await fs.rm(workingDir, { recursive: true, force: true });
        } catch {
          // Ignore cleanup errors
        }
      }

      throw error;
    }
  }

  /**
   * Create ZIP archive from directory
   */
  private async createZipArchive(sourceDir: string, jobId: string): Promise<string> {
    const archiver = (await import('archiver')).default;
    const outputPath = path.join(config.tempDir, `${jobId}.zip`);

    return new Promise((resolve, reject) => {
      const output = fsSync.createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        resolve(outputPath);
      });

      archive.on('error', (err: Error) => {
        reject(err);
      });

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }

  /**
   * Cleanup old jobs (older than 1 hour)
   */
  async cleanupOldJobs(): Promise<void> {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    for (const [jobId, job] of this.jobs.entries()) {
      if (job.createdAt.getTime() < oneHourAgo) {
        // Delete ZIP file if exists
        if (job.downloadUrl) {
          const zipPath = path.join(config.generatedDir, `${jobId}.zip`);
          try {
            await fs.unlink(zipPath);
          } catch {
            // Ignore if file doesn't exist
          }
        }

        this.jobs.delete(jobId);
      }
    }
  }
}

