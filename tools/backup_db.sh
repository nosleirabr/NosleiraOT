#!/bin/bash
# Script de Backup Automatico MariaDB Docker
BACKUP_DIR="/srv/backups"
TIMESTAMP=\
CONTAINER_NAME="database_server"
DB_USER="ot74"
DB_PASS="sua_senha_aqui" # sera substituido no bash
DB_NAME="ot74"

mkdir -p \
echo "Iniciando backup..."
docker exec \ /usr/bin/mysqldump -u \ -p\ \ > \/backup_\.sql
gzip \/backup_\.sql
echo "Backup \ concluido com sucesso!"
