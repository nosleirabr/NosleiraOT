# Inventário de Fidelidade: IN e OUT (Tibia 7.4)

Este documento descreve explicitamente quais mecânicas, sistemas e conteúdos estão inclusos (IN), excluídos (OUT) e em análise futura (ICEBOX) em nossa base, garantindo que o servidor permaneça o mais autêntico e fiel possível à era de ouro do Tibia (versão 7.4).

## 🟢 IN (Inclusos e Fiéis ao 7.4)
Mecânicas e características clássicas que **fazem parte** da base:

- **Mapa Autêntico (Realmap):** Baseado nos registros do TibiCAM da época (sem Yurots ou ilhas modernas).
- **Sistema de Combate e Fórmulas:**
  - Fórmulas de dano exatas para corpo-a-corpo (Melee), distância (Distance), Armadura e Escudo (Shielding).
  - Dano de feitiços (Exori, UE) e runas (HMM, SD, GFB) puramente dependentes de Magic Level e Level.
  - Magias antigas disponíveis e balanceadas conforme a versão 7.4.
- **Fluidos e Consumíveis:** 
  - Life Fluids e Mana Fluids autênticos (sem Health/Mana Potions modernas).
- **Runas em Cargas e Backpacks:**
  - Runas possuem número de cargas autênticos (ex: HMM = 5 charges, SD = 1 charge).
  - As runas não são agrupáveis (non-stackable) no inventário.
- **Sem Wands/Rods:**
  - Magos utilizam armas corpo-a-corpo comuns (como *Skull Staff*, *Clerical Mace*) ou runas e *Burst Arrows* para caçar.
- **Sistema de Penalidade de Morte:**
  - O jogador perde a quantidade de XP/Skills clássica (cerca de 10% sem promotions/blessings).
  - As 5 Blessings originais existem apenas para **reduzir** a perda de experiência e skills.
  - **Amulet of Loss (AoL)** é estritamente necessário para não dropar os equipamentos, visto que as blessings não protegem loot.
- **Dinâmica das Spears (Lanças):**
  - Caem no chão ao errar o alvo e possuem breakchance autêntica de quebra.
- **Economia Clássica:**
  - NPCs compram e vendem exatamente os itens da época.

---

## 🔴 OUT (Excluídos da Base)
Conteúdos de versões mais recentes (8.0+) que **não estão e não farão parte** desta base:

- ❌ Wands e Rods.
- ❌ Cidades e Ilhas pós-7.4 (Port Hope, Liberty Bay, Yalahar, Zao, Svargrond, etc).
- ❌ Twist of Fate (PVP Blessing).
- ❌ Offline Training (Treinamento offline nas estátuas).
- ❌ Mounts (Montarias).
- ❌ Market System (Compra e venda automatizada pelo Depot - usa-se Trade e Parcels).
- ❌ Task System "Grizzly Adams" (Foco nas Quests oldschool).
- ❌ Party Exp Share Bonus.
- ❌ Runas empilháveis.

---

## ❄️ ICEBOX (Ideias Futuras e Quality of Life)
Funcionalidades para o futuro (desde que não firam a economia):

- [ ] **Cast System:** Assistir outros jogadores in-game.
- [ ] **Integração Discord:** Webhooks informando sobre mortes ou eventos.
- [ ] **Anti-bot Rigoroso:** Sistemas agressivos do lado do servidor e limite de conexões.

---

## 💡 Rationale (Nossa Justificativa)
O objetivo principal da **Oteserver7.4** não é ser um "servidor genérico", mas sim uma verdadeira **cápsula do tempo**. Sistemas modernos como *Market* ou *Offline Training* destroem a interação social orgânica. Escolhemos ser rigorosos com essas exclusões para garantir a fidelidade e a nostalgia do projeto.
