/**
 * contadores.js
 * Cria categoria MEMBER COUNT no topo e dois canais de voz:
 *   🔴 Total: X  (total de membros)
 *   🟢 Online: X (membros online)
 * Atualiza a cada 10 minutos enquanto roda.
 *
 * Para rodar uma vez: node contadores.js
 * Para rodar sempre:  pm2 start contadores.js --name contadores
 */
const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require("discord.js");

const BOT_TOKEN = "MTU1MDk0Njg0OTIyMzg2ODQ3Nw.G8TczK.LlFaIPBqhFjlmNAxwuCdy73-wkV3lHmmyYI1u8";
const GUILD_ID  = "1550944696761843915";

// IDs salvos após primeira criação (preenche automaticamente)
let ID_CAT     = null;
let ID_TOTAL   = null;
let ID_ONLINE  = null;

const NOME_CAT    = "🏷️ MEMBER COUNT";
const PREFIXO_TOT = "🔴 Total";
const PREFIXO_ONL = "🟢 Online";

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences, // ← ative em Developer Portal → Bot → Presence Intent
  ],
});

async function garantirEstrutura(guild) {
  await guild.channels.fetch();

  // ── Categoria no topo ──────────────────────────────────────────────────────
  let cat = guild.channels.cache.find(
    c => c.type === ChannelType.GuildCategory && c.name === NOME_CAT
  );
  if (!cat) {
    console.log(`  📁 Criando categoria "${NOME_CAT}"...`);
    cat = await guild.channels.create({
      name: NOME_CAT,
      type: ChannelType.GuildCategory,
      position: 0,           // ← topo absoluto
      permissionOverwrites: [
        // @everyone só vê, não entra
        { id: guild.roles.everyone.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.Connect] },
      ],
      reason: "Contadores de membros NosleiraOT",
    });
    await sleep(800);
  }
  ID_CAT = cat.id;

  // ── Canal 🔴 Total ─────────────────────────────────────────────────────────
  let chTotal = guild.channels.cache.find(
    c => c.parentId === ID_CAT && c.name.startsWith("🔴")
  );
  if (!chTotal) {
    console.log("  🔴 Criando canal Total...");
    chTotal = await guild.channels.create({
      name: `${PREFIXO_TOT}: ...`,
      type: ChannelType.GuildVoice,
      parent: ID_CAT,
      position: 0,
      permissionOverwrites: [
        { id: guild.roles.everyone.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.Connect] },
      ],
      reason: "Contador total membros",
    });
    await sleep(800);
  }
  ID_TOTAL = chTotal.id;

  // ── Canal 🟢 Online ────────────────────────────────────────────────────────
  let chOnline = guild.channels.cache.find(
    c => c.parentId === ID_CAT && c.name.startsWith("🟢")
  );
  if (!chOnline) {
    console.log("  🟢 Criando canal Online...");
    chOnline = await guild.channels.create({
      name: `${PREFIXO_ONL}: ...`,
      type: ChannelType.GuildVoice,
      parent: ID_CAT,
      position: 1,
      permissionOverwrites: [
        { id: guild.roles.everyone.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.Connect] },
      ],
      reason: "Contador online membros",
    });
    await sleep(800);
  }
  ID_ONLINE = chOnline.id;
}

async function atualizar(guild) {
  await guild.members.fetch(); // garante cache atualizado

  const total  = guild.memberCount;
  const online = guild.members.cache.filter(
    m => !m.user.bot && m.presence && m.presence.status !== "offline"
  ).size;

  const chTotal  = guild.channels.cache.get(ID_TOTAL);
  const chOnline = guild.channels.cache.get(ID_ONLINE);

  const nomeTotal  = `🔴 Total: ${total.toLocaleString("pt-BR")}`;
  const nomeOnline = `🟢 Online: ${online}`;

  if (chTotal && chTotal.name !== nomeTotal) {
    await chTotal.setName(nomeTotal, "Atualização contador").catch(() => {});
    await sleep(500);
  }
  if (chOnline && chOnline.name !== nomeOnline) {
    await chOnline.setName(nomeOnline, "Atualização contador").catch(() => {});
  }

  const agora = new Date().toLocaleTimeString("pt-BR");
  console.log(`[${agora}] ✅ ${nomeTotal}  |  ${nomeOnline}`);
}

client.once("ready", async () => {
  console.log(`\nBot: ${client.user.tag}`);
  console.log("🔢 Iniciando contadores...\n");

  const guild = await client.guilds.fetch(GUILD_ID);

  // Cria canais se não existem
  await garantirEstrutura(guild);
  await guild.channels.fetch();

  // Atualiza imediatamente
  await atualizar(guild);

  // Atualiza a cada 10 minutos (Discord tem rate limit em rename)
  setInterval(async () => {
    const g = client.guilds.cache.get(GUILD_ID);
    if (g) await atualizar(g);
  }, 10 * 60 * 1000);

  console.log("\n🟢 Contadores ativos — atualizando a cada 10 min.");
  console.log("   Não feche esta janela!\n");
});

// Atualiza também quando alguém entra ou sai
client.on("guildMemberAdd",    () => { const g = client.guilds.cache.get(GUILD_ID); if (g) atualizar(g); });
client.on("guildMemberRemove", () => { const g = client.guilds.cache.get(GUILD_ID); if (g) atualizar(g); });

client.login(BOT_TOKEN);
