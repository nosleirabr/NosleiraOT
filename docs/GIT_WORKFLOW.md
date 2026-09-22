# Fluxo Git — GitHub (monorepo)

Repo: [nosleirabr/Oteserver7.4](https://github.com/nosleirabr/Oteserver7.4)

`server/`, `site/`, `client/`, `maps/` e `tools/` vivem **neste** repositório. Não há clones GitLab nem Merge Request.

## Regras

- **`main` protegida** — não faça commit/push cego nela. Trabalhe em branch de feature.
- **PR obrigatório** para integrar em `main`.
- **Não mergear** sem pedido explícito do humano.
- **Sem** `--force` em `main`, sem pular hooks, sem secrets no Git.
- Agente **não** sobe nada sozinho: commit, push e PR só quando o humano pedir.

## Fluxo

1. Atualizar `main` na raiz do repo (`D:\Server`):
   ```powershell
   git checkout main
   git pull origin main
   ```
2. Criar branch: `<ticketid>-<resumo>` ou `<ticketid>-m<N>-<resumo>` (id da issue **primeiro**).
3. Commits pequenos; escopo focado.
4. Testes conforme [`TESTING.md`](TESTING.md).
5. Push e abrir **Pull Request** no GitHub para `main`, com `Closes #<N>` no body.
6. Aguardar Actions + review; merge só com autorização do humano.

## Checklist pré-PR

```
- [ ] Branch a partir de main atualizada
- [ ] Testes L1–L3 relevantes passaram localmente
- [ ] Sem .env / secrets / node_modules no diff
- [ ] Descrição do PR: o quê + porquê + test plan + Closes #N
```

## CI

GitHub Actions em `.github/workflows/` (`ci.yml`, `lua-lint.yml`, `php-lint.yml`, `c-cpp.yml`, `l3-tests.yml`). L4 é nightly/opt-in (`l4-nightly.yml`).

## Planejamento

Issues e labels: [nosleirabr/Oteserver7.4/issues](https://github.com/nosleirabr/Oteserver7.4/issues). Fluxo agentic: [`AGENTIC_KANBAN.md`](AGENTIC_KANBAN.md).
