# Nginx Load Balancer Configuration

Nginx configuration for load balancing multiple backend servers.

## Usage

1. Copy `nginx.conf` to your Nginx configuration directory
2. Update placeholders and add backend servers
3. Reload Nginx

## Load Balancing Method

Uses `least_conn` - distributes requests to server with least active connections.

## Features

- Load balancing across multiple backends
- Health checks and automatic failover
- Request headers forwarding
- WebSocket support
- Configurable weights and failover settings

## Configuration

Add backend servers in the `upstream` block:

```nginx
upstream backend {
    least_conn;
    server backend1:3000 weight=1 max_fails=3 fail_timeout=30s;
    server backend2:3000 weight=1 max_fails=3 fail_timeout=30s;
    server backend3:3000 weight=1 max_fails=3 fail_timeout=30s;
}
```

---

Generated for domain: {{DOMAIN}}
Stack: {{STACK}} {{VERSION}}

