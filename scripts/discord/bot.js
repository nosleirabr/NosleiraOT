/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║   NOSLEIRA OT — BOT PRINCIPAL (PERSISTENTE)                 ║
 * ║   bot.js — fica rodando 24/7                                ║
 * ║   Funcionalidades:                                          ║
 * ║     • Sistema de tickets (abre/fecha canais)                ║
 * ║     • Painel de suporte no canal Ticket-BR                  ║
 * ║     • Anúncio de rank-up no canal Ranks                     ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Para iniciar: node bot.js
 * Para rodar em background: use pm2 (npm install -g pm2)
 *   pm2 start bot.js --name nosleira-bot
 *   pm2 save
 *   pm2 startup
 */

const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

// ─── CONFIGURAÇÕES ────────────────────────────────────────────────────────────
const BOT_TOKEN = "SEU_TOKEN_NOVO_AQUI"; // ← após resetar, cole o novo token aqui
const GUILD_ID  = "1550944696761843915";

// IDs dos canais (fixos — não mudam mesmo se renomear)
const CH_TICKET_BR   = "1550954758905397271"; // 〔 🔴 〕 Ticket-BR
const CH_LOG_TICKETS = "1550954762067910706"; // 〔 📋 〕 Log-Tickets
const CH_RANKS       = "1552139244770697278"; // 〔 🏆 〕 Ranks
const CAT_SUPORTE    = "1550954755956674620"; // [ 🎫 ] ATENDIMENTO E SUPORTE

// Cargos que podem ver e gerenciar tickets
const CARGOS_STAFF   = ["dono", "owner", "admin", "administrador", "staff", "mod"];
// ──────────────────────────────────────────────────────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ─── PAINEL DE SUPORTE ────────────────────────────────────────────────────────
function buildPainelEmbed() {
  return new EmbedBuilder()
    .setTitle("🎫  Suporte NosleiraOT")
    .setDescription(
      "Precisa de ajuda? Abra um ticket!\n\n" +
      "🐛 **Bug no jogo**  •  💳 **Pagamento**  •  🎁 **Item de donate**\n" +
      "👤 **Conta**  •  🚨 **Denúncia**  •  ❓ **Dúvida**\n" +
      "🔑 **Recover Key**  •  🔓 **Remover 2FA**  •  👑 **Falar com o Dono**\n\n" +
      "Clique no menu abaixo e escolha o assunto.\n" +
      "⏱️ Tempo médio de resposta: até 24 horas."
    )
    .setColor(0xFF4444)
    .setThumbnail("https://i.imgur.com/HX3oI2a.png") // logo do servidor
    .setFooter({ text: "NosleiraOT • Suporte Oficial" });
}

function buildPainelMenu() {
  const menu = new StringSelectMenuBuilder()
    .setCustomId("ticket_categoria")
    .setPlaceholder("📋 Escolha o motivo do ticket...")
    .addOptions(
      new StringSelectMenuOptionBuilder().setLabel("Bug no jogo").setValue("bug").setEmoji("🐛"),
      new StringSelectMenuOptionBuilder().setLabel("Pagamento").setValue("pagamento").setEmoji("💳"),
      new StringSelectMenuOptionBuilder().setLabel("Item de donate").setValue("donate").setEmoji("🎁"),
      new StringSelectMenuOptionBuilder().setLabel("Problema na conta").setValue("conta").setEmoji("👤"),
      new StringSelectMenuOptionBuilder().setLabel("Denúncia").setValue("denuncia").setEmoji("🚨"),
      new StringSelectMenuOptionBuilder().setLabel("Dúvida").setValue("duvida").setEmoji("❓"),
      new StringSelectMenuOptionBuilder().setLabel("Recover Key").setValue("recover").setEmoji("🔑"),
      new StringSelectMenuOptionBuilder().setLabel("Remover 2FA").setValue("2fa").setEmoji("🔓"),
      new StringSelectMenuOptionBuilder().setLabel("Falar com o Dono").setValue("dono").setEmoji("👑"),
    );
  return new ActionRowBuilder().addComponents(menu);
}

// ─── EMBED DE TICKET ABERTO ───────────────────────────────────────────────────
function buildTicketEmbed(membro, categoria) {
  const labels = {
    bug: "🐛 Bug no jogo", pagamento: "💳 Pagamento", donate: "🎁 Item de donate",
    conta: "👤 Problema na conta", denuncia: "🚨 Denúncia", duvida: "❓ Dúvida",
    recover: "🔑 Recover Key", "2fa": "🔓 Remover 2FA", dono: "👑 Falar com o Dono",
  };
  return new EmbedBuilder()
    .setTitle(`${labels[categoria] || "Ticket"} — Aberto`)
    .setDescription(
      `Olá, ${membro}!\n\n` +
      `Seu ticket foi aberto com sucesso.\n` +
      `**Assunto:** ${labels[categoria]}\n\n` +
      `Por favor, descreva seu problema em detalhes.\n` +
      `Nossa equipe responderá em breve. ⏱️`
    )
    .setColor(0x00CC66)
    .setThumbnail(membro.displayAvatarURL())
    .setFooter({ text: "NosleiraOT • Suporte" })
    .setTimestamp();
}

function buildFecharButton() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("fechar_ticket")
      .setLabel("🔒 Fechar Ticket")
      .setStyle(ButtonStyle.Danger)
  );
}

// ─── EMBED DE RANK-UP ─────────────────────────────────────────────────────────
const RANK_TABLE = {
  1: ["Aventureiro", "🗡️"], 2: ["Explorador", "🧭"], 3: ["Guerreiro", "⚔️"],
  4: ["Caçador", "🏹"], 5: ["Veterano", "🛡️"], 6: ["Herói", "✨"],
  7: ["Lendário", "🌟"], 8: ["Elite de Nosleira", "💎"], 9: ["Guardião", "🔱"],
  10: ["Imortal de Nosleira", "◆"], 15: ["Mestre Antigo", "👑"], 20: ["Transcendente", "🌌"],
};

function getRankInfo(nivel) {
  let info = ["Aventureiro", "🗡️"];
  for (const lvl of Object.keys(RANK_TABLE).map(Number).sort((a,b)=>a-b)) {
    if (nivel >= lvl) info = RANK_TABLE[lvl];
  }
  return info;
}

function buildRankEmbed(membro, nivel, titulo, emoji, horas = null) {
  const embed = new EmbedBuilder()
    .setDescription(
      `### 🎉  ${membro}  subiu de rank!\n\n` +
      `> ${emoji}  **◆ ${nivel} · ${titulo}**\n` +
      (horas ? `> ⏱️  \`${horas}\` de atividade no servidor\n` : "") +
      `\n> *Dedicação recompensada. Parabéns!*  🏆`
    )
    .setColor(0xFFD700)
    .setAuthor({ name: "Nosleira OT — Sistema de Ranks" })
    .setThumbnail(membro.displayAvatarURL())
    .addFields(
      { name: "◆ Novo Rank", value: `\`\`\`◆ ${nivel} · ${titulo}\`\`\``, inline: true },
      { name: "📈 Nível", value: `\`\`\`${nivel}\`\`\``, inline: true },
    )
    .setFooter({ text: `NosleiraOT 7.4  •  ${membro.user.tag}` })
    .setTimestamp();
  if (horas) embed.addFields({ name: "⏱️ Atividade", value: `\`\`\`${horas}\`\`\``, inline: true });
  return embed;
}

// ─── HELPER: achar cargos de staff ────────────────────────────────────────────
function getStaffRoles(guild) {
  return guild.roles.cache.filter(r =>
    CARGOS_STAFF.some(s => r.name.toLowerCase().includes(s))
  );
}

// ─── EVENTO: BOT PRONTO ───────────────────────────────────────────────────────
client.once("ready", async () => {
  console.log(`\n✅ ${client.user.tag} online!`);
  console.log(`   Servidor : ${GUILD_ID}`);
  console.log(`   Tickets  : canal ${CH_TICKET_BR}`);
  console.log(`   Ranks    : canal ${CH_RANKS}`);
  console.log("\n🟢 Bot rodando — não feche esta janela!\n");
});

// ─── INTERAÇÕES (botões e menus) ──────────────────────────────────────────────
client.on("interactionCreate", async (interaction) => {

  // ── Menu: abrir ticket ──────────────────────────────────────────────────────
  if (interaction.isStringSelectMenu() && interaction.customId === "ticket_categoria") {
    await interaction.deferReply({ ephemeral: true });

    const categoria = interaction.values[0];
    const membro    = interaction.member;
    const guild     = interaction.guild;

    // Verifica se já tem ticket aberto para este usuário
    const nomeCanal = `ticket-${membro.user.username.toLowerCase().replace(/[^a-z0-9]/g, "")}-${Date.now().toString().slice(-4)}`;
    const jaExiste  = guild.channels.cache.find(
      c => c.name.startsWith(`ticket-${membro.user.username.toLowerCase().replace(/[^a-z0-9]/g, "")}`)
    );

    if (jaExiste) {
      return interaction.editReply({
        content: `❌ Você já tem um ticket aberto em ${jaExiste}. Feche-o antes de abrir outro.`,
      });
    }

    // Permissões do canal de ticket
    const staffRoles = getStaffRoles(guild);
    const overwrites = [
      { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
      { id: membro.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
    ];
    staffRoles.forEach(r => {
      overwrites.push({ id: r.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ReadMessageHistory] });
    });

    // Busca o canal oficial de tickets
    const canalTicketBase = guild.channels.cache.get(CH_TICKET_BR) || guild.channels.cache.find(
      c => c.name.toLowerCase().includes('ticket') && c.type === ChannelType.GuildText
    );

    if (!canalTicketBase) {
      return interaction.editReply({ content: '❌ Canal oficial de tickets não encontrado.' });
    }

    // Cria subtópico privado estritamente dentro do canal de tickets
    const canal = await canalTicketBase.threads.create({
      name: nomeCanal,
      autoArchiveDuration: 1440,
      type: ChannelType.PrivateThread,
      reason: `Ticket aberto por ${membro.user.tag}`,
    });

    await canal.members.add(membro.id).catch(() => {});

    // Manda embed no canal do ticket
    await canal.send({
      embeds: [buildTicketEmbed(membro, categoria)],
      components: [buildFecharButton()],
    });

    // Log no canal de logs
    const logCh = guild.channels.cache.get(CH_LOG_TICKETS);
    if (logCh) {
      await logCh.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("📋 Novo Ticket Aberto")
            .addFields(
              { name: "Usuário", value: `${membro} (${membro.user.tag})`, inline: true },
              { name: "Canal", value: `${canal}`, inline: true },
              { name: "Assunto", value: categoria, inline: true },
            )
            .setColor(0x00CC66)
            .setTimestamp(),
        ],
      });
    }

    await interaction.editReply({ content: `✅ Ticket aberto em ${canal}!` });
  }

  // ── Botão: fechar ticket ────────────────────────────────────────────────────
  if (interaction.isButton() && interaction.customId === "fechar_ticket") {
    await interaction.reply({ content: "🔒 Fechando ticket em 5 segundos...", ephemeral: false });

    // Log no canal de logs
    const logCh = interaction.guild.channels.cache.get(CH_LOG_TICKETS);
    if (logCh) {
      await logCh.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("📋 Ticket Fechado")
            .addFields(
              { name: "Canal", value: interaction.channel.name, inline: true },
              { name: "Fechado por", value: `${interaction.member}`, inline: true },
            )
            .setColor(0xFF4444)
            .setTimestamp(),
        ],
      });
    }

    setTimeout(() => interaction.channel.delete("Ticket fechado"), 5000);
  }
});

// ─── COMANDO !painel — posta o painel de suporte ──────────────────────────────
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.member?.permissions.has(PermissionFlagsBits.ManageChannels)) return;

  // !painel → posta painel no canal Ticket-BR
  if (message.content === "!painel") {
    const canal = message.guild.channels.cache.get(CH_TICKET_BR);
    if (!canal) return message.reply("❌ Canal Ticket-BR não encontrado.");
    await canal.send({ embeds: [buildPainelEmbed()], components: [buildPainelMenu()] });
    await message.reply(`✅ Painel postado em ${canal}!`);
    await message.delete().catch(() => {});
  }

  // !rankup @user <nivel> [horas]
  if (message.content.startsWith("!rankup")) {
    const args   = message.content.split(" ");
    const menção = message.mentions.members.first();
    const nivel  = parseInt(args[2]) || 1;
    const horas  = args[3] || null;

    if (!menção) return message.reply("❌ Uso: `!rankup @usuario <nivel> [horas]`");

    const [titulo, emoji] = getRankInfo(nivel);
    const canalRanks = message.guild.channels.cache.get(CH_RANKS);
    if (!canalRanks) return message.reply("❌ Canal Ranks não encontrado.");

    await canalRanks.send({ embeds: [buildRankEmbed(menção, nivel, titulo, emoji, horas)] });
    await message.reply(`✅ Anúncio postado em ${canalRanks}!`);
  }

  // !testerank → posta rank de teste do próprio usuário
  if (message.content === "!testerank") {
    const canalRanks = message.guild.channels.cache.get(CH_RANKS);
    if (!canalRanks) return message.reply("❌ Canal Ranks não encontrado.");
    const [titulo, emoji] = getRankInfo(10);
    await canalRanks.send({
      embeds: [buildRankEmbed(message.member, 10, titulo, emoji, "2500h de atividade")],
    });
    await message.reply(`✅ Teste postado em ${canalRanks}!`);
  }
});

// ─── INICIAR ──────────────────────────────────────────────────────────────────
if (BOT_TOKEN === "SEU_TOKEN_NOVO_AQUI") {
  console.error("❌ Cole o novo token em BOT_TOKEN antes de iniciar!");
  process.exit(1);
}

client.login(BOT_TOKEN);
