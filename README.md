# Nosleira OT Server 7.4

Servidor **Tibia 7.4** classico com realmap autentico (TibiCAM 222222), fidelidade total a era 7.4 e stack moderno.

## Stack

- **Server:** TFS 1.2 (C++ / Lua)
- **Site:** MyAAC
- **Banco:** MariaDB
- **Infra:** Docker Compose

## Milestones

| Milestone | Status |
|-----------|--------|
| M0 - Fundacao do stack | Concluido |
| M1 - Jogabilidade nucleo | Em andamento |
| M2 - Paridade de conteudo 7.4 | Planejado |
| M3 - Server testavel CI | Planejado |
| M4 - Client com codigo-fonte | Planejado |
| M5 - Infra nuvem e seguranca | Planejado |
| M6 - Release base estavel | Planejado |

## Comecar (desenvolvimento local)

```bash
git clone https://github.com/nosleirabr/Oteserver7.4.git
cd Oteserver7.4
docker compose up -d --build
```

Login padrao: conta **1** / senha **admin123** / personagem **Admin**

## Roadmap e Issues

Acompanhe o progresso nas [Issues](https://github.com/nosleirabr/Oteserver7.4/issues) organizadas por milestone e prioridade.

| Label | Significado |
|-------|------------|
| P0-Critico | Bloqueia jogabilidade - tratar imediatamente |
| P1-Grave | Paridade necessaria para base estavel |
| P2-Moderado | Importante mas nao bloqueia o milestone |
| P3-Melhoria | Nice-to-have, iceboxavel |

## Licenca

Projeto privado - uso interno.