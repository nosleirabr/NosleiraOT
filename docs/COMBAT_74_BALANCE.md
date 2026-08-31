# Matriz de Balanceamento Clássico Tibia 7.4

Este documento define os valores canônicos para o combate e progressão na versão 7.4. Ele serve como contrato (fonte da verdade) para as configurações do servidor e balanceamento.

## 1. Exhaust e Cooldowns

- **Exhaust Global (Runas e Magias):** Exatos 2.0 segundos (2000 ms).
- **Grupos de Magia:**
  - `attack`: Runas de dano (SD, GFB, HMM, etc) e magias de ataque (Exori, Exevo Vis Lux).
  - `healing`: Runas de cura (UH, IH) e magias de cura (Exura, Exura Gran, Exura Vita).
  - *Referência:* `docs/learnings/wiki/74-fidelity-fixes.md` — Essa divisão permite o combo clássico de atirar uma runa de dano e se curar quase simultaneamente, pois usam delays independentes.

## 2. Progressão de Vocações (Gains por Level)

| Vocation         | HP Gain | Mana Gain | Cap Gain |
|------------------|---------|-----------|----------|
| Sorcerer / Druid | 5       | 30        | 10       |
| Paladin          | 10      | 15        | 20       |
| Knight           | 15      | 5         | 25       |

## 3. Regeneração (HP e Mana)

As taxas abaixo consideram as restrições hardcore validadas no `REVIEW_DO_PROJETO.md`.

**Base (Sem Promotion):**
- **Sorcerer / Druid:** 1 HP a cada 12s | 1 Mana a cada 6s
- **Paladin:** 1 HP a cada 8s | 1 Mana a cada 8s
- **Knight:** 1 HP a cada 6s | 1 Mana a cada 12s

**Com Promotion:**
- **Master Sorcerer / Elder Druid:** 1 HP a cada 12s | 1 Mana a cada 4s
- **Royal Paladin:** 1 HP a cada 6s | 1 Mana a cada 6s
- **Elite Knight:** 1 HP a cada 4s | 1 Mana a cada 12s

*Nota:* O sistema de **Soul Points** NÃO existia no Tibia 7.4 (introduzido apenas no 7.6). Ele deve ser completamente inativado nos XMLs de vocação e magias.

## 4. Skills e Multiplicadores (Rates 1x)

| Vocation         | Magic Lvl | Melee | Distance | Shielding |
|------------------|-----------|-------|----------|-----------|
| Sorcerer / Druid | 1.1       | 2.0   | 2.0      | 1.5       |
| Paladin          | 1.4       | 1.2   | 1.1      | 1.1       |
| Knight           | 3.0       | 1.1   | 1.4      | 1.1       |

## 5. Velocidade de Ataque (Attack Speed)

- **Físico/Armas:** 2000 ms (1 ataque a cada 2 segundos) independentemente da vocação.

## 6. Gaps (Para Pesquisa / Configuração Futura)

- Fórmulas exatas de hit (Melee e Distance) dependentes de Armor/Defense, sem os escalonamentos modernos do TFS.
- Danos mágicos e runas de cura baseados puramente no Magic Level e Level do jogador (sem % multiplier que engines modernas usam).
