# ⚔️ Nosleira OT Server 7.4

![Tibia 7.4](https://img.shields.io/badge/Tibia-7.4-blue?style=for-the-badge&logo=tibia)
![TFS](https://img.shields.io/badge/TFS-1.2-orange?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-success?style=for-the-badge)

Servidor **Tibia 7.4** clássico com realmap autêntico (TibiCAM), fidelidade total à era de ouro do Tibia, construído sobre uma stack moderna e de alta performance.

---

## 🛠️ Stack Tecnológico

- **Server Engine:** TFS 1.2 (C++ / Lua)
- **Web Site:** MyAAC
- **Database:** MariaDB
- **Infraestrutura:** Docker Compose

---

## 🎯 Foco Atual (O que estamos fazendo)

Atualmente estamos trabalhando no Milestone **M2 (Paridade de conteúdo 7.4)**. As frentes de trabalho recentes incluem:
- 🐛 Revisão de fórmulas de combate e mecânicas clássicas (Runas, Breakchance de Spears).
- 🧪 Correção de visuais clássicos (HMM, LMM) e fluidos (Life/Mana fluid).
- 🗺️ Auditoria de NPCs, Quests e actions de portas/baús.

---

## 🚀 Como Iniciar (Desenvolvimento Local)

### Pré-requisitos
- [Docker](https://www.docker.com/) e Docker Compose instalados.
- [Git](https://git-scm.com/)

### Subindo o servidor
```bash
# 1. Clone o repositório
git clone https://github.com/nosleirabr/Oteserver7.4.git

# 2. Entre na pasta
cd Oteserver7.4

# 3. Inicie os containers em background
docker compose up -d --build
```

**Credenciais padrão para testes:**
- **Conta:** `1`
- **Senha:** `admin123`
- **Personagem God:** `Admin`

---

## 🗺️ Milestones e Progresso

Acompanhe nossa jornada de desenvolvimento até o lançamento da base estável.

| Milestone | Status |
|-----------|--------|
| **M0** - Fundação do stack | Concluído (100%) ✅ |
| **M1** - Jogabilidade núcleo | Concluído (100%) ✅ |
| **M2** - Paridade de conteúdo 7.4 | Em andamento (95%) 🚧 |
| **M3** - Server testável CI | Planejado (0%) 📅 |
| **M4** - Client com código-fonte | Planejado (0%) 📅 |
| **M5** - Infra nuvem e segurança | Planejado (0%) 📅 |
| **M6** - Release base estável | Planejado (0%) 📅 |

---

## 📋 Roadmap e Issues

Acompanhe os detalhes nas [Issues do GitHub](https://github.com/nosleirabr/Oteserver7.4/issues), organizadas por milestone e prioridade.

| Label | Significado | Status |
|-------|-------------|--------|
| `P0-Critico` | Bloqueia jogabilidade - tratar imediatamente | Concluído (100%) |
| `P1-Grave` | Paridade necessária para base estável | Em andamento (95%) |
| `P2-Moderado`| Importante mas não bloqueia o milestone | Em andamento (40%) |
| `P3-Melhoria`| Nice-to-have, iceboxável | Pendente (0%) |

---

## 📁 Estrutura do Projeto

```text
Oteserver7.4/
├── client/       # Arquivos do cliente customizado
├── docker/       # Arquivos de configuração dos containers
├── maps/         # Mapa real autêntico e spawns
├── server/       # Código-fonte C++, scripts Lua (TFS 1.2)
└── site/         # Arquivos web do MyAAC
```

---

## 📜 Licença

Projeto privado - uso interno exclusivo.
