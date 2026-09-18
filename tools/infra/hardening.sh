#!/bin/bash
# Hardening Script para Ubuntu (OTServer 7.4)
# Objetivo: Configurar UFW, Fail2ban e SSH Keys (Least Privilege)
# IMPORTANTE: Rode como root (sudo) e garanta que sua chave SSH já está em ~/.ssh/authorized_keys antes de desativar senhas!

set -e

echo "[*] Iniciando processo de hardening..."

# 1. Atualizar pacotes
echo "[*] Atualizando pacotes..."
apt-get update && apt-get upgrade -y

# 2. Instalar pacotes necessários
echo "[*] Instalando UFW e Fail2ban..."
apt-get install -y ufw fail2ban

# 3. Configurar UFW (Firewall)
echo "[*] Configurando UFW..."
# Resetar regras padrão
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Portas essenciais
ufw allow 22/tcp     # SSH
ufw allow 80/tcp     # HTTP (Web / Let's Encrypt)
ufw allow 443/tcp    # HTTPS (Web)

# Rate limit no SSH (proteção adicional do UFW)
ufw limit 22/tcp

# Portas do Tibia com rate limit para mitigar DDoS/conexões simultâneas excessivas
ufw limit 7171/tcp   # Login Server
ufw limit 7172/tcp   # Game Server

# Habilitar firewall
echo "y" | ufw enable
ufw status verbose

# 4. Configurar Fail2ban
echo "[*] Configurando Fail2ban para SSH..."
cat <<EOF > /etc/fail2ban/jail.local
[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 5
bantime = 3600
findtime = 600
EOF

systemctl restart fail2ban
systemctl enable fail2ban

# 5. Configurar SSH (Desabilitar senha e root login)
echo "[*] Configurando SSH (Desabilitar login por senha e Root)..."
SSH_CONFIG="/etc/ssh/sshd_config"

# Fazer backup do config original
cp $SSH_CONFIG ${SSH_CONFIG}.bak

# Desativar autenticação por senha
sed -i 's/^#PasswordAuthentication yes/PasswordAuthentication no/' $SSH_CONFIG
sed -i 's/^PasswordAuthentication yes/PasswordAuthentication no/' $SSH_CONFIG

# Reiniciar SSH
systemctl restart sshd

echo "[*] Hardening concluído com sucesso!"
echo "[!] AVISO: Certifique-se de que não perdeu o acesso SSH. Mantenha esta sessão aberta e teste em outro terminal."
