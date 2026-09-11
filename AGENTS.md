# Server agents

TFS 1.2 / datapack 7.4. Open the parent workspace (opentibia-740/workspace) for Compose and maps bind-mount.

Dockerfile + docker/entrypoint.sh live in this repo. Do not put Terraform here.


# Regras do Repositorio GitHub
- NUNCA suba (upar) lixo para o repositorio (como scripts python de teste, logs, arquivos .rar, ou dependencias compiladas).
- O repositorio Oteserver7.4 deve conter EXCLUSIVAMENTE o codigo fonte real, verdadeiro e necessario para compor o server, site e client.


- NUNCA faca commits ou push diretamente na branch 'main' de forma automatica e cega.
- Para cada nova tarefa, crie uma branch separada (ex: 'feature/quests-chests').
- Sempre converse com o usuario e peca autorizacao ANTES de fazer merge ou subir as paradas para a main. Explique o que foi feito e pergunte se 'esta bom para mesclar'. Tudo deve ser feito atraves de conversa e aprovacao.

- ABSOLUTAMENTE NUNCA rode 'git push' para enviar nada para o GitHub. Sincronizacoes para o Github so podem ser feitas quando o usuario EXPLICITAMENTE solicitar. Todas as edicoes, commits e criacoes de branches devem ficar restritas ao ambiente LOCAL (no disco D) ate que o usuario autorize o push.

- DIRETÓRIO PRINCIPAL OBRIGATÓRIO: Absolutamente TUDO (instalações, ferramentas, scripts de teste, rascunhos e operações de terminal) DEVE ser feito única e exclusivamente dentro do disco D (em `D:\Server`). NUNCA crie arquivos ou instale coisas no disco C: ou no Desktop do usuário para não lotar o computador.
