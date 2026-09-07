# Bugs de duplicação e clonagem de itens (Tibia 7.2 – 7.4 / OTServer)

Documentação técnica e histórica dos bugs de duplicação e clonagem de itens (*dupe bugs*) conhecidos nas versões 7.2 a 7.4 do Tibia clássico e em engines OpenTibia antigas, acompanhada das mitigações no TFS 1.2.

---

## 1. Crash & Rollback do Servidor (Dessincronização de Save)

- **Mecanismo:**
  1. O Jogador A entrega itens valiosos para o Jogador B (ou joga em um container/chão).
  2. O Jogador B desloga com sucesso, forçando o salvamento atômico do seu inventário no banco de dados.
  3. O Jogador A provoca um crash intencional na engine do servidor (usando overflow de pacotes malformados, overflow de fields/summons, scripts mal validados com crash C++).
  4. O servidor cai sem salvar o estado do mundo/Jogador A e reinicia a partir do último *Server Save*.
- **Impacto:** O Jogador A recupera seus itens do save anterior enquanto o Jogador B mantém os itens recebidos.
- **Mitigação TFS 1.2:** Uso de transações SQL atômicas (`IOLoginData`), proteção contra crash de scripts Lua e salvamentos periódicos consistentes.

---

## 2. Concorrência no Safe Trade (Trade Desync / Race Condition)

- **Mecanismo:**
  - Envio de múltiplos pacotes simultâneos de `Accept Trade`, `Cancel Trade` e `MoveItem` (via macros de pacotes / WPE) no mesmo *tick* do servidor.
  - Em engines sem mutex ou verificação atômica de posse de item, o servidor processava a transferência do item para o outro jogador e a devolução para a backpack de origem no mesmo frame.
- **Mitigação TFS 1.2:** Ações de movimentação em itens vinculados a uma sessão ativa de `Trade` são rejeitadas até o encerramento do handshake (`game.cpp`).

---

## 3. Container Loop / Nested Backpacks (Referência Circular)

- **Mecanismo:**
  - O jogador abria a Backpack principal em uma janela e uma sub-mochila em outra.
  - Movendo a mochila pai para dentro da mochila filha de forma rápida via macro ou injeção de pacotes, a engine gerava loops infinitos de ponteiros ou clonava instâncias do container na memória antes de validar hierarquia.
- **Mitigação TFS 1.2:** Verificação estrita com `isHoldingEnclosingContainer()` antes de qualquer `addItem()` ou `moveThing()`.

---

## 4. House Bed / Kick / Door Throw

- **Mecanismo:**
  - Utilizar a cama de uma casa (`sleep in bed`) para desconectar enquanto itens eram arremessados através da porta ou durante um comando de expulsão (`aleta sio` / `alana sio`).
  - O jogador era salvo dormindo com o equipamento original, mas a entidade física do item caía no chão da casa.
- **Mitigação TFS 1.2:** O logout por cama remove ou transfere os itens do jogador de forma síncrona antes de persistir o estado `isSleeping`.

---

## 5. Parcel & Mailbox Concurrency

- **Mecanismo:**
  - Arrastar uma parcel com itens no momento exato em que ela era enviada pelo mailbox ou quando atingia limites máximos de volume/slots com pushback.
- **Mitigação TFS 1.2:** Verificação de tile/mailbox e remoção do mapa antes de serializar a entrega no banco/depot.

---

## 6. Death & Logout Desync

- **Mecanismo:**
  - Forçar envio de pacote de logout no frame exato de morte (0 HP).
  - Em engines antigas, a thread de logout salvava o inventário antes do processamento do corpse drop.
- **Mitigação TFS 1.2:** Morte limpa a conexão e cancela qualquer solicitação pendente de logout normal.
