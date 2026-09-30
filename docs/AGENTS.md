# Nosleira OT 7.4 — agents

Monorepo GitHub: [nosleirabr/Oteserver7.4](https://github.com/nosleirabr/Oteserver7.4). Compose, mapas e datapack ficam **nesta** pasta (`D:\Server`). Não clone GitLab `opentibia-740/*`.

Dockerfile + `docker/entrypoint.sh` / `server` Dockerfile vivem neste repo. Terraform de nuvem (M5) é pasta/issue à parte e não misturar no datapack.

# Regras do Repositório GitHub
- NUNCA suba (upar) lixo para o repositório (como scripts python de teste, logs, arquivos .rar, ou dependências compiladas).
- O repositório Oteserver7.4 deve conter EXCLUSIVAMENTE o código-fonte real, verdadeiro e necessário para compor o server, site e client.


- NUNCA faça commits ou push diretamente na branch 'main' de forma automática e cega.
- Para cada nova tarefa, crie uma branch separada (ex: 'feature/quests-chests').
- Sempre converse com o usuário e peça autorização ANTES de fazer merge ou subir as paradas para a main. Explique o que foi feito e pergunte se 'está bom para mesclar'. Tudo deve ser feito através de conversa e aprovação.

- SEMPRE rode 'git push' para enviar a branch para o GitHub assim que o trabalho for concluído e abra um Pull Request para revisão. As branches nunca devem ficar esquecidas apenas localmente.
- NUNCA faça o merge do Pull Request para a 'main' sem que o usuário revise e autorize. O código sobe para aprovação.

- DIRETÓRIO PRINCIPAL OBRIGATÓRIO: Absolutamente TUDO (instalações, ferramentas, scripts de teste, rascunhos e operações de terminal) DEVE ser feito única e exclusivamente dentro do disco D (em `D:\Server`). NUNCA crie arquivos ou instale coisas no disco C: ou no Desktop do usuário para não lotar o computador.

- CACHE DO SITE: SEMPRE que você fizer qualquer alteração nos arquivos do site (PHP, HTML, CSS, layouts, menus, etc), você DEVE obrigatoriamente e automaticamente limpar o cache do MyAAC. Para limpar o cache, rode o seguinte comando no PowerShell: `Remove-Item -Path "d:\Server\site\system\cache\myaac_*" -Force; Remove-Item -Path "d:\Server\site\system\cache\route.cache" -Force; Remove-Item -Path "d:\Server\site\system\cache\twig\*" -Recurse -Force`. Nunca esqueça de fazer isso para o usuário ver as alterações imediatamente.

- LAYOUT DO SITE: NUNCA, sob nenhuma hipótese, use ou restaure o layout "Katherine Neo Layout" (ou kathrine). O layout oficial e padrão é OBRIGATORIAMENTE o "tibiacom" (tibia.com).

- FOCO E PRESERVAÇÃO DE CÓDIGO: Ao modificar qualquer arquivo, altere ESTRITAMENTE o que o usuário solicitou (não faça nem mais, nem menos). NUNCA remova, altere ou sobrescreva códigos, estilos ou lógicas que já existem no arquivo e que não fazem parte do pedido (ex: cores customizadas em menus, lógicas de layout, etc). Revise e respeite todo o código ao redor da sua modificação para garantir que customizações anteriores do usuário sejam 100% preservadas intactas.
