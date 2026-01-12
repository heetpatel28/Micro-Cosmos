import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/index.js';
import { GenerationRequest, getTemplatePath } from '../config/staticConfig.js';

/**
 * Template Engine - Handles template file copying and placeholder replacement.
 * 
 * SECURITY: This engine ONLY:
 * - Copies files from whitelisted template directories
 * - Replaces known placeholders
 * - NEVER executes code
 * - NEVER generates logic
 */

const PLACEHOLDERS = {
  SERVICE_NAME: '{{SERVICE_NAME}}',
  PORT: '{{PORT}}',
  DB_URL: '{{DB_URL}}',
  JWT_SECRET: '{{JWT_SECRET}}',
  ENV: '{{ENV}}',
  NODE_VERSION: '{{NODE_VERSION}}',
  DOMAIN: '{{DOMAIN}}',
  STACK: '{{STACK}}',
  VERSION: '{{VERSION}}',
} as const;

export interface ReplacementValues {
  serviceName: string;
  port: number;
  dbUrl?: string;
  jwtSecret?: string;
  env?: string;
  nodeVersion?: string;
  domain?: string;
  stack?: string;
  version?: string;
}

export class TemplateEngine {
  /**
   * Get the full template directory path
   */
  private getTemplateDir(request: GenerationRequest): string {
    const templatePath = getTemplatePath(
      request.serviceType,
      request.stack,
      request.version,
      request.service
    );
    return path.join(config.templatesDir, templatePath);
  }

  /**
   * Validate that template directory exists and is within allowed paths
   */
  private async validateTemplatePath(templateDir: string): Promise<boolean> {
    const resolvedTemplate = path.resolve(templateDir);
    const resolvedBase = path.resolve(config.templatesDir);

    // Security: Ensure template path is within templates directory
    if (!resolvedTemplate.startsWith(resolvedBase)) {
      throw new Error('Invalid template path: outside templates directory');
    }

    try {
      const stat = await fs.stat(resolvedTemplate);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Replace placeholders in file content
   */
  private replacePlaceholders(content: string, values: ReplacementValues): string {
    let result = content;

    // Replace all placeholders
    result = result.replace(new RegExp(PLACEHOLDERS.SERVICE_NAME, 'g'), values.serviceName);
    result = result.replace(new RegExp(PLACEHOLDERS.PORT, 'g'), String(values.port));

    if (values.dbUrl) {
      result = result.replace(new RegExp(PLACEHOLDERS.DB_URL, 'g'), values.dbUrl);
    }

    if (values.jwtSecret) {
      result = result.replace(new RegExp(PLACEHOLDERS.JWT_SECRET, 'g'), values.jwtSecret);
    }

    if (values.env) {
      result = result.replace(new RegExp(PLACEHOLDERS.ENV, 'g'), values.env);
    }

    if (values.nodeVersion) {
      result = result.replace(new RegExp(PLACEHOLDERS.NODE_VERSION, 'g'), values.nodeVersion);
    }

    if (values.domain) {
      result = result.replace(new RegExp(PLACEHOLDERS.DOMAIN, 'g'), values.domain);
    }

    if (values.stack) {
      result = result.replace(new RegExp(PLACEHOLDERS.STACK, 'g'), values.stack);
    }

    if (values.version) {
      result = result.replace(new RegExp(PLACEHOLDERS.VERSION, 'g'), values.version);
    }

    return result;
  }

  /**
   * Copy directory recursively and replace placeholders in text files
   */
  private async copyDirectory(
    source: string,
    destination: string,
    values: ReplacementValues
  ): Promise<void> {
    await fs.mkdir(destination, { recursive: true });

    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(sourcePath, destPath, values);
      } else if (entry.isFile()) {
        const content = await fs.readFile(sourcePath, 'utf-8');
        const replaced = this.replacePlaceholders(content, values);
        await fs.writeFile(destPath, replaced, 'utf-8');
      }
    }
  }

  /**
   * Resolve template path with fallback mechanism
   */
  private async resolveTemplatePath(request: GenerationRequest): Promise<string> {
    const specificPath = this.getTemplateDir(request);

    // 1. Check if specific template exists
    if (await this.validateTemplatePath(specificPath)) {
      return specificPath;
    }

    // 2. Fallback based on service type
    let fallbackService = '';
    if (request.serviceType === 'backend') {
      fallbackService = 'crud-service';
    } else if (request.serviceType === 'frontend') {
      fallbackService = 'dashboard-ui';
    } else {
      // Infra has no generic fallback usually, but maybe 'docker-compose-backend'
      return specificPath; // Let it fail if specific infra missing
    }

    const fallbackRequest = { ...request, service: fallbackService };
    const fallbackPath = this.getTemplateDir(fallbackRequest);

    // 3. Check if fallback exists
    if (await this.validateTemplatePath(fallbackPath)) {
      console.log(`ℹ️ Template fallback: Using '${fallbackService}' for '${request.service}'`);
      return fallbackPath;
    }

    // 4. Return specific path (which will fail validation later)
    return specificPath;
  }

  /**
   * Generate project from template
   */
  async generate(
    request: GenerationRequest,
    outputDir: string,
    values: ReplacementValues
  ): Promise<void> {
    // Resolve path (specific or fallback)
    const templateDir = await this.resolveTemplatePath(request);

    // Security: Validate template path
    const isValid = await this.validateTemplatePath(templateDir);
    if (!isValid) {
      throw new Error(`Template not found: ${templateDir}`);
    }

    // Copy template to output directory with placeholder replacement
    await this.copyDirectory(templateDir, outputDir, values);
  }

  /**
   * Check if template exists (or fallback exists)
   */
  async templateExists(request: GenerationRequest): Promise<boolean> {
    const templateDir = await this.resolveTemplatePath(request);
    return this.validateTemplatePath(templateDir);
  }
}

