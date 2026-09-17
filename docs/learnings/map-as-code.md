# Pesquisa: Map-as-code e Formatos Alternativos ao OTBM

**Issues relacionadas:** #52, #53
**Data:** Setembro de 2026
**Status:** Concluído (Icebox resolvido)

## 1. O Problema Atual (Binário vs Texto)
O formato nativo de mapas do TFS (e do Remere's Map Editor) é o `.otbm` (OpenTibia Binary Map). 
Por ser um formato binário, enfrentamos os seguintes desafios:
- **Controle de versão:** O Git não consegue gerar "diffs" legíveis. Se duas pessoas editam o mapa, gerar um "merge" é quase impossível.
- **Automação de Testes:** Criar pequenos fragmentos de mapa em tempo de execução para testes unitários é complexo, pois exige abrir o RME ou gerar binários pesados manualmente.

As issues #52 e #53 propunham investigar formatos em texto claro (`map-as-code` usando JSON ou YAML) e testar a viabilidade de um gerador para CI.

## 2. Tradeoffs Encontrados

### Formato OTBM (Atual)
- **Prós:** 
  - Nativo do TFS 1.2+ e altamente otimizado para carregamento em memória.
  - Único formato totalmente suportado pela comunidade e pelo RME.
  - Baixo uso de disco em relação ao tamanho do mapa global.
- **Contras:** 
  - Bloqueia code-reviews no GitHub (não tem diff legível).

### Formato JSON / YAML (Alternativa)
- **Prós:** 
  - Completamente legível para humanos.
  - Suporte nativo do Git para diff e automação.
  - Permite gerar mapas com scripts simples em CI/CD.
- **Contras:** 
  - Arquivos seriam incrivelmente grandes para mapas reais (um mapa global em JSON facilmente passaria de gigabytes).
  - O TFS precisaria de uma reescrita no `map.cpp` para ler e parsear JSON eficientemente.
  - **O maior bloqueador:** Perda completa de compatibilidade com o Remere's Map Editor, exigindo que nós construíssemos do zero um novo map editor ou um conversor complexo OTBM-JSON bidirecional que seria lento e sujeito a falhas.

## 3. Prova de Conceito (POC)
Para validar o modelo teórico, desenvolvemos um pequeno gerador de POC (Proof of Concept) em Python (`tools/otbm_poc/map_generator.py`).
O script lê um layout `10x10` em formato JSON e demonstra a lógica de como esses bytes teriam que ser organizados e compactados nos `Nodes` hierárquicos do `.otbm`.
*Resultado do teste:* Viável para matrizes simples de tile/item, mas o rastreamento das `Houses`, `Waypoints` e `Spawns` exigiria recriar essencialmente a engine do RME.

## 4. Decisão Oficial Registrada
Após análise de viabilidade, **não vamos adotar Map-as-code para o mapa principal do jogo**. 

- O mapa real (Global 7.4) continuará a ser gerido **exclusivamente via Remere's Map Editor (OTBM)** para preservar performance e compatibilidade de tooling.
- Geradores automáticos podem e devem ser usados apenas em **ambientes de CI**, gerando arquivos OTBM na hora (usando C++ e GTest ou scripts isolados) contendo apenas "quartos 3x3" para testes unitários automatizados (ex: testar se um ActionID de alavanca funciona sem subir o mapa global).

Esta decisão resolve os critérios de aceite do Icebox sem introduzir risco ou overhead técnico ao Oteserver7.4.
