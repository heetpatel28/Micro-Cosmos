FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies 
# Using npm ci for clean install
RUN npm ci

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Environment settings
ENV NODE_ENV=production
ENV PORT=4000
# User should provide JWT_SECRET in compose/env

# Expose internal port
EXPOSE 4000

# Start command (using built files)
CMD ["node", "dist/server.js"]
