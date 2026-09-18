# Como Forkar e Criar Variantes do OT

A "base estável 7.4" foi projetada para ser limpa e servir como ponto de partida (upstream) para projetos customizados. Ao criar um fork deste repositório, você pode aplicar suas próprias customizações (como rates diferentes ou um mapa customizado) enquanto continua capaz de receber atualizações e correções de bugs da base principal.

Este guia cobre como criar sua própria variante e como publicá-la usando a infraestrutura do projeto.

---

## 1. Fazendo o Fork da Base Estável

Para criar sua variante, a melhor prática é utilizar a estrutura de repositórios do Git para manter um vínculo com a base original.

1. **Crie o Fork no GitHub:**
   Acesse a página deste repositório no GitHub e clique no botão **Fork**. Isso criará uma cópia do repositório na sua conta.

2. **Clone sua Variante Localmente:**
   ```bash
   git clone https://github.com/SEU_USUARIO/otserver.git
   cd otserver
   ```

3. **Adicione a Base Estável como Upstream:**
   Para poder puxar correções futuras, adicione o repositório original como um `remote` chamado `upstream`:
   ```bash
   git remote add upstream https://github.com/matosnathan/otserver.git
   ```

4. **Atualizando sua Variante (quando houver correções na base):**
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

---

## 2. Exemplo: Variante com Rates Customizadas

Para criar um servidor "High Exp" ou customizado sem alterar os arquivos do engine original, você altera as variáveis de ambiente e o arquivo de configuração de acordo com seu perfil.

1. **Alterando o `.env` ou `config.lua`:**
   Abra o arquivo `server/config.lua` (ou crie um perfil se estiver usando um sistema de templates) e modifique as rates principais:

   ```lua
   -- Rates Customizadas (Exemplo: 3x)
   rateExp = 3
   rateSkill = 3
   rateLoot = 2
   rateMagic = 2
   rateSpawn = 1
   ```

2. **Subindo para o Docker:**
   O container vai carregar o seu `config.lua` modificado. Nenhuma alteração no código C++ é necessária.
   ```bash
   docker compose up -d
   ```

---

## 3. Exemplo: Variante com Mapa Diferente

Se você deseja rodar um mapa customizado (como um Baiak ou seu próprio mapa RPG), você precisa substituir o mapa original que o servidor carrega.

1. **Adicionando os Arquivos do Mapa:**
   Coloque seu arquivo `.otbm` e o `.xml` de spawns/houses na pasta correspondente no datapack (geralmente `server/data/world/`).
   *Exemplo:* `server/data/world/baiak.otbm`, `baiak-spawn.xml`, `baiak-house.xml`.

2. **Ajustando o `config.lua`:**
   Abra seu `server/config.lua` e altere a chave `mapName` para apontar para o seu novo mapa (sem a extensão `.otbm`).

   ```lua
   -- Nome do mapa base
   mapName = "baiak"
   mapAuthor = "Seu Nome"
   ```

3. **Ajustando o Site (MyAAC):**
   Lembre-se de entrar no painel de admin do MyAAC (no site local `http://localhost:8080/admin`) e atualizar o nome do mapa nas opções do site para que as informações no portal reflitam o seu novo mapa.

---

## 4. Apontando a Variante na Infraestrutura (M5)

Na hora de fazer o deploy para produção, a infraestrutura (que utiliza Terraform e Docker Compose, detalhada em `docs/INFRA_ARCHITECTURE.md`) precisa saber que ela não deve baixar a imagem original, mas sim a *sua* imagem.

1. **Configuração de Build:**
   Se você modificou apenas arquivos da pasta `server/data/` ou o `config.lua`, você nem precisa recompilar o binário (TFS). O deploy pode simplesmente fazer um checkout da sua branch no servidor de produção e iniciar os containers normalmente usando os mapeamentos de volume.

2. **Ajustando a Pipeline (Opcional):**
   Caso modifique o C++ (`src/`), sua pipeline de CI/CD (GitHub Actions) compilará a nova imagem Docker.
   - Ajuste o Docker Registry na sua Action para publicar a imagem no *seu* registro (ex: `ghcr.io/seu_usuario/ot74-tfs:latest`).

3. **Injetando sua Imagem na Infraestrutura:**
   Modifique o seu `docker-compose.yml` de produção (ou o arquivo de definição do Terraform) para apontar para o repositório correto e a tag que você construiu.

   No `docker-compose.yml`:
   ```yaml
   services:
     tfs:
       # Mude isso para o SEU registro do Docker:
       image: ghcr.io/seu_usuario/ot74-tfs:latest
   ```

4. **Deploy Automático:**
   Quando você executar o script de deploy ou via CI, ele puxará as imagens da sua variante customizada e subirá o servidor seguindo as mesmas regras de hardening e portas detalhadas na documentação da base M5.
