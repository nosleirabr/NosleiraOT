# Server agents

TFS 1.2 / datapack 7.4. Open the parent workspace (opentibia-740/workspace) for Compose and maps bind-mount.

Dockerfile + docker/entrypoint.sh live in this repo. Do not put Terraform here.


# Regras do Repositorio GitHub
- NUNCA suba (upar) lixo para o repositorio (como scripts python de teste, logs, arquivos .rar, ou dependencias compiladas).
- O repositorio Oteserver7.4 deve conter EXCLUSIVAMENTE o codigo fonte real, verdadeiro e necessario para compor o server, site e client.


- NUNCA faca commits ou push diretamente na branch 'main' de forma automatica e cega.
- Para cada nova tarefa, crie uma branch separada (ex: 'feature/quests-chests').
- Sempre converse com o usuario e peca autorizacao ANTES de fazer merge ou subir as paradas para a main. Explique o que foi feito e pergunte se 'esta bom para mesclar'. Tudo deve ser feito atraves de conversa e aprovacao.

- SEMPRE rode 'git push' para enviar a branch para o GitHub assim que o trabalho for conclu√≠do e abra um Pull Request para revis√£o. As branches nunca devem ficar esquecidas apenas localmente.
- NUNCA fa√ßa o merge do Pull Request para a 'main' sem que o usu√°rio revise e autorize. O c√≥digo sobe para aprova√ß√£o.

- DIRET√ìRIO PRINCIPAL OBRIGAT√ìRIO: Absolutamente TUDO (instala√ß√µes, ferramentas, scripts de teste, rascunhos e opera√ß√µes de terminal) DEVE ser feito √∫nica e exclusivamente dentro do disco D (em `D:\Server`). NUNCA crie arquivos ou instale coisas no disco C: ou no Desktop do usu√°rio para n√£o lotar o computador.

- CACHE DO SITE: SEMPRE que voc√™ fizer qualquer altera√ß√£o nos arquivos do site (PHP, HTML, CSS, layouts, menus, etc), voc√™ DEVE obrigatoriamente e automaticamente limpar o cache do MyAAC. Para limpar o cache, rode o seguinte comando no PowerShell: `Remove-Item -Path "d:\Server\site\system\cache\myaac_*" -Force; Remove-Item -Path "d:\Server\site\system\cache\route.cache" -Force; Remove-Item -Path "d:\Server\site\system\cache\twig\*" -Recurse -Force`. Nunca esque√ßa de fazer isso para o usu√°rio ver as altera√ß√µes imediatamente.

- LAYOUT DO SITE: NUNCA, sob nenhuma hip√≥tese, use ou restaure o layout "Katherine Neo Layout" (ou kathrine). O layout oficial e padr√£o √© OBRIGATORIAMENTE o "tibiacom" (tibia.com).

- FOCO E PRESERVA«√O DE C”DIGO: Ao modificar qualquer arquivo, altere ESTRITAMENTE o que o usu·rio solicitou (n„o faÁa nem mais, nem menos). NUNCA remova, altere ou sobrescreva cÛdigos, estilos ou lÛgicas que j· existem no arquivo e que n„o fazem parte do pedido (ex: cores customizadas em menus, lÛgicas de layout, etc). Revise e respeite todo o cÛdigo ao redor da sua modificaÁ„o para garantir que customizaÁıes anteriores do usu·rio sejam 100% preservadas intactas.
