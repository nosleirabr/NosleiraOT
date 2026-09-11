## Descrição

<!-- Explique o que este PR faz e por quê. Uma frase clara é suficiente para PRs pequenos. -->

Closes #<!-- número da issue -->

## Tipo de mudança

- [ ] 🐛 Bug fix (correção que resolve uma issue sem quebrar outra coisa)
- [ ] ✨ Feature (nova funcionalidade alinhada ao roadmap)
- [ ] ♻️ Refactor (melhoria de código sem alterar comportamento)
- [ ] 📄 Docs (documentação apenas)
- [ ] 🔧 Chore (CI, configs, scripts de build)
- [ ] 🗺️ Maps (OTBM, levers, teleports, aids)

## Camada(s) modificada(s)

- [ ] Server (TFS C++ / Lua datapack)
- [ ] Site (MyAAC / PHP)
- [ ] Client (OTClient / Lua modules)
- [ ] Docker / Compose
- [ ] Maps / OTBM
- [ ] CI / Workflows
- [ ] Docs

## Milestone / Epic

<!-- ex: M1 Jogabilidade núcleo · Epic Travel -->

---

## Checklist do autor

### Código (obrigatório quando há mudança de código)

- [ ] Comentários de intenção em **português** nos blocos não-óbvios
- [ ] IDs numéricos (item/action/unique/storage) nomeados ou comentados
- [ ] Sem paths absolutos de máquina em docs/skills/exemplos
- [ ] Não quebrei nenhum teste existente (`docs/TESTING.md`)
- [ ] Adicionei/atualizei testes para o novo comportamento (se aplicável)
- [ ] Segui os padrões de `docs/CODING.md` (subfunções, early returns, sem ninhos profundos)

### Fidelidade 7.4

- [ ] A mudança preserva o comportamento Tibia 7.4 (sem features modernas de OT)
- [ ] Se muda gameplay: consultei `docs/QUESTS_AND_FEATURES.md` ou fonte canônica

### Qualidade

- [ ] `docker compose up -d --build` sobe sem erros na minha máquina
- [ ] CI (GitHub Actions) passando neste PR
- [ ] Não há secrets, logs de debug, arquivos compilados ou lixo commitado

### Documentação

- [ ] Atualizei `docs/KNOWN_DEFECTS.md` / `docs/CHANGELOG` se corrigi um defect
- [ ] Atualizei `docs/ROADMAP.md` se o estado de uma issue mudou

---

## Como testar

<!-- Passos para o revisor testar localmente. Inclua comandos se couber. -->

```bash
# exemplo
docker compose up -d --build
# ...
```

## Evidências

<!-- Screenshots, vídeo, log limpo, resultado de testes — o que for relevante -->

---

> **Lembre-se:** L3 automatizado ≠ aceitação manual. Issues com `[Manual QA]` vinculadas precisam de aprovação humana antes do milestone fechar.
