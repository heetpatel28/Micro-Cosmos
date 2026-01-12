# Nginx Reverse Proxy Configuration

Nginx configuration for reverse proxying backend API.

## Usage

1. Copy `nginx.conf` to your Nginx configuration directory
2. Update placeholders:
   - `{{DB_URL}}` → Backend host (e.g., `localhost` or `backend`)
   - `{{PORT}}` → Backend port (e.g., `3000`)

3. Reload Nginx:
```bash
nginx -t
nginx -s reload
```

## Features

- Reverse proxy for `/api` routes
- Health check endpoint proxying
- Request headers forwarding
- Timeout configuration
- Connection upgrades support (WebSocket)

## Example

After replacement:
```nginx
upstream backend {
    server localhost:3000;
}
```

---

Generated for domain: {{DOMAIN}}
Stack: {{STACK}} {{VERSION}}

