# Microservice Generator - Backend Server

Template-based microservice generator backend with WebSocket support for real-time generation updates.

## Features

- ✅ Template-based file generation (NO AI code generation)
- ✅ WebSocket real-time logs and progress
- ✅ Placeholder replacement system
- ✅ ZIP file generation
- ✅ Secure template validation
- ✅ RESTful API endpoints

## Quick Start

### Installation

```bash
cd server
npm install
```

### Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
TEMP_DIR=./temp
TEMPLATES_DIR=./templates
GENERATED_DIR=./generated
```

### Development

```bash
npm run dev
```

The server will start on port 3001.

### Production

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

```
GET /api/health
```

### Get Configuration

```
GET /api/config
```

Returns available domains, services, stacks, and versions.

### Create Generation Job

```
POST /api/generate
Content-Type: application/json

{
  "domain": "E-Commerce",
  "service": "auth",
  "serviceType": "backend",
  "stack": "node",
  "version": "20",
  "serviceName": "my-auth-service",
  "port": 3000
}
```

Returns:
```json
{
  "jobId": "uuid",
  "status": "pending",
  "message": "Generation job created"
}
```

### Get Job Status

```
GET /api/jobs/:jobId
```

### Download Generated ZIP

```
GET /api/download/:jobId
```

## WebSocket Events

Connect to the WebSocket server and subscribe to a job:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

// Subscribe to a job
socket.emit('subscribe', 'job-id');

// Listen for events
socket.on('log', (event) => {
  console.log('Log:', event.data);
});

socket.on('progress', (event) => {
  console.log('Progress:', event.data);
});

socket.on('done', (event) => {
  console.log('Download URL:', event.data.downloadUrl);
});

socket.on('error', (event) => {
  console.error('Error:', event.data.error);
});
```

## Template System

Templates are stored in `templates/` directory with the structure:

```
templates/
 └── {serviceType}/
      └── {stack}/
           └── {version}/
                └── {serviceId}/
                     └── [template files]
```

### Available Placeholders

- `{{SERVICE_NAME}}` - Service name
- `{{PORT}}` - Service port
- `{{DB_URL}}` - Database URL
- `{{JWT_SECRET}}` - JWT secret key
- `{{ENV}}` - Environment (development/production)
- `{{NODE_VERSION}}` - Node.js version
- `{{DOMAIN}}` - Business domain
- `{{STACK}}` - Technology stack
- `{{VERSION}}` - Stack version

### Adding New Templates

1. Create directory: `templates/{serviceType}/{stack}/{version}/{serviceId}/`
2. Add template files with placeholders
3. Update `src/config/staticConfig.ts` to include the new service/stack/version

## Security

- ✅ Template paths are validated (whitelist only)
- ✅ No code execution
- ✅ No eval() or similar functions
- ✅ Input sanitization via Zod
- ✅ Deterministic output

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration and static data
│   ├── routes/          # API routes
│   ├── services/        # Core services
│   │   ├── generatorService.ts
│   │   ├── templateEngine.ts
│   │   └── websocketService.ts
│   ├── types/           # TypeScript types
│   └── index.ts         # Entry point
├── templates/           # Template files
└── package.json
```

## Phase 1 Status

✅ Backend generator engine
✅ One working template (Node.js 20 Auth service)
✅ WebSocket logs
✅ ZIP download
✅ REST API endpoints
✅ Security validation

## Next Steps (Phase 2)

- [ ] Integrate with frontend dashboard
- [ ] Add more templates (Spring Boot, FastAPI, React, etc.)
- [ ] Enhanced error handling
- [ ] Job queue system
- [ ] Database integration (optional)

