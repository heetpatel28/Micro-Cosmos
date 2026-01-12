import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  tempDir: path.resolve(process.env.TEMP_DIR || path.join(__dirname, '../../temp')),
  templatesDir: path.resolve(process.env.TEMPLATES_DIR || path.join(__dirname, '../../templates')),
  generatedDir: path.resolve(process.env.GENERATED_DIR || path.join(__dirname, '../../generated')),
};

