# Imagen base de PHP con Apache
FROM php:8.2-apache

# Instalar extensiones de PostgreSQL para PHP y utilidades necesarias
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Habilitar módulos de Apache necesarios
RUN a2enmod headers rewrite

# Copiar el código del backend al contenedor
COPY backend/ /var/www/html/

# Instalar dependencias PHP (PHPMailer)
RUN cd /var/www/html && composer install --no-dev --optimize-autoloader

# Configurar permisos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto de Apache
CMD ["apache2-foreground"]
