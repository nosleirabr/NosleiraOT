# Dicionário Técnico de Programação (Glossário)

Este documento foi criado para registrar os termos técnicos e siglas em inglês usados no dia a dia do desenvolvimento do servidor, com suas traduções e explicações práticas em português.

Dessa forma, sempre que um termo aparecer no roteiro (Roadmap) ou no GitHub, você saberá exatamente o que ele significa e o que precisa ser feito.

### 1. Siglas do GitHub e do Projeto

* **CI (Continuous Integration)**
  * **O que é na prática:** Verificação automática de erros.
  * **Para que serve:** É um "robô" do GitHub que lê automaticamente todos os scripts (como os arquivos `.lua`) toda vez que alguém tenta enviar um código novo. Ele garante que o servidor não vai quebrar por causa de um erro de digitação ou código mal escrito.

* **PR (Pull Request)**
  * **O que é na prática:** Pedido de envio de código / Sugestão de mudança.
  * **Para que serve:** Quando terminamos de programar uma novidade (como adicionar as lojas dos NPCs), nós abrimos um "PR". É um pedido formal para juntar esse código novo com o código oficial do servidor.

* **QA (Quality Assurance) / Manual QA**
  * **O que é na prática:** Teste de qualidade feito com as próprias mãos dentro do jogo.
  * **O que é para fazer:** Quando você ver "Manual QA" no roteiro, significa que chegou a hora de você ligar o servidor, abrir o cliente do Tibia, criar um personagem e ir até o local testar se aquilo realmente funciona no jogo (por exemplo, tentar comprar uma espada no NPC ou testar o dano de uma magia).

### 2. Termos do Git (Controle de Versão)

* **Commit**
  * **O que é na prática:** Salvar o progresso.
  * **Para que serve:** É como um "ponto de salvamento" (save state) num jogo. Quando escrevemos um código que funciona, fazemos um *commit* para deixar aquilo guardado e com uma mensagem explicando o que foi feito.

* **Branch**
  * **O que é na prática:** Cópia de trabalho ou rascunho.
  * **Para que serve:** Ao invés de mexer no código oficial do servidor (a branch chamada `main`), nós criamos uma cópia temporária separada (branch) para fazer os testes e programar. Assim, se tudo der errado, o servidor original continua intacto.

* **Merge**
  * **O que é na prática:** Juntar as coisas.
  * **Para que serve:** É o ato de pegar todo o código que fizemos na nossa cópia de trabalho (branch) e, depois de ver que está tudo funcionando, juntar definitivamente no código principal do servidor (`main`).

### 3. Termos do Servidor

* **Datapack**
  * **O que é na prática:** A pasta de conteúdo do servidor.
  * **Para que serve:** É onde ficam os arquivos de configuração das magias (spells), monstros, mapa, baús e NPCs. Basicamente a pasta `server/data/`.

* **Source / Engine**
  * **O que é na prática:** O coração do servidor (código C++).
  * **Para que serve:** São as regras matemáticas pesadas do jogo (como a fórmula base de defesa da armadura ou o sistema que faz os jogadores andarem). Fica na pasta `server/src/`.
