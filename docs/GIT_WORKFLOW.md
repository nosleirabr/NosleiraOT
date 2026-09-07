# Fluxo Git — GitLab (multi-repo)

Cada sibling (`server`, `maps`, `client`, …) é um repositório GitLab independente. O workspace orquestra clones locais.

## Regras

- **`main` protegida** — push/merge só **Maintainer+**. Trabalhe em branch de feature.
- **MR obrigatório** para integrar em `main`.
- **Pipeline verde** exigida para merge (`only_allow_merge_if_pipeline_succeeds`).
- **Não mergear** sem pedido explícito do humano.
- **Sem** `--force` em `main`, sem pular hooks, sem secrets no Git.

## Fluxo

1. Atualizar `main` no repo que vai tocar:
   ```powershell
   git -C server checkout main
   git -C server pull origin main
   ```
2. Criar branch: `feat/<resumo>` ou `<ticket>-<resumo>`.
3. Commits pequenos; escopo focado.
4. Testes conforme [`TESTING.md`](TESTING.md).
5. Push e abrir **Merge Request** no GitLab para `main`.
6. Aguardar pipeline + review; Maintainer faz merge.

## Checklist pré-MR

```
- [ ] Branch a partir de main atualizada
- [ ] Testes L1–L3 relevantes passaram localmente
- [ ] Sem .env / secrets / node_modules no diff
- [ ] Descrição do MR: o quê + porquê + test plan
```

## CI

Templates: `infra/ci-templates`. Overrides por repo no topo do `.gitlab-ci.yml` (`OT740_*`).

## Planejamento (opcional)

Issues/board podem continuar no [GitHub Project #1](https://github.com/users/matosnathan/projects/1) — ver [`AGENTIC_KANBAN.md`](AGENTIC_KANBAN.md). O código vive no GitLab `opentibia-740/*`.
