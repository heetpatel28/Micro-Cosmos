# Docker Compose: Backend + Database

Docker Compose configuration for backend service with PostgreSQL database.

## Usage

1. Copy this template to your project root
2. Update environment variables in `.env` file
3. Run:

```bash
docker-compose up -d
```

## Environment Variables

Create `.env` file:

```env
PORT={{PORT}}
ENV=production
DB_NAME={{SERVICE_NAME}}
DB_USER=postgres
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET={{JWT_SECRET}}
```

## Services

- **database**: PostgreSQL 15
- **backend**: Your backend service

## Notes

- Backend waits for database to be healthy before starting
- Data is persisted in Docker volume
- Health checks are configured for both services

