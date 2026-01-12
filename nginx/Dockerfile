FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create directory for cache/temp files if needed
RUN mkdir -p /var/cache/nginx/client_temp

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
