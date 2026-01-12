# Docker Compose: Full Stack

Docker Compose configuration for full-stack application (frontend + backend + database).

## Usage

1. Copy this template to your project root
2. Place backend code in `./backend` directory
3. Place frontend code in `./frontend` directory
4. Update environment variables in `.env` file
5. Run:

```bash
docker-compose up -d
```

## Environment Variables

Create `.env` file:

```env
BACKEND_PORT=3000
FRONTEND_PORT=5173
ENV=production
DB_NAME={{SERVICE_NAME}}
DB_USER=postgres
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET={{JWT_SECRET}}
```

## Services

- **database**: PostgreSQL 15
- **backend**: Backend API service
- **frontend**: Frontend UI service (Nginx)

## Access

- Frontend: http://localhost:${FRONTEND_PORT}
- Backend API: http://localhost:${BACKEND_PORT}
- Database: localhost:${DB_PORT}

## Notes

- Frontend proxies API requests to backend
- All services have health checks
- Data is persisted in Docker volume

