# Stage 1: Serve with lightweight nginx
FROM nginx:1.27-alpine

# Security: run as non-root
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy site files
COPY . /usr/share/nginx/html/

# Remove non-production files
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/docker-compose.yml \
          /usr/share/nginx/html/server.js \
          /usr/share/nginx/html/package.json \
          /usr/share/nginx/html/.dockerignore \
          /usr/share/nginx/html/download_images.js \
          /usr/share/nginx/html/start-firewall.bat && \
    rm -rf /usr/share/nginx/html/.claude \
           /usr/share/nginx/html/.vscode \
           /usr/share/nginx/html/flight-booking

# Custom nginx config for SPA
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(css|js|jpg|jpeg|png|gif|svg|ico|woff|woff2)$ { \
        expires 30d; \
        add_header Cache-Control "public, immutable"; \
    } \
    gzip on; \
    gzip_types text/css application/javascript image/svg+xml; \
}' > /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=5s CMD wget -q --spider http://localhost:80/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
