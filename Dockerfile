FROM nginx:1.25.0

COPY --chown=65534:65534 dist/ /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
