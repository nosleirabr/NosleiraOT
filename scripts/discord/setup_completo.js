/**
 * setup_completo.js
 * 1. Renomeia categorias com letras bold Unicode
 * 2. Posta conteúdo em Atualizacoes e Comandos-Geral
 * 3. Registra slash commands no servidor
 */
const {
  Client, GatewayIntentBits, ChannelType, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes,
  SlashCommandBuilder, PermissionFlagsBits,
} = require("discord.js");

const BOT_TOKEN  = "MTU1MDk0Njg0OTIyMzg2ODQ3Nw.G8TczK.LlFaIPBqhFjlmNAxwuCdy73-wkV3lHmmyYI1u8";
const GUILD_ID   = "1550944696761843915";
const CLIENT_ID  = "1550946849223868477";

// IDs dos canais
const CH_ATUALIZACOES  = "1552119197784477700";
const CH_COMANDOS      = "1552164314473832489";

// IDs das categorias
const CATS = {
  "1550954693528657991": "[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦",
  "1550954755956674620": "[ 🎫 ] 𝗔𝗧𝗘𝗡𝗗𝗜𝗠𝗘𝗡𝗧𝗢 𝗘 𝗦𝗨𝗣𝗢𝗥𝗧𝗘",
  "1550954710914179202": "[ 🎮 ] 𝗖𝗢𝗠𝗨𝗡𝗜𝗗𝗔𝗗𝗘 𝗘 𝗠𝗜𝗗𝗜𝗔",
  "1550954790240915557": "[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭",
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── SLASH COMMANDS ───────────────────────────────────────────────────────────
const COMMANDS = [
  new SlashCommandBuilder().setName("site").setDescription("🌐 Link do site NosleiraOT"),
  new SlashCommandBuilder().setName("regras").setDescription("📜 Ver as regras do servidor"),
  new SlashCommandBuilder().setName("ticket").setDescription("🎫 Abrir um ticket de suporte"),
  new SlashCommandBuilder().setName("rank").setDescription("🏆 Ver o ranking de membros"),
  new SlashCommandBuilder().setName("discord").setDescription("💬 Link de convite do Discord"),
  new SlashCommandBuilder().setName("info").setDescription("ℹ️ Informações sobre o NosleiraOT"),
  new SlashCommandBuilder().setName("comandos").setDescription("🤖 Ver todos os comandos disponíveis"),
  new SlashCommandBuilder()
    .setName("rankup")
    .setDescription("📈 Anunciar rank-up de um membro (Staff)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption(o => o.setName("membro").setDescription("Membro que subiu de rank").setRequired(true))
    .addIntegerOption(o => o.setName("nivel").setDescription("Novo nível").setRequired(true).setMinValue(1).setMaxValue(99))
    .addStringOption(o => o.setName("horas").setDescription("Horas de atividade (ex: 2500h)").setRequired(false)),
];

async function registrarSlashCommands() {
  const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);
  console.log("📝 Registrando slash commands...");
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: COMMANDS.map(c => c.toJSON()) }
  );
  console.log(`  ✅ ${COMMANDS.length} slash commands registrados!`);
}

// ─── EMBED: ATUALIZAÇÕES ──────────────────────────────────────────────────────
function buildAtualizacoesEmbed() {
  return new EmbedBuilder()
    .setTitle("📝 Como funcionam as Atualizações")
    .setDescription(
      "Todas as atualizações do **NosleiraOT** são publicadas diretamente pelo site oficial.\n\n" +
      "🌐 **Acesse o site para ver as últimas novidades:**\n" +
      "**[www.nosleiraot.com](https://www.nosleiraot.com)**\n\n" +
      "📢 Grandes patches e eventos serão anunciados também aqui no Discord.\n" +
      "✅ Fique de olho neste canal para não perder nenhuma atualização!"
    )
    .setColor(0x5865F2)
    .setThumbnail("https://i.imgur.com/HX3oI2a.png")
    .setFooter({ text: "NosleiraOT 7.4 • Atualizações" })
    .setTimestamp();
}

// ─── EMBED: COMANDOS ──────────────────────────────────────────────────────────
function buildComandosEmbed() {
  return new EmbedBuilder()
    .setTitle("🤖 Comandos do NosleiraOT-BOT")
    .setDescription(
      "Use os **slash commands** — basta digitar `/` e clicar no comando!\n" +
      "Você também pode usar com `!` se preferir.\n\n" +
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    )
    .addFields(
      {
        name: "🌐 Servidor & Site",
        value: [
          "`/site` — Link do site NosleiraOT",
          "`/info` — Informações sobre o servidor",
          "`/discord` — Link de convite do Discord",
        ].join("\n"),
        inline: false,
      },
      {
        name: "📜 Regras & Suporte",
        value: [
          "`/regras` — Ver as regras completas",
          "`/ticket` — Abrir um ticket de suporte",
        ].join("\n"),
        inline: false,
      },
      {
        name: "🏆 Ranking",
        value: [
          "`/rank` — Ver o ranking de membros",
          "`/rankup @membro <nível>` — Anunciar rank-up *(Staff)*",
        ].join("\n"),
        inline: false,
      },
      {
        name: "💡 Como usar",
        value:
          "1️⃣ Digite `/` no chat\n" +
          "2️⃣ Clique no comando que aparece\n" +
          "3️⃣ Preencha os campos (se houver) e envie!",
        inline: false,
      },
    )
    .setColor(0xFFD700)
    .setFooter({ text: "NosleiraOT 7.4 • Comandos" })
    .setTimestamp();
}

// ─── BUTTONS: COMANDOS RÁPIDOS ────────────────────────────────────────────────
function buildComandosButtons() {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("🌐 Site").setStyle(ButtonStyle.Link).setURL("https://www.nosleiraot.com"),
      new ButtonBuilder().setCustomId("cmd_regras").setLabel("📜 Regras").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("cmd_ticket").setLabel("🎫 Ticket").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("cmd_rank").setLabel("🏆 Ranking").setStyle(ButtonStyle.Primary),
    ),
  ];
}

// ─── CLIENTE ──────────────────────────────────────────────────────────────────
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once("ready", async () => {
  console.log(`Bot: ${client.user.tag}\n`);
  const guild = await client.guilds.fetch(GUILD_ID);
  await guild.channels.fetch();

  // ── 1. Renomear categorias ─────────────────────────────────────────────────
  console.log("─── Renomeando categorias ───");
  for (const [id, novoNome] of Object.entries(CATS)) {
    const cat = guild.channels.cache.get(id);
    if (!cat) { console.log(`  ℹ ${id} não encontrado`); continue; }
    if (cat.name === novoNome) { console.log(`  ✓ "${novoNome}" já ok`); continue; }
    try {
      console.log(`  ✏️  "${cat.name}" → "${novoNome}"`);
      await cat.setName(novoNome);
      await sleep(800);
    } catch (e) { console.log(`  ⚠ ${e.message}`); }
  }

  // ── 2. Postar em Atualizações ──────────────────────────────────────────────
  console.log("\n─── Postando em Atualizacoes ───");
  const chAtual = guild.channels.cache.get(CH_ATUALIZACOES);
  if (chAtual) {
    // Apaga mensagens antigas do bot
    const msgs = await chAtual.messages.fetch({ limit: 10 });
    for (const [, m] of msgs) {
      if (m.author.id === client.user.id) await m.delete().catch(() => {});
    }
    await chAtual.send({ embeds: [buildAtualizacoesEmbed()] });
    console.log("  ✅ Atualizações postado!");
  }

  // ── 3. Postar em Comandos-Geral ────────────────────────────────────────────
  console.log("\n─── Postando em Comandos-Geral ───");
  const chCmds = guild.channels.cache.get(CH_COMANDOS);
  if (chCmds) {
    const msgs = await chCmds.messages.fetch({ limit: 10 });
    for (const [, m] of msgs) {
      if (m.author.id === client.user.id) await m.delete().catch(() => {});
    }
    await chCmds.send({ embeds: [buildComandosEmbed()], components: buildComandosButtons() });
    console.log("  ✅ Comandos postado!");
  }

  console.log("\n✅ Setup completo!");
  client.destroy();
});

client.login(BOT_TOKEN).then(() => registrarSlashCommands());
