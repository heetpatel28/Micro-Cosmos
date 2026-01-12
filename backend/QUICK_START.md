# Quick Start Guide

## Prerequisites

- Node.js 20+ installed
- npm or yarn

## Setup (First Time)

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Create environment file:**
   Create `.env` file in `server/` directory with:
   ```env
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   TEMP_DIR=./temp
   TEMPLATES_DIR=./templates
   GENERATED_DIR=./generated
   ```

3. **Create required directories:**
   The server will create these automatically, but you can create them manually:
   ```bash
   mkdir temp generated
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## Testing

### 1. Health Check
```bash
curl http://localhost:3001/api/health
```

### 2. Get Configuration
```bash
curl http://localhost:3001/api/config
```

### 3. Generate a Service

```bash
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "E-Commerce",
    "service": "auth",
    "serviceType": "backend",
    "stack": "node",
    "version": "20",
    "serviceName": "test-auth-service",
    "port": 3000
  }'
```

This returns a `jobId`. Save it for the next steps.

### 4. Check Job Status
```bash
curl http://localhost:3001/api/jobs/{jobId}
```

### 5. Download Generated ZIP
```bash
curl http://localhost:3001/api/download/{jobId} -o my-service.zip
```

### 6. Test Generated Service

```bash
# Extract ZIP
unzip my-service.zip
cd test-auth-service

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env as needed

# Run the service
npm run dev

# Test health endpoint
curl http://localhost:3000/health
```

## WebSocket Connection

Use any Socket.io client:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

// Subscribe to job updates
socket.emit('subscribe', 'your-job-id');

// Listen for events
socket.on('log', (event) => console.log('Log:', event.data));
socket.on('progress', (event) => console.log('Progress:', event.data + '%'));
socket.on('done', (event) => console.log('Done:', event.data.downloadUrl));
socket.on('error', (event) => console.error('Error:', event.data.error));
```

## Troubleshooting

### Port already in use
Change `PORT` in `.env` file

### Template not found
Ensure template exists at: `templates/backend/node/20/auth/`

### ZIP download fails
Check that job status is "completed" before downloading

### WebSocket connection fails
Ensure `CORS_ORIGIN` in `.env` matches your frontend URL

