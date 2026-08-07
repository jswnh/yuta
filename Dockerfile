# ---- Stage 1: build frontend assets (Vite) ----
FROM node:22-alpine AS assets

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# ---- Stage 2: PHP application ----
FROM php:8.5-fpm-alpine

# System deps + PHP extensions Laravel commonly needs
RUN apk add --no-cache \
        nginx \
        supervisor \
        git \
        curl \
        bash \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        libzip-dev \
        zip \
        unzip \
        icu-dev \
        oniguruma-dev \
        postgresql-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j1 pdo \
    && docker-php-ext-install -j1 pdo_pgsql \
    && docker-php-ext-install -j1 pdo_mysql \
    && docker-php-ext-install -j1 mbstring \
    && docker-php-ext-install -j1 zip \
    && docker-php-ext-install -j1 gd \
    && docker-php-ext-install -j1 intl \
    && docker-php-ext-install -j1 bcmath
    # opcache omitted: currently broken on the official php:8.5-fpm-alpine image
    # (https://github.com/docker-library/php/issues/1631) — not required for Laravel to run

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install PHP deps first (better layer caching)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy the rest of the app
COPY . .

# Bring in the compiled frontend assets from the Node build stage
COPY --from=assets /app/public/build /var/www/html/public/build

RUN composer dump-autoload --optimize \
    && mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Nginx + PHP-FPM + Supervisor config
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/zz-docker.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8000

CMD ["/start.sh"]