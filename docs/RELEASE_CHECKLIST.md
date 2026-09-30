# Checklist de Release (Base Estável)

Este documento define os critérios obrigatórios e passos necessários para lançar e validar uma nova versão base estável (ex: `v1.0.0`) do OT Server 7.4.

## 1. Verificações Automatizadas (CI / Testes)
- [x] Pipeline (CI) passando na branch principal (`main`).
- [x] **Testes L1** (Linter e Validações Estáticas) passando sem erros.
- [x] **Testes L2** (Unidade e Mocks de Engine) passando.
- [x] **Testes L3** (Integridade de Datapack e Lua) finalizando com sucesso (sem exceções críticas).
- [x] **Testes L4** (Automação End-to-End de Protocolo/Containers) válidos ou documentados como bypass aceitável.

## 2. Smoke Tests de Ambiente e Jogabilidade (Manual)
- [x] **Bootstrap**: Garantir que um novo clone sobe "do zero" utilizando `docker-compose up` conforme instruções de `docs/BOOTSTRAP.md`.
- [x] **Criação de Conta**: Criar conta via Site (MyAAC) e logar in-game usando strings ou numérico padrão sem falhas de banco de dados.
- [x] **Jornada Crítica**: Personagem loga em Rookgaard -> Oracle -> Chega em Mainland -> Usa Banco/Câmbio -> Usa Barco/Tapete -> Usa Depot.
- [x] **Combate**: Teste simples de PvP / PvE com magias e uso de runas verificando se não ocorrem crashes (crash server).

## 3. Infraestrutura, Segurança e Configurações
- [x] **Docker e Compose**: Healthchecks passando (`tfs` e `mysql` up saudáveis).
- [x] **Exposição de Portas**: Garantir que apenas as portas seguras estão expostas caso o server seja subido em ambiente de produção (80, 443, 7171, 7172).
- [x] **Env e Configs**: Templates `.env.example` e `config.lua` estão atualizados sem hardcode de secrets sensíveis.
- [x] **Limitação de Acesso (Antibot)**: Configuração mínima de throttling ou proteção ativa documentada/aplicada (se escopo da release).

## 4. Documentação
- [x] `CHANGELOG.md` / Notas de Lançamento geradas contendo os marcos importantes atingidos (M0 a M5).
- [x] Issue tracker (Defects/Known Issues) em `docs/KNOWN_DEFECTS.md` sincronizado — bugs P0 bloqueantes tratados; bugs P2 e não bloqueantes aceitos e descritos.
- [x] Guias para criação de Fork / Variante atualizados.

## 5. Passos para a criação da Release e Tag
1. **Validar o checklist:** Todos os pontos acima devem estar checados.
2. **Gerar Release Notes:** Criar o arquivo de notas (`docs/RELEASE_NOTES_v1.0.0.md` ou `CHANGELOG.md`).
3. **Criar e dar Push na Tag (v1.0.0):**
   ```bash
   git checkout main
   git pull origin main
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. **Publicar no GitHub Releases:** Anexar as Release Notes documentando as entregas.

---

> _Obs: Ao completar esta checklist, este documento servirá como auditoria de que a base cumpre os requisitos de estabilidade antes de qualquer distribuição pública do código e client._