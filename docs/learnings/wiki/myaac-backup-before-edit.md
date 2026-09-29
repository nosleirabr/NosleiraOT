# Backup automático antes de editar arquivos do site

## Escopo

Toda edição em arquivo do site MyAAC deve ser precedida de um backup automático do arquivo original. Isso garante restauração instantânea sem depender do Git.

## Regra obrigatória

> **Antes de editar qualquer arquivo do site, fazer backup automático na pasta `.backup/` do repositório. Após a edição, perguntar ao usuário se deseja restaurar o backup.**

## Fluxo obrigatório

```
1. Identificar arquivo(s) a editar
2. Copiar para .backup/<nome-do-arquivo>.<timestamp>.bak ANTES de editar
3. Fazer a edição
4. Limpar cache MyAAC
5. Perguntar: "Quer restaurar o backup de <arquivo>?"
   - Sim → restaurar e limpar cache novamente
   - Não → manter edição atual
```

## Comando de backup padrão

```powershell
# Criar pasta de backup se não existir
New-Item -ItemType Directory -Force -Path ".backup" | Out-Null

# Backup com timestamp
$ts = Get-Date -Format "yyyyMMdd_HHmmss"
Copy-Item "site\caminho\arquivo.ext" ".backup\arquivo.ext.$ts.bak"
Write-Host "Backup criado: .backup\arquivo.ext.$ts.bak"
```

## Comando de restauração

```powershell
# Restaurar o backup mais recente de um arquivo
Copy-Item ".backup\arquivo.ext.<timestamp>.bak" "site\caminho\arquivo.ext" -Force
# Depois limpar cache
docker compose exec site_executable sh -c "rm -rf /var/www/html/system/cache/twig/* && rm -f /var/www/html/system/cache/myaac_*"
```

## Por que é importante

- Edições em templates podem quebrar o layout instantaneamente
- O Git só ajuda se o arquivo foi commitado — mudanças locais não commitadas são perdidas no `git reset --hard`
- O backup local garante reversão em segundos, sem depender de histórico Git

## Localização dos backups

- Pasta: `d:\Server\.backup\`
- Nomenclatura: `<nome-arquivo>.<YYYYMMDD_HHMMSS>.bak`
- Nunca commitar a pasta `.backup\` no Git (já deve estar no `.gitignore`)

## Fontes

- Sessão de debug do highscores/team/characters (2026-09-28)
- Perda de edições durante `git reset --hard` sem backup prévio
