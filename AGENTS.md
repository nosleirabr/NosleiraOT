# Server agents

TFS 1.2 / datapack 7.4. Open the parent workspace (opentibia-740/workspace) for Compose and maps bind-mount.

Dockerfile + docker/entrypoint.sh live in this repo. Do not put Terraform here.


# Regras do Repositorio GitHub
- NUNCA suba (upar) lixo para o repositorio (como scripts python de teste, logs, arquivos .rar, ou dependencias compiladas).
- O repositorio Oteserver7.4 deve conter EXCLUSIVAMENTE o codigo fonte real, verdadeiro e necessario para compor o server, site e client.


- NUNCA faca commits ou push diretamente na branch 'main' de forma automatica e cega.
- Para cada nova tarefa, crie uma branch separada (ex: 'feature/quests-chests').
- Sempre converse com o usuario e peca autorizacao ANTES de fazer merge ou subir as paradas para a main. Explique o que foi feito e pergunte se 'esta bom para mesclar'. Tudo deve ser feito atraves de conversa e aprovacao.
