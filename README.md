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
| M0 - Fundacao do stack | Concluído (100%) |
| M1 - Jogabilidade nucleo | Concluído (100%) |
| M2 - Paridade de conteudo 7.4 | Em andamento (85%) |
| M3 - Server testavel CI | Planejado (0%) |
| M4 - Client com codigo-fonte | Planejado (0%) |
| M5 - Infra nuvem e seguranca | Planejado (0%) |
| M6 - Release base estavel | Planejado (0%) |

## Comecar (desenvolvimento local)

```bash
git clone https://github.com/nosleirabr/Oteserver7.4.git
cd Oteserver7.4
docker compose up -d --build
```

Login padrao: conta **1** / senha **admin123** / personagem **Admin**

## Roadmap e Issues

Acompanhe o progresso nas [Issues](https://github.com/nosleirabr/Oteserver7.4/issues) organizadas por milestone e prioridade.

| Label | Significado | Status |
|-------|------------|--------|
| P0-Critico | Bloqueia jogabilidade - tratar imediatamente | Concluído (100%) |
| P1-Grave | Paridade necessaria para base estavel | Em andamento (85%) |
| P2-Moderado | Importante mas nao bloqueia o milestone | Em andamento (40%) |
| P3-Melhoria | Nice-to-have, iceboxavel | Pendente (0%) |

## Licenca

Projeto privado - uso interno.