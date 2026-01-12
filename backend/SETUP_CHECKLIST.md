# Setup Checklist

Use this checklist to verify your Phase 1 backend setup is complete.

## ✅ Files to Verify

### Core Backend Files
- [x] `server/package.json` - Dependencies configured
- [x] `server/tsconfig.json` - TypeScript config
- [x] `server/.gitignore` - Git ignore rules
- [ ] `server/.env` - **CREATE THIS** (see below)

### Source Code
- [x] `server/src/index.ts` - Server entry point
- [x] `server/src/config/index.ts` - Config loader
- [x] `server/src/config/staticConfig.ts` - Services/stacks config
- [x] `server/src/types/generation.ts` - Type definitions
- [x] `server/src/services/generatorService.ts` - Generator service
- [x] `server/src/services/templateEngine.ts` - Template engine
- [x] `server/src/services/websocketService.ts` - WebSocket service
- [x] `server/src/routes/generationRoutes.ts` - Generation API
- [x] `server/src/routes/healthRoutes.ts` - Health check

### Template
- [x] `server/templates/backend/node/20/auth/` - Template directory
- [x] `server/templates/backend/node/20/auth/package.json`
- [x] `server/templates/backend/node/20/auth/tsconfig.json`
- [x] `server/templates/backend/node/20/auth/Dockerfile`
- [x] `server/templates/backend/node/20/auth/.dockerignore`
- [x] `server/templates/backend/node/20/auth/README.md`
- [x] `server/templates/backend/node/20/auth/src/index.ts`
- [x] `server/templates/backend/node/20/auth/src/routes/auth.ts`
- [x] `server/templates/backend/node/20/auth/src/routes/health.ts`
- [ ] `server/templates/backend/node/20/auth/.env.example` - **OPTIONAL** (template file)

## 🔧 Setup Steps

### 1. Create Environment File

Create `server/.env` with:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
TEMP_DIR=./temp
TEMPLATES_DIR=./templates
GENERATED_DIR=./generated
```

**Note:** Create this file manually (it's gitignored for security).

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Create Directories (optional - auto-created)

The server will create these automatically, but you can create them manually:

```bash
mkdir temp generated
```

### 4. Verify Template Structure

Ensure template exists at:
```
server/templates/backend/node/20/auth/
```

### 5. Test the Server

```bash
npm run dev
```

Expected output:
```
╔═══════════════════════════════════════════════════════════╗
║   Microservice Generator - Backend Server                ║
╚═══════════════════════════════════════════════════════════╝

🚀 Server running on port 3001
📡 WebSocket ready for real-time updates
...
```

### 6. Test Health Endpoint

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 0.123
}
```

### 7. Test Config Endpoint

```bash
curl http://localhost:3001/api/config
```

Should return domains, services, stacks, and versions.

## ✅ Verification Complete

Once all steps pass, your Phase 1 backend is ready! 

Next: Connect the frontend dashboard or test generation manually.

