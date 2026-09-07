# AI Verifier Tools

Esta pasta contém scripts criados para analisar o código e os dados do servidor Tibia 7.4.
O objetivo é que Agentes de IA (como o Antigravity / Cursor) rodem esses scripts para encontrar erros no servidor (como XML mal formatado, bugs em Lua ou itens faltantes no mapa) e consigam corrigi-los automaticamente antes mesmo de você abrir o servidor.

## Ferramentas Disponíveis

### `xml_checker.py`
Varre as pastas `data/monster` e `data/npc` procurando por arquivos XML corrompidos ou mal formatados que fariam o console do TFS apresentar erros.

**Como rodar manualmente (requer Python instalado):**
```powershell
python tools/ai-verifier/xml_checker.py --data-dir server/server/data
```

## Próximos Passos (Para a IA construir no futuro)
- [ ] Criar `lua_checker.py` para validar a sintaxe dos scripts em Lua (quests, magias).
- [ ] Criar `log_analyzer.py` para ler os logs de erro do Docker e sugerir a correção no código C++ ou Lua.
- [ ] Criar `map_validator.py` (usando OTBM parsers) para encontrar bugs visuais no mapa.
