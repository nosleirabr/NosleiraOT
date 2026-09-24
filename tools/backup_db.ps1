# Script PowerShell para Backup Local (Testando na maquina)
$BACKUP_DIR = ".\server\backups"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$CONTAINER_NAME = "database_server"

New-Item -ItemType Directory -Force -Path $BACKUP_DIR | Out-Null
Write-Host "Iniciando backup local via Docker..." -ForegroundColor Cyan

# Executa mysqldump no docker
docker exec $CONTAINER_NAME /usr/bin/mysqldump -u root -pot74 ot74 > "$BACKUP_DIR\backup_$TIMESTAMP.sql"

Write-Host "Backup concluido! Arquivo salvo em: $BACKUP_DIR\backup_$TIMESTAMP.sql" -ForegroundColor Green
