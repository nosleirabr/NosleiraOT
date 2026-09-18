# Guia de Fork e Variantes do OT 7.4

Este guia detalha como você pode criar seu próprio servidor (uma variante) a partir do projeto base, mantendo as atualizações de estabilidade ("upstream") mas customizando a experiência (ex: rates diferentes, novo mapa, etc).

## 1. Como fazer um Fork (GitHub)

Para criar sua própria variante sem perder o acesso às atualizações do repositório principal:

1. Acesse o repositório principal no GitHub: `matosnathan/otserver`
2. No canto superior direito, clique no botão **Fork**.
3. Escolha o destino (sua conta pessoal ou organização).
4. Clone o seu novo repositório na sua máquina local:
   ```bash
   git clone https://github.com/SEU_USUARIO/otserver.git
   cd otserver
   ```
5. Mantenha o seu fork sincronizado com o repositório original adicionando-o como `upstream`:
   ```bash
   git remote add upstream https://github.com/matosnathan/otserver.git
   ```
   *Sempre que quiser as atualizações mais recentes do projeto base:*
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

## 2. Exemplo: Variante com Rates Custom (Exp, Loot, Skills)

Se o seu objetivo é criar um servidor com taxas de experiência ou loot diferentes (ex: um servidor "High Exp" ou "Enforced"), a configuração é feita diretamente no motor do jogo.

1. Abra o arquivo `server/config.lua`.
2. Localize a seção de `Rates` (geralmente por volta das primeiras dezenas de linhas).
3. Modifique as variáveis para a sua preferência. Exemplo para um servidor 3x:
   ```lua
   -- Rates
   -- NOTE: rateExp is not used if you have enabled stages in data/XML/stages.xml
   rateExp = 3
   rateSkill = 3
   rateLoot = 2
   rateMagic = 3
   rateSpawn = 2
   ```
4. Salve o arquivo, faça o commit na sua branch principal (`main` do seu fork) e envie para o GitHub:
   ```bash
   git add server/config.lua
   git commit -m "feat: configurando rates 3x"
   git push origin main
   ```

## 3. Exemplo: Variante de Mapa Diferente

Se você deseja rodar um mapa customizado (ex: um mapa próprio ou um Yurots editado) em vez do mapa padrão do Tibia 7.4:

1. Coloque os arquivos do seu mapa na pasta `maps/build/` ou crie uma subpasta própria em `maps/meu_mapa/` contendo os arquivos `.otbm` e os XMLs de houses e spawns.
2. Edite o arquivo `docker-compose.yml` na raiz do projeto para montar os arquivos corretos dentro do container TFS. Localize a seção `volumes` do serviço `tfs`:
   ```yaml
     tfs:
       # ...
       volumes:
         - ./server:/srv
         # Altere as 3 linhas abaixo para apontar para o seu mapa:
         - ./maps/meu_mapa/meu_mapa.otbm:/srv/data/world/world.otbm:ro
         - ./maps/meu_mapa/meu_mapa-spawn.xml:/srv/data/world/world-spawn.xml:ro
         - ./maps/meu_mapa/meu_mapa-house.xml:/srv/data/world/world-house.xml:ro
   ```
3. Alternativamente, você pode manter o `docker-compose.yml` intacto e editar o `server/config.lua` apontando para o nome do mapa:
   ```lua
   mapName = "meu_mapa"
   ```
   *(E garantir que o docker-compose passe a pasta inteira ou o novo mapa como volume).*
4. Salve, teste localmente rodando `docker compose up -d`, e faça o commit das alterações no seu fork.

## 4. Como Apontar a Variante na Infraestrutura M5

Na M5 (Módulo de Produção/Infraestrutura), o servidor roda em uma VM na nuvem (como um Droplet da DigitalOcean) com Docker Compose, Firewall (UFW) e proxy reverso.

Para colocar o **seu** fork em produção:

1. **Acesse sua VM** via SSH:
   ```bash
   ssh root@seu_ip_de_producao
   ```
2. **Clone o seu Fork** ao invés do repositório base:
   ```bash
   # Se o seu repo for privado, você precisará configurar uma Deploy Key ou Token
   git clone https://github.com/SEU_USUARIO/otserver.git /opt/otserver
   cd /opt/otserver
   ```
3. **Configure as Variáveis de Ambiente**:
   Crie o arquivo `.env` baseado no `.env.example` e preencha as senhas de banco de dados e domínios.
   ```bash
   cp .env.example .env
   nano .env
   ```
4. **Suba os Containers**:
   Execute o Docker Compose. Como você clonou o seu fork, o `docker-compose.yml` e o `server/config.lua` já conterão as suas rates customizadas e seus mapas.
   ```bash
   docker compose up -d --build
   ```
5. **Atualizando em Produção**:
   Quando você alterar algo no seu computador e fizer o `push` para o GitHub, basta entrar na VM e puxar as novidades:
   ```bash
   cd /opt/otserver
   git pull origin main
   docker compose restart tfs   # se foi só config.lua ou mapa
   # ou docker compose up -d --build (se mudou dockerfile)
   ```

Isso garante que você possa ter múltiplas VMs, cada uma rodando uma variante diferente (ex: "Server 1 - 1x", "Server 2 - 3x Custom Map") puxando de branches ou forks diferentes, aproveitando a mesma infraestrutura dockerizada robusta estabelecida na etapa M5.
