---
name: 🕹️ Manual QA
about: Story de validação manual obrigatória antes de fechar um milestone
title: "[Manual QA] "
labels: manual-qa, triage
assignees: ""
---

## Feature / Epic validado

<!-- Qual feature ou epic está sendo validada por este QA? Linke as issues de código Done. -->

Closes / Valida: #

## Milestone

<!-- ex: M1 Jogabilidade núcleo -->

## Roteiro de teste

<!-- Passo a passo para o testador humano verificar o comportamento correto 7.4 -->

1. <!-- Inicie o servidor: `docker compose up -d` -->
2. <!-- Crie/logue com um personagem -->
3. <!-- Ação específica a testar -->
4. <!-- Resultado esperado -->

## Critério de aceitação (checklist)

- [ ] <!-- Comportamento 1 OK -->
- [ ] <!-- Comportamento 2 OK -->
- [ ] <!-- Nenhum crash / erro nos logs durante o teste -->
- [ ] <!-- Comportamento bate com fidelidade 7.4 -->

## Evidências necessárias

<!-- O que deve ser entregue ao fechar esta issue? Screenshots, vídeo, log limpo? -->

- [ ] Screenshot ou gravação do teste
- [ ] Trecho de log sem erros críticos (`docker compose logs tfs`)

## Ambiente de teste

<!-- Versão do Docker, sistema operacional, branch testada -->

- Branch: `<!-- feature/... -->`
- OS: 
- Docker: 

## Resultado

<!-- Preencher ao concluir o QA -->

- [ ] ✅ Aprovado
- [ ] ❌ Reprovado — descreva o desvio abaixo

```
<!-- Detalhes do desvio encontrado, se houver -->
```
