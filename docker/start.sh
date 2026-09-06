#!/bin/sh
set -e

# Render injects the port to listen on via $PORT (defaults to 10000 locally)
PORT="${PORT:-8000}"
sed -i "s/PORT_PLACEHOLDER/${PORT}/" /etc/nginx/nginx.conf

# Ensure storage directories exist
mkdir -p /var/www/html/storage/framework/sessions \
         /var/www/html/storage/framework/views \
         /var/www/html/storage/framework/cache \
         /var/www/html/storage/logs \
         /var/www/html/bootstrap/cache

# Cache Laravel config/routes for production speed
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Ensure www-data ownership of storage and bootstrap cache
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

exec /usr/bin/supervisord -c /etc/supervisord.conf  