# Infra como código — OT 7.4 (M5 #43)

Provisiona `dev`, `staging` e `prod` na DigitalOcean via Terraform + Terragrunt.
Arquitetura alvo em `docs/INFRA_ARCHITECTURE.md`. Sem segredos no Git.

## O que existe

```text
infra/
├── terragrunt.hcl      # remote state (Spaces/S3) + provider gerado
├── root/               # stack compartilhada (compute + firewall + dns + backups)
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── versions.tf
├── modules/
│   ├── compute/        # Droplet + SSH key + user-data (docker, UFW, fail2ban, cron)
│   ├── firewall/       # portas 22/80/443/7171/7172, resto fechado
│   ├── dns/            # zona + A (@, www, game)
│   └── backups/        # bucket Spaces por ambiente
├── live/
│   ├── dev/terragrunt.hcl      # s-1vcpu-1gb, sem domínio
│   ├── staging/terragrunt.hcl  # s-1vcpu-2gb, domínio de homologação
│   └── prod/terragrunt.hcl     # s-2vcpu-4gb, SSH restrito, domínio oficial
└── README.md
```

## Pré-requisitos

- Conta DigitalOcean com token (`DIGITALOCEAN_TOKEN`), nunca no Git.
- Bucket do state (`TF_STATE_BUCKET`, padrão `ot74-tfstate`) + `SPACES_REGION` (padrão `nyc3`).
- Chave SSH pública em `TF_VAR_ssh_public_key` (privada fica só na sua máquina).
- Domínios por env (opcional): `TF_VAR_staging_domain`, `TF_VAR_prod_domain`.
- Terraform >= 1.9 e Terragrunt >= 0.70 instalados.

## Remote state

Cada env tem sua key (`dev/`, `staging/`, `prod/`). O backend S3 aponta para o Spaces:

```powershell
$env:DIGITALOCEAN_TOKEN="..."
$env:SPACES_ACCESS_ID="..."
$env:SPACES_SECRET_KEY="..."
$env:TF_STATE_BUCKET="ot74-tfstate"
$env:SPACES_REGION="nyc3"
$env:TF_VAR_ssh_public_key="ssh-ed25519 AAAA..."
```

## Plan (sem apply automático)

```powershell
cd infra/live
terragrunt run-all plan --non-interactive
```

O CI (`infra-plan.yml`) roda `fmt -check`, `validate` e `plan`. Apply é manual:

```powershell
cd infra/live/prod
terragrunt apply
```

## Subir um ambiente do zero

1. Exportar as variáveis acima.
2. `cd infra/live/dev` (ou `staging`/`prod`) + `terragrunt apply`.
3. Anotar o `droplet_ip` do output.
4. Deploy do jogo via `docker compose up -d --build` na VM (ver `docs/BOOTSTRAP.md`).
5. Apontar Cloudflare para o IP (proxy no 80/443, TCP direto no 7171/7172).
6. Conferir UFW/fail2ban e o cron de backup (`/etc/cron.d/ot74-backup`).

## Portas (justificativa curta)

| Porta | Uso | Proteção |
|-------|-----|----------|
| 22 | SSH | só chave + fail2ban, em prod restringir CIDR |
| 80/443 | site MyAAC | via Cloudflare, 80 só para ACME/redirect |
| 7171/7172 | login/game Tibia | rate-limit no UFW |
| 3306 | MySQL | **não exposta** — só rede interna do Docker |
