# Guia: Estrutura do Banco de Dados

Referência da estrutura de tabelas do servidor TFS 1.2 com MyAAC.

---

## Visão geral

O banco de dados MariaDB/MySQL armazena:

- **Accounts e players** — cadastros e personagens
- **Items e containers** — inventário e depots
- **Houses** — casas e propriedades
- **Guilds** — guildas e membros
- **Market** — itens à venda (se ativado)
- **Bans** — banimentos de conta/IP
- **Storage** — variáveis de quest por jogador

---

## Tabelas principais

### `accounts`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INT | ID único da account |
| `name` | VARCHAR(32) | Nome da account (numérico em 7.4: `uint32` como string) |
| `password` | VARCHAR(255) | Hash da senha |
| `email` | VARCHAR(255) | E-mail do jogador |
| `type` | TINYINT | Nível de acesso (1=normal, 5=GM, 6=GOD) |
| `creation` | INT | Timestamp de criação |

### `players`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INT | ID único do personagem |
| `name` | VARCHAR(255) | Nome do personagem |
| `account_id` | INT | FK → `accounts.id` |
| `vocation` | TINYINT | 0=No voc, 1=Sorc, 2=Druid, 3=Pally, 4=Knight |
| `health` | INT | HP atual |
| `mana` | INT | Mana atual |
| `level` | INT | Nível do personagem |
| `experience` | BIGINT | Experiência total |
| `town_id` | INT | Cidade de respawn |
| `posx`, `posy`, `posz` | INT | Posição no mapa |

### `player_storage`

Armazena variáveis de quest por jogador.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `player_id` | INT | FK → `players.id` |
| `key` | INT UNSIGNED | ID do storage (ver `docs/KNOWN_DEFECTS.md` para colisões) |
| `value` | INT | Valor atual |

> **Atenção:** Storage IDs de quest devem ser únicos. Ver [`docs/MAP_DATAPACK_FIX_PLAN.md`](../MAP_DATAPACK_FIX_PLAN.md) para o plano de resolução de colisões com 8.0.

### `player_items`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `player_id` | INT | FK → `players.id` |
| `pid` | INT | ID do container pai (0 = inventário raiz) |
| `sid` | INT | Slot dentro do container |
| `itemtype` | INT | ID do item (ver `items.xml`) |
| `count` | INT | Quantidade / carga |
| `attributes` | BLOB | Atributos serializados |

### `tiles` / `tile_items`

Itens persistidos no mapa (ex: depots, casas, containers em tiles).

---

## Conexão local (Docker)

```bash
# Acessar o banco via Docker
docker compose exec db mysql -u tibia -ptibia tibia

# Ou pela porta exposta (3306)
mysql -h 127.0.0.1 -P 3306 -u tibia -ptibia tibia
```

Credenciais padrão: ver `.env` / `.env.template`.

---

## Operações comuns

```sql
-- Listar personagens
SELECT id, name, level, vocation, town_id FROM players ORDER BY level DESC;

-- Ver storage de quest de um jogador
SELECT key, value FROM player_storage WHERE player_id = 1;

-- Resetar um storage de quest (ex: liberar baú já coletado)
UPDATE player_storage SET value = 0 WHERE player_id = 1 AND key = 12345;

-- Dar GOD a uma account
UPDATE accounts SET type = 6 WHERE name = '1';

-- Verificar banimentos ativos
SELECT * FROM account_bans WHERE expires_at > UNIX_TIMESTAMP();
```

---

## Backup e restore

```bash
# Backup
docker compose exec db mysqldump -u tibia -ptibia tibia > backup_$(date +%Y%m%d).sql

# Restore
docker compose exec -T db mysql -u tibia -ptibia tibia < backup_20260911.sql
```

---

## Referências

- Schema: `server/server/schema.sql`
- Itens e IDs: `server/server/data/items/items.xml`
- Storage e colisões: [`docs/MAP_DATAPACK_FIX_PLAN.md`](../MAP_DATAPACK_FIX_PLAN.md)
- Defects conhecidos: [`docs/KNOWN_DEFECTS.md`](../KNOWN_DEFECTS.md)
