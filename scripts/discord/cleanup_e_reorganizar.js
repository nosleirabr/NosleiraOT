/**
 * cleanup_e_reorganizar.js
 * 1. Apaga tudo que o bot criou (por ID exato)
 * 2. Renomeia categorias originais para o padrão correto
 * 3. Move canais para as categorias certas
 */
const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require("discord.js");

const BOT_TOKEN = "MTU1MDk0Njg0OTIyMzg2ODQ3Nw.G8TczK.LlFaIPBqhFjlmNAxwuCdy73-wkV3lHmmyYI1u8";
const GUILD_ID  = "1550944696761843915";

// ─── IDs criados pelo bot (apagar tudo isso) ─────────────────────────────────
const APAGAR_IDS = [
  // Categoria "[ 📢 ] INFORMAÇÕES E COMANDOS" + filhos
  "1552187954703896658",
  "1552187959166505000",
  "1552187963692154970",
  "1552187968280592475",
  "1552187973091729408",
  "1552187977814376519",
  // Categoria "[ 🎫 ] ATENDIMENTO E SUPORTE" + filhos
  "1552187982327320617",
  "1552187986882334750",
  "1552187991345205288",
  // Categoria "[ 🎮 ] COMUNIDADE E MÍDIA" + filhos
  "1552187995757478009",
  "1552188000392319067",
  "1552188005006057493",
  "1552188009443496076",
  // Duplicatas de voz criadas pelo bot
  "1552188014048837683", // [ 👥 ] Membros (novo)
  "1552188018662842400", // [ 🔊 ] Staff Voice (novo)
  "1552188023565713428", // [ 🔊 ] Geral 1 (novo)
  "1552188029160919100", // [ 🔊 ] Geral 2 (novo)
  "1552188034441683075", // [ 🎮 ] Jogando (novo)
  "1552188039369982053", // [ 🐉 ] Boss (novo)
  "1552188044403150948", // [ 💤 ] AFK (novo)
];

// ─── Renomeações de categorias originais ─────────────────────────────────────
const RENOMEAR_CATEGORIAS = {
  "1552119171138064424": "[ 📢 ] INFORMAÇÕES E COMANDOS", // MEMBER COUNT → INFO E COMANDOS
  "1550954693528657991": "[ 📢 ] INFORMAÇÕES E COMANDOS", // [ 📢 ] INFORMAÇÕES (será mesclada)
  "1550954755956674620": "[ 🎫 ] ATENDIMENTO E SUPORTE",
  "1550954710914179202": "[ 🎮 ] COMUNIDADE E MÍDIA",
  "1550954790240915557": "[ 🔊 ] CANAIS DE VOZ",
};

// ─── Mover canais para categoria certa (id_canal → id_categoria_destino) ─────
// Depois das renomeações, vamos mover canais individuais
const MOVER_CANAIS = {
  // Comandos-Geral (estava em MEMBER COUNT) → INFORMAÇÕES E COMANDOS (que era INFORMAÇÕES)
  "1552164314473832489": "1550954693528657991",
};

// ─── Renomeações de canais individuais ───────────────────────────────────────
const RENOMEAR_CANAIS = {
  "1552164314473832489": "[ 🤖 ] Comandos-Geral",
  "1552164320064962611": "[ 📢 ] Comunicados",
  "1552119197784477700": "[ ✍🏻 ] Atualizacoes",
  "1550954702198415382": "[ 🔱 ] Links",
  "1552139244770697278": "[ 🏆 ] Ranks",
  "1550954758905397271": "[ 🔴 ] Ticket-BR",
  "1550954806754021381": "[ 🔊 ] Staff Voice",
  "1550954696678580295": "[ ⛔ ] Regras",
  "1550954762067910706": "[ 📋 ] Log-Tickets",
  "1552123472535224440": "[ 🎥 ] Streamers",
  "1550954745051488266": "[ 📷 ] Screenshots",
  "1552108282926207097": "[ 📺 ] Clips",
  "1550954796452814878": "[ 🔊 ] Geral 1",
  "1550954799116320899": "[ 🔊 ] Geral 2",
  "1550954801473388679": "[ 🎮 ] Jogando",
  "1552119352810012762": "[ 🐉 ] Boss",
  "1550954803977257121": "[ 💤 ] AFK",
};

// ─── Mover canais para categoria correta após renomear ────────────────────────
// Queremos que Regras, Comunicados, Links, Atualizacoes fiquem em INFORMAÇÕES E COMANDOS
// Staff Voice e Log-Tickets fiquem em ATENDIMENTO E SUPORTE
// Streamers, Screenshots, Clips fiquem em COMUNIDADE E MÍDIA
// Usar ID da categoria de destino (após renomear)
const MOVER_PARA_CAT = {
  // id_canal → id_categoria_destino
  "1552164314473832489": "1550954693528657991", // Comandos-Geral → INFORMAÇÕES E COMANDOS
  "1552164320064962611": "1550954693528657991", // Comunicados → INFORMAÇÕES E COMANDOS
  "1552119197784477700": "1550954693528657991", // Atualizacoes → INFORMAÇÕES E COMANDOS
  "1550954702198415382": "1550954693528657991", // Links → INFORMAÇÕES E COMANDOS
  "1550954696678580295": "1550954693528657991", // Regras → INFORMAÇÕES E COMANDOS
  "1552139244770697278": "1550954693528657991", // Ranks → INFORMAÇÕES E COMANDOS
  "1550954806754021381": "1550954755956674620", // Staff Voice → ATENDIMENTO E SUPORTE
  "1552123472535224440": "1550954710914179202", // Streamers → COMUNIDADE E MÍDIA
  "1550954745051488266": "1550954710914179202", // Screenshots → COMUNIDADE E MÍDIA
  "1552108282926207097": "1550954710914179202", // Clips → COMUNIDADE E MÍDIA
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once("ready", async () => {
  console.log(`\nBot: ${client.user.tag}`);
  console.log("🧹 Iniciando limpeza e reorganização...\n");

  const guild = await client.guilds.fetch(GUILD_ID);
  await guild.channels.fetch();

  // ── ETAPA 1: Apagar canais criados pelo bot ──────────────────────────────
  console.log("─── ETAPA 1: Apagando duplicatas criadas pelo bot ───");
  // Apaga filhos primeiro, depois categorias
  const filhos  = APAGAR_IDS.filter(id => {
    const ch = guild.channels.cache.get(id);
    return ch && ch.type !== ChannelType.GuildCategory;
  });
  const cats = APAGAR_IDS.filter(id => {
    const ch = guild.channels.cache.get(id);
    return ch && ch.type === ChannelType.GuildCategory;
  });

  for (const id of [...filhos, ...cats]) {
    const ch = guild.channels.cache.get(id);
    if (!ch) { console.log(`  ℹ ${id} não encontrado (já apagado?)`); continue; }
    try {
      console.log(`  🗑  Apagando: "${ch.name}"`);
      await ch.delete("Cleanup — removendo duplicata criada pelo bot");
      await sleep(700);
    } catch (e) {
      console.log(`  ⚠ Erro ao apagar "${ch.name}": ${e.message}`);
    }
  }

  // Recarrega canais após deleções
  await guild.channels.fetch();

  // ── ETAPA 2: Renomear categorias originais ───────────────────────────────
  console.log("\n─── ETAPA 2: Renomeando categorias ───");
  const categoriasJaRenomeadas = new Set();
  for (const [id, novoNome] of Object.entries(RENOMEAR_CATEGORIAS)) {
    if (categoriasJaRenomeadas.has(novoNome)) continue; // evita renomear duas pro mesmo nome
    const ch = guild.channels.cache.get(id);
    if (!ch) { console.log(`  ℹ Categoria ${id} não encontrada`); continue; }
    if (ch.name === novoNome) { console.log(`  ✓ "${novoNome}" já ok`); categoriasJaRenomeadas.add(novoNome); continue; }
    try {
      console.log(`  ✏️  "${ch.name}" → "${novoNome}"`);
      await ch.setName(novoNome, "Reorganização Nosleira OT");
      categoriasJaRenomeadas.add(novoNome);
      await sleep(800);
    } catch (e) {
      console.log(`  ⚠ Erro: ${e.message}`);
    }
  }

  await guild.channels.fetch();

  // ── ETAPA 3: Renomear canais individuais ────────────────────────────────
  console.log("\n─── ETAPA 3: Renomeando canais ───");
  for (const [id, novoNome] of Object.entries(RENOMEAR_CANAIS)) {
    const ch = guild.channels.cache.get(id);
    if (!ch) { console.log(`  ℹ Canal ${id} não encontrado`); continue; }
    if (ch.name === novoNome) { console.log(`  ✓ "${novoNome}" já ok`); continue; }
    try {
      console.log(`  ✏️  "${ch.name}" → "${novoNome}"`);
      await ch.setName(novoNome, "Reorganização Nosleira OT");
      await sleep(800);
    } catch (e) {
      console.log(`  ⚠ Erro: ${e.message}`);
    }
  }

  await guild.channels.fetch();

  // ── ETAPA 4: Mover canais para categorias corretas ───────────────────────
  console.log("\n─── ETAPA 4: Movendo canais para categorias corretas ───");
  for (const [idCanal, idCat] of Object.entries(MOVER_PARA_CAT)) {
    const canal = guild.channels.cache.get(idCanal);
    const cat   = guild.channels.cache.get(idCat);
    if (!canal) { console.log(`  ℹ Canal ${idCanal} não encontrado`); continue; }
    if (!cat)   { console.log(`  ℹ Categoria ${idCat} não encontrada`); continue; }
    if (canal.parentId === idCat) { console.log(`  ✓ "${canal.name}" já está em "${cat.name}"`); continue; }
    try {
      console.log(`  📂 "${canal.name}" → "${cat.name}"`);
      await canal.setParent(idCat, { lockPermissions: false, reason: "Reorganização Nosleira OT" });
      await sleep(700);
    } catch (e) {
      console.log(`  ⚠ Erro: ${e.message}`);
    }
  }

  // ── ETAPA 5: Apagar categoria MEMBER COUNT (ficou vazia) ─────────────────
  console.log("\n─── ETAPA 5: Removendo categoria vazia (MEMBER COUNT) ───");
  await guild.channels.fetch();
  const memberCount = guild.channels.cache.get("1552119171138064424");
  if (memberCount) {
    const filhosRestantes = guild.channels.cache.filter(c => c.parentId === memberCount.id);
    if (filhosRestantes.size === 0) {
      try {
        console.log(`  🗑  Apagando categoria vazia: "${memberCount.name}"`);
        await memberCount.delete("Categoria vazia após reorganização");
        await sleep(700);
      } catch (e) {
        console.log(`  ⚠ Erro: ${e.message}`);
      }
    } else {
      console.log(`  ℹ Ainda tem ${filhosRestantes.size} canal(is) na MEMBER COUNT — não apagando`);
    }
  }

  console.log(`\n${"═".repeat(55)}`);
  console.log("  ✅ LIMPEZA E REORGANIZAÇÃO CONCLUÍDA!");
  console.log("═".repeat(55));
  client.destroy();
});

client.login(BOT_TOKEN);
