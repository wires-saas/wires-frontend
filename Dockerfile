FROM nginx:latest

COPY --chown=65534:65534 dist/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
