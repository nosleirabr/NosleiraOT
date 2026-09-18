# Checklist de Release

## Testes Automatizados (CI)
- [ ] Build do servidor C++ passando (Ubuntu/Windows).
- [ ] L1: Testes unitários (Catch2) passando.
- [ ] L2: Testes de sistema (banco de dados real) passando.
- [ ] L3: Testes de ponta a ponta (login, quests, combate) passando.
- [ ] L4: Testes de protocolo (comunicação cliente/servidor) passando.

## Testes Manuais (QA)
- [ ] Servidor sobe localmente sem crash.
- [ ] Client consegue se conectar e logar em conta existente.
- [ ] Criação de conta/personagem via MyAAC funciona.
- [ ] Teste de carga basico (múltiplas conexões).

## Congelamento e Publicação
- [ ] Todas as PRs da milestone mescladas.
- [ ] Versionamento atualizado no código.
- [ ] Tag `v1.0.0` criada via git.
- [ ] Release Notes publicadas no GitHub com as notas da Milestone M6.
