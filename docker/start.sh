#!/bin/sh
set -e

# Render injects the port to listen on via $PORT (defaults to 10000 locally)
PORT="${PORT:-8000}"
sed -i "s/PORT_PLACEHOLDER/${PORT}/" /etc/nginx/nginx.conf

# Cache Laravel config/routes for production speed (safe to skip locally if you prefer)
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec /usr/bin/supervisord -c /etc/supervisord.conf  