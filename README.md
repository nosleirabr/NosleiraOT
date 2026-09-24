# âš”ï¸ Nosleira OT Server 7.4

![Tibia 7.4](https://img.shields.io/badge/Tibia-7.4-blue?style=for-the-badge&logo=tibia)
![TFS](https://img.shields.io/badge/TFS-1.2-orange?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-success?style=for-the-badge)

[![CI L1+L2+L3](https://github.com/nosleirabr/Oteserver7.4/actions/workflows/ci.yml/badge.svg)](https://github.com/nosleirabr/Oteserver7.4/actions/workflows/ci.yml) [![Lua Lint](https://github.com/nosleirabr/Oteserver7.4/actions/workflows/lua-lint.yml/badge.svg)](https://github.com/nosleirabr/Oteserver7.4/actions/workflows/lua-lint.yml) [![C/C++ CI](https://github.com/nosleirabr/Oteserver7.4/actions/workflows/c-cpp.yml/badge.svg)](https://github.com/nosleirabr/Oteserver7.4/actions/workflows/c-cpp.yml)

Servidor **Tibia 7.4** clÃ¡ssico com realmap autÃªntico (TibiCAM), fidelidade total Ã  era de ouro do Tibia, construÃ­do sobre uma stack moderna e de alta performance.

---

## ðŸ› ï¸ Stack TecnolÃ³gico

- **Server Engine:** TFS 1.2 (C++ / Lua)
- **Web Site:** MyAAC
- **Database:** MariaDB
- **Infraestrutura:** Docker Compose

---

## ðŸŽ¯ Foco Atual (O que estamos fazendo)

Atualmente estamos trabalhando no Milestone **M2 (Paridade de conteÃºdo 7.4)**. As frentes de trabalho recentes incluem:
- ðŸ› RevisÃ£o de fÃ³rmulas de combate e mecÃ¢nicas clÃ¡ssicas (Runas, Breakchance de Spears).
- ðŸ§ª CorreÃ§Ã£o de visuais clÃ¡ssicos (HMM, LMM) e fluidos (Life/Mana fluid).
- ðŸ—ºï¸ Auditoria de NPCs, Quests e actions de portas/baÃºs.

---

## ðŸš€ Como Iniciar (Desenvolvimento Local)

### PrÃ©-requisitos
- [Docker](https://www.docker.com/) e Docker Compose instalados.
- [Git](https://git-scm.com/)

### Subindo o servidor
```bash
# 1. Clone o repositÃ³rio
git clone https://github.com/nosleirabr/Oteserver7.4.git

# 2. Entre na pasta
cd Oteserver7.4

# 3. Inicie os containers em background
docker compose up -d --build
```

**Credenciais padrÃ£o para testes:**
- **Conta:** `1`
- **Senha:** `admin123`
- **Personagem God:** `Admin`

---

## ðŸ—ºï¸ Milestones e Progresso

Acompanhe nossa jornada de desenvolvimento atÃ© o lanÃ§amento da base estÃ¡vel.

| Milestone | Status |
|-----------|--------|
| **M0** - FundaÃ§Ã£o do stack | ConcluÃ­do (100%) âœ… |
| **M1** - Jogabilidade nÃºcleo | ConcluÃ­do (100%) âœ… |
| **M2** - Paridade de conteÃºdo 7.4 | ConcluÃ­do (100%) âœ… |
| **M3** - Server testÃ¡vel CI | Em andamento (50%) ðŸ”§ |
| **M4** - Client com cÃ³digo-fonte | ConcluÃ­do (100%) âœ… |
| **M5** - Infra nuvem e seguranÃ§a | Planejado (17%) â³ |
| **M6** - Release base estÃ¡vel | Planejado (40%) â³ |

---

## ðŸ“‹ Roadmap e Issues

Acompanhe os detalhes nas [Issues do GitHub](https://github.com/nosleirabr/Oteserver7.4/issues), organizadas por milestone e prioridade.

| Label | Significado | Status |
|-------|-------------|--------|
| `P0-Critico` | Bloqueia jogabilidade - tratar imediatamente | ConcluÃ­do (100%) âœ… |
| `P1-Grave` | Paridade necessÃ¡ria para base estÃ¡vel | ConcluÃ­do (100%) âœ… |
| `P2-Moderado`| Importante mas nÃ£o bloqueia o milestone | ConcluÃ­do (100%) âœ… |
| `P3-Melhoria`| Nice-to-have, iceboxÃ¡vel | ConcluÃ­do (100%) âœ… |

---

## ðŸ“ Estrutura do Projeto

```text
Oteserver7.4/
â”œâ”€â”€ client/       # Arquivos do cliente customizado
â”œâ”€â”€ docker/       # Arquivos de configuraÃ§Ã£o dos containers
â”œâ”€â”€ maps/         # Mapa real autÃªntico e spawns
â”œâ”€â”€ server/       # CÃ³digo-fonte C++, scripts Lua (TFS 1.2)
â””â”€â”€ site/         # Arquivos web do MyAAC
```

---

## ðŸ“œ LicenÃ§a

Projeto privado - uso interno exclusivo.

