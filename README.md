# ⚔️ Nosleira OT Server 7.4

![Tibia 7.4](https://img.shields.io/badge/Tibia-7.4-blue?style=for-the-badge&logo=tibia)
![TFS](https://img.shields.io/badge/TFS-1.2-orange?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-success?style=for-the-badge)

[![CI L1+L2+L3](https://github.com/nosleirabr/Oteserver7.4/actions/workflows/ci.yml/badge.svg)](https://github.com/nosleirabr/Oteserver7.4/actions/workflows/ci.yml) [![Lua Lint](https://github.com/nosleirabr/Oteserver7.4/actions/workflows/lua-lint.yml/badge.svg)](https://github.com/nosleirabr/Oteserver7.4/actions/workflows/lua-lint.yml) [![C/C++ CI](https://github.com/nosleirabr/Oteserver7.4/actions/workflows/c-cpp.yml/badge.svg)](https://github.com/nosleirabr/Oteserver7.4/actions/workflows/c-cpp.yml)

Servidor **Tibia 7.4** clássico com realmap autêntico (TibiCAM), fidelidade total à era de ouro do Tibia, construído sobre uma stack moderna e de alta performance.

---

## 🛠️ Stack Tecnológico

- **Server Engine:** TFS 1.2 (C++ / Lua)
- **Web Site:** MyAAC
- **Database:** MariaDB
- **Infraestrutura:** Docker Compose

---

## 🎯 Foco Atual (O que estamos fazendo)

**M5 (Infra nuvem e segurança) e M6 (Release base estável) CONCLUÍDOS ✅**. Todas as issues fechadas:
- ☁️ Terraform/Terragrunt multi-env (`#43` fechada)
- 🔒 Hardening, antibot e logs estruturados (`#44`, `#45`, `#46`)
- 📦 Checklist de release, docs de fork e templates por perfil (`#48`, `#49`, `#50`, `#51`)
- 🗺️ Mapa/quests: Black Knight key 5010 (`uid 10065`) corrigido — CI 100% verde

Base estável pronta para tag/release e criação de variantes.

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
- **Senha:** `1`
- **Personagem God:** `[GOD] Nosleira`

---

## 🗺️ Milestones e Progresso

Acompanhe nossa jornada de desenvolvimento até o lançamento da base estável.

| Milestone | Status |
|-----------|--------|
| **M0** - Fundação do stack | Concluído (100%) ✅ |
| **M1** - Jogabilidade núcleo | Concluído (100%) ✅ |
| **M2** - Paridade de conteúdo 7.4 | Concluído (100%) ✅ |
| **M3** - Server testável CI | Concluído (100%) ✅ |
| **M4** - Client com código-fonte | Concluído (100%) ✅ |
| **M5** - Infra nuvem e segurança | Concluído (100%) ✅ |
| **M6** - Release base estável | Concluído (100%) ✅ |

---

## 📋 Roadmap e Issues

Acompanhe os detalhes nas [Issues do GitHub](https://github.com/nosleirabr/Oteserver7.4/issues), organizadas por milestone e prioridade.

| Label | Significado | Status |
|-------|-------------|--------|
| `P0-Critico` | Bloqueia jogabilidade - tratar imediatamente | Concluído (100%) ✅ |
| `P1-Grave` | Paridade necessária para base estável | Concluído (100%) ✅ |
| `P2-Moderado`| Importante mas não bloqueia o milestone | Concluído (100%) ✅ |
| `P3-Melhoria`| Nice-to-have, iceboxável | Concluído (100%) ✅ |

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
