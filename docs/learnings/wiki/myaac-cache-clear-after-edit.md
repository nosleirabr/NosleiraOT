# Cache do MyAAC — Limpar após toda edição no site

## Escopo

Qualquer edição em arquivos do site MyAAC (templates `.twig`, `.php`, `.css`, `.ini`) requer limpeza de cache imediata após a mudança, caso contrário o site continua servindo a versão antiga mesmo com o arquivo correto no disco.

## Regra obrigatória

> **Sempre que qualquer arquivo do site for editado, limpar o cache do MyAAC antes de reportar conclusão ao usuário.**

Isso inclui:
- Templates Twig (`.twig`)
- Arquivos PHP de páginas e boxes
- Arquivos de configuração (`config.ini`, `config.local.php`)
- CSS e assets do template

## Como limpar (comando padrão)

```powershell
# Limpa cache Twig + MyAAC e reinicia o site
docker compose exec site_executable sh -c "rm -rf /var/www/html/system/cache/twig/* && rm -f /var/www/html/system/cache/myaac_*"
```

## Por que acontece

O MyAAC usa dois níveis de cache:
1. **Cache MyAAC** (`myaac_*`) — dados PHP serializados
2. **Cache Twig** (`twig/`) — templates PHP compilados

Se o cache Twig não for limpo, o template antigo compilado continua sendo servido mesmo após editar o `.twig` original.

## Validação

Após limpar o cache, pedir ao usuário para fazer `Ctrl+Shift+R` no navegador para garantir que o browser também não está usando cache local.

## Fontes

- Sessão de debug do highscores box (2026-09-28)
- Comportamento confirmado ao editar `highscores.html.twig` sem limpar cache Twig
