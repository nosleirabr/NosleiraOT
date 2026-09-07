# Regras de código

Fonte canônica para estilo e estrutura de código neste repositório (C++/Lua no server, C# nos testes, PHP no site, Lua no client OTCv8).

Qualquer agente de IA **deve** aplicar a skill `otserver-developer` ao escrever ou alterar código. Não pule estas regras.

## Princípio de padronização (obrigatório)

**Mais vale código mediano no padrão do projeto do que vários códigos “bons” em padrões diferentes.**

- Antes de criar um arquivo novo, **procure o lugar certo que já existe** e atualize-o (lib, actions, movements, NPC script, módulo OTCv8, teste na categoria certa).
- Não invente pastas/arquivos paralelos “porque ficou mais limpo” se o datapack/server já tem um slot convencional.
- Não espalhe `if` avulsos no meio de código legado só para encaixar uma regra — extraia subfunção, reutilize helper existente, ou estenda a tabela/constante canônica.
- Siga o layout e os nomes já usados na camada (`server/server/data/...`, `client/modules/...`, `tests/...`).

## Princípios de legibilidade

- **Subfunções:** quebre blocos em funções/métodos com nome de intenção (`grantSealReward`, `denyAccess`, `resolveTeleportDestination`).
- **Comentários sempre em português:** todo comentário de código (bloco, linha, XML/`--` em Lua, `//` / `///` em C#/C++, etc.) **deve** estar em português. Nomes de símbolos (`grantSealReward`, `crownArmorId`) podem permanecer em inglês se já for o padrão do ficheiro; o texto explicativo não.
- **Comentários de bloco:** comente o *passo / intenção* acima de cada bloco não trivial, o suficiente para um humano ler o fluxo sem decifrar linha a linha — sem narrar o óbvio.
- **Early return / if invertido:** evite `if/else` aninhados. Prefira guardar a condição de falha e retornar cedo.
- OOP onde o modelo permitir; métodos curtos; uma responsabilidade.

```lua
-- OK: guarda + early return
function onUse(player, item, fromPosition, target, toPosition, isHotkey)
	-- Recusa quem ainda não concluiu o selo anterior
	if not hasCompletedSeal(player) then
		return denyAccess(player)
	end

	-- Entrega a recompensa e marca o storage da quest
	grantSealReward(player)
	return true
end
```

## IDs legíveis (itens, actions, uniqueids, storages)

Todo ID numérico de item, `actionid`, `uniqueid`, storage, outfit, etc. precisa de **nome humano**:

1. Preferência: constante / variável com nome (`crownArmorId`, `CROWN_ARMOR`, `ItemIds.ARMORS.CROWN_ARMOR`).
2. Alternativa aceitável: literal **com comentário** canônico em português (`2487 -- armadura de coroa`).
3. Vários IDs no mesmo bloco: use a forma mais legível (tabela nomeada ou comentários por linha).

```lua
-- OK: nomes
local crownArmorId = 2487 -- armadura de coroa

-- OK: grupos canônicos (server) — estenda data/lib/core/constants.lua
if item:getId() == ItemIds.ARMORS.CROWN_ARMOR then
	-- ...
end
```

**Não** deixe magias numéricas soltas sem nome ou comentário.

### Constantes agrupadas (server)

IDs compartilhados vivem em [`server/server/data/lib/core/constants.lua`](../server/server/data/lib/core/constants.lua) sob `ItemIds` (grupos `ARMORS`, `HELMETS`, `LEGS`, `BOOTS`, `SHIELDS`, `WEAPONS`, `RINGS`, `AMULETS`, `RUNES`, `CONTAINERS`, …).

- Reutilize / estenda esses grupos em vez de criar outro arquivo de IDs.
- Ao adicionar um ID, confira o `id` em `items.xml` deste datapack.

## Condicionais e testes (obrigatório)

Antes de adicionar um `if` (ou nova ramificação) ao código de produção:

1. Preferir **submétodo** em vez de crescer o método atual.
2. Confirmar que o fluxo existente já tem testes e que, com a extração, eles **continuam passando sem editar asserts antigos**.
3. Só então implementar a nova condicional.
4. Incluir **teste novo** na categoria correta de [`TESTING.md`](TESTING.md).

Não “consertar” testes antigos para acomodar comportamento novo se o contrato antigo ainda for válido.

## Paths e portabilidade

- Em docs, skills, scripts e exemplos: use paths **relativos ao repo** (`server/server/data/...`, `docs/learnings/...`).
- **Nunca** grave o caminho absoluto da máquina de um desenvolvedor (`C:\Users\...`, `C:\Projetos\...`) em arquivos versionados — quebra outros clones.
- Em comandos de exemplo, use `cd <repo-root>` ou o equivalente relativo.

## Brain / learnings (compartilhado)

O cérebro do projeto é **somente** [`docs/learnings/`](learnings/README.md) (versionado no Git).

- Não use brains em home do usuário (`~/.codex/...`, `brain/` fora do repo, etc.) para learnings deste OT — o time precisa da mesma base.
- Ingest com a skill `otserver-learnings-ingest`.

## Escopo e fidelidade

- Mudanças mínimas; sem features modernas de OT fora da fase atual (`README.md` da raiz).
- Não refatore arquivos não relacionados à tarefa.
- Aplique `otserver-74-fidelity` em mudanças de gameplay/conteúdo.

## Ferramentas externas

Binários baixados **não** entram no Git. Use paths gitignored (`tools/vendor/`, `tools/external/`, …). **Exceção:** `tools/rme-bin/` é versionado.
