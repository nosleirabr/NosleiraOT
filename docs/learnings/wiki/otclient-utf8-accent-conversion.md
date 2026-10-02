# Acentuação e Encoding UTF-8 vs Latin-1 no OTClient (TFS 1.2)

## Problema
No OTClient (OTCv8 / Tibia 7.4), a renderização de fontes no cliente utiliza o encoding ISO-8859-1 (Latin-1). Quando scripts Lua no TFS (salvos em UTF-8) enviam mensagens contendo acentos (como `última`, `às`, `vocação`, `não`), os bytes UTF-8 de 2 bytes (ex: `\xC3\xBA` para `ú`) são interpretados pelo cliente como dois caracteres separados (`Ãº`), gerando *mojibake* (erros de acentuação como `Ãºltima` ou `Ã s`).

## Solução Técnica
Em vez de reescrever centenas de scripts Lua em Latin-1 ou arriscar quebra de codificação no repositório UTF-8:
1. Criamos a função utilitária global `string.utf8ToLatin1(str)` em [`server/data/lib/core/core.lua`](file:///d:/Server/server/data/lib/core/core.lua), que mapeia matematicamente a faixa de bytes UTF-8 de 2 bytes (`\xC3[\x80-\xBF]`) diretamente para seus equivalentes Latin-1 (`code + 64`).
2. Aplicamos hooks globais nas APIs centrais do TFS:
   - `Player.sendTextMessage` em [`server/data/lib/core/player.lua`](file:///d:/Server/server/data/lib/core/player.lua)
   - `Creature.say` em [`server/data/lib/core/creature.lua`](file:///d:/Server/server/data/lib/core/creature.lua)

## Resultado
Todas as mensagens de texto do servidor (login, broadcasts, NPCs, falas de criaturas, mensagens de status) enviadas por scripts Lua convertem automaticamente caracteres acentuados para Latin-1 antes de enviar à rede, garantindo que o OTClient exiba acentuação 100% perfeita (`última`, `às`, `vocação`, `não`) sem necessitar de ajustes manuais em scripts futuros.
