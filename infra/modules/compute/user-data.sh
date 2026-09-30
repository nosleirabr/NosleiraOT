#!/usr/bin/env bash
# Bootstrap da VM do OT 7.4: instala Docker, UFW, fail2ban e agenda backup.
# Roda uma vez via user-data da DigitalOcean (cloud-init).
set -euo pipefail

ENV_NAME="${env}"

# Atualiza pacotes e instala dependências básicas.
apt-get update -y
apt-get install -y docker.io docker-compose-plugin ufw fail2ban cron

# Ativa o Docker no boot.
systemctl enable --now docker

# Superfície mínima: 22/80/443/7171/7172 (ver docs/INFRA_ARCHITECTURE.md).
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 7171/tcp
ufw allow 7172/tcp
ufw --force enable

# Proteção contra brute-force no SSH (senha desabilitada, só chave).
systemctl enable --now fail2ban

# Pasta do deploy (o compose e o .env chegam via deploy, nunca via Git).
mkdir -p "/opt/ot74/$ENV_NAME"

# Cron de backup do MySQL a cada 12h (destino externo configurado no deploy).
cat >/etc/cron.d/ot74-backup <<CRON
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
0 */12 * * * root /opt/ot74/backup-mysql.sh >>/var/log/ot74-backup.log 2>&1
CRON

echo "bootstrap ot74 ($ENV_NAME) concluido"
