# Arquitetura de Infraestrutura e Segurança (M5)

Este documento define a topologia de implantação em produção do servidor Tibia 7.4, garantindo segurança (hardening), resiliência e boas práticas de infraestrutura como código (IaC).

## 1. Diagrama de Arquitetura

O ambiente de produção roda em uma única VM (Droplet) conteinerizada via Docker Compose, com o tráfego web protegido pela Cloudflare e o tráfego do jogo (TCP) recebendo as conexões diretas protegidas por firewall (UFW) e Fail2Ban.

```mermaid
flowchart TD
    %% Atores
    Player[Jogador / Cliente Tibia]
    WebUser[Usuário Web]
    Admin[Administrador]

    %% Borda / Proxy
    CF[Cloudflare CDN / WAF]

    %% Servidor (VM)
    subgraph VM [VM Prod (ex: DigitalOcean Droplet)]
        UFW[Firewall UFW + Fail2Ban]
        
        subgraph Docker [Docker Network: otserver74_default]
            MyAAC[Container: ot74-myaac\nApache/PHP]
            TFS[Container: ot74-tfs\nTFS 1.2 Engine]
            DB[(Container: ot74-mysql\nMariaDB 10.11)]
        end
        
        Cron[Cronjobs de Backup]
    end

    %% Storage externo
    S3[(S3 / Object Storage\nBackups Externos)]

    %% Conexões
    WebUser -->|HTTPS :443| CF
    CF -->|HTTP :80| UFW
    Player -->|TCP :7171 / :7172| UFW
    Admin -->|SSH :22| UFW

    UFW -->|Redireciona :80| MyAAC
    UFW -->|Redireciona :7171/7172| TFS

    MyAAC -->|Lê/Escreve :3306| DB
    TFS -->|Lê/Escreve :3306| DB

    Cron -.->|mysqldump| DB
    Cron -->|Uploads Diários| S3
```

## 2. Portas e Superfície de Ataque

Seguindo o princípio de menor privilégio (*Least Privilege*), apenas as portas estritamente necessárias são abertas para a internet pública através do firewall (UFW) e dos Security Groups da nuvem. O banco de dados fica isolado e inacessível externamente.

| Porta | Protocolo | Serviço | Justificativa / Proteção |
|-------|-----------|---------|--------------------------|
| **22** | TCP | SSH | Necessário para gestão da VM. Protegido por autenticação via chave RSA/Ed25519 (senha desabilitada) e monitorado pelo Fail2Ban contra brute-force. |
| **80** | TCP | HTTP / Web | Entrada para o site (MyAAC). Redirecionado para 443 via Cloudflare. Usado também para renovação de certificado Let's Encrypt (ACME). |
| **443** | TCP | HTTPS / Web | Tráfego web seguro. Coberto por proxy reverso da Cloudflare com mitigação de DDoS ativa. |
| **7171** | TCP | Tibia Login | Porta padrão do protocolo Tibia (Login Server e status). Regras de Rate-Limiting no IPTables/UFW para evitar ataques de exaustão de conexões. |
| **7172** | TCP | Tibia Game | Porta padrão de Game Server. Aceita o tráfego pós-login. Rate-Limiting aplicado. |

> **Nota de Segurança:** A porta **3306** (MySQL) **não** é publicada para o host host. Ela só existe na rede interna do Docker (`otserver74_default`), permitindo que apenas o TFS e o MyAAC conversem com o banco de dados.

## 3. Gestão de Segredos (Secrets Management)

Não colocamos senhas, chaves de API ou tokens dentro do código-fonte (Git).

1. **Repositório:** O GitHub contém apenas os templates (ex: `.env.example`).
2. **Ambiente:** Em produção, os segredos são injetados em um arquivo `.env` na raiz da pasta do deploy.
3. **Docker Compose:** O Compose lê o `.env` e injeta como variáveis de ambiente para os containers de forma efêmera e protegida.
4. **Infraestrutura como Código:** Futuramente (via Terraform/Terragrunt), esses segredos poderão ser extraídos de um cofre (ex: HashiCorp Vault ou GitHub Secrets) diretamente para a VM no momento do *apply*.

## 4. Estratégia de Backup e Desastres

Para garantir que não haja perda de contas de jogadores e progresso em caso de falha catastrófica da VM:

1. **O Que é Feito Backup:**
   - Dump completo do MySQL (contas, personagens, casas, guildas).
   - Diretórios montados e dinâmicos (caso o mapa original seja modificado em runtime).
2. **Periodicidade:**
   - Script rodando via `cron` na VM: 1 vez a cada 12 horas para o banco de dados.
3. **Retenção e Destino:**
   - O arquivo compactado (`.tar.gz` ou `.sql.gz`) é enviado automaticamente via CLI para um armazenamento externo (Ex: S3 Bucket, DigitalOcean Spaces, ou Google Drive via rclone).
   - Mantém-se um ciclo rotativo (últimos 7 dias completos, 4 backups semanais).
4. **Recuperação (Restore):**
   - Bastaria provisionar uma nova VM rodando `docker compose up -d` e injetar o último `.sql` dentro do container MariaDB via `mysql < backup.sql`.
