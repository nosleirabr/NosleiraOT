FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libzip-dev \
    libpng-dev \
    libfreetype6-dev \
    libxml2-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd --with-freetype
RUN docker-php-ext-install pdo pdo_mysql xml zip gd

# Habilitar módulos Apache necessários para segurança e rewrite
RUN a2enmod rewrite headers expires

# Esconder versão do Apache nas respostas HTTP
RUN echo "ServerTokens Prod" >> /etc/apache2/apache2.conf \
 && echo "ServerSignature Off" >> /etc/apache2/apache2.conf

# Hardening do PHP: esconder versão, desabilitar funções perigosas
RUN { \
    echo "expose_php = Off"; \
    echo "display_errors = Off"; \
    echo "log_errors = On"; \
    echo "error_log = /var/log/apache2/php_errors.log"; \
    echo "session.cookie_httponly = On"; \
    echo "session.cookie_samesite = Strict"; \
    echo "session.use_strict_mode = On"; \
    echo "disable_functions = exec,passthru,shell_exec,system,proc_open,popen,curl_multi_exec,show_source"; \
    echo "file_uploads = On"; \
    echo "upload_max_filesize = 10M"; \
    echo "post_max_size = 12M"; \
} > /usr/local/etc/php/conf.d/security.ini

# Remover página padrão do Apache (evita fingerprinting)
RUN rm -f /var/www/html/index.html
