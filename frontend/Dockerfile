FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build with environment variable for API URL
# We set this to /api so that requests go to the same host (handled by Nginx gateway)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build artifacts
COPY --from=builder /app/dist /usr/share/nginx/html

# Add custom nginx config for the frontend internal server if necessary
# For now default is fine as it serves index.html on port 80
# But for SPA we might need try_files... 
# Actually, the Gateway Nginx handles traffic. But if Gateway proxies / -> Frontend, 
# Frontend Nginx needs to return index.html for unknown routes too (for SPA navigation).
# Let's create a simple internal config.

RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
