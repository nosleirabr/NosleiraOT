/**
 * atualizar_comandos.js
 * - Remove botões que precisam do bot online (causam "não respondeu a tempo")
 * - Deixa só botão Link (Site) que funciona sempre
 * - Atualiza embed de comandos sem hífens no separador
 */
const {
  Client, GatewayIntentBits, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require("discord.js");

const BOT_TOKEN = "MTU1MDk0Njg0OTIyMzg2ODQ3Nw.G8TczK.LlFaIPBqhFjlmNAxwuCdy73-wkV3lHmmyYI1u8";
const GUILD_ID  = "1550944696761843915";
const CH_COMANDOS = "1552164314473832489";

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once("ready", async () => {
  console.log(`Bot: ${client.user.tag}`);
  const guild = await client.guilds.fetch(GUILD_ID);
  await guild.channels.fetch();

  const canal = guild.channels.cache.get(CH_COMANDOS);
  if (!canal) { console.log("Canal não encontrado"); client.destroy(); return; }

  // Apaga mensagens antigas do bot
  const msgs = await canal.messages.fetch({ limit: 20 });
  for (const [, m] of msgs) {
    if (m.author.id === client.user.id) {
      await m.delete().catch(() => {});
      await sleep(500);
    }
  }

  // Embed limpo, sem separador de hífens, sem botões que precisam do bot
  const embed = new EmbedBuilder()
    .setTitle("🤖  Comandos do NosleiraOT-BOT")
    .setDescription(
      "Use os **slash commands** — basta digitar `/` e clicar!\n" +
      "Ou use o prefixo `!` se preferir.\n"
    )
    .addFields(
      {
        name: "🌐  Servidor & Site",
        value:
          "> `/site` — Link oficial do NosleiraOT\n" +
          "> `/info` — Informações sobre o servidor\n" +
          "> `/discord` — Link de convite do Discord",
      },
      {
        name: "📜  Regras & Suporte",
        value:
          "> `/regras` — Ver as regras completas\n" +
          "> `/ticket` — Abrir um ticket de suporte",
      },
      {
        name: "🏆  Ranking",
        value:
          "> `/rank` — Ver o ranking de membros\n" +
          "> `/rankup @membro <nível>` — Anunciar rank-up *(Staff)*",
      },
      {
        name: "💡  Como usar",
        value:
          "> 1️⃣  Digite `/` no chat\n" +
          "> 2️⃣  Clique no comando que aparecer\n" +
          "> 3️⃣  Preencha os campos e envie!",
      },
    )
    .setColor(0xFFD700)
    .setFooter({ text: "NosleiraOT 7.4  •  Comandos" })
    .setTimestamp();

  // Só botão de link — funciona SEM bot rodando
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("🌐  Acessar Site")
      .setStyle(ButtonStyle.Link)
      .setURL("https://www.nosleiraot.com"),
    new ButtonBuilder()
      .setLabel("🎫  Abrir Ticket")
      .setStyle(ButtonStyle.Link)
      .setURL("https://www.nosleiraot.com"),
  );

  await canal.send({ embeds: [embed], components: [row] });
  console.log("✅ Embed de comandos atualizado sem erros!");
  client.destroy();
});

client.login(BOT_TOKEN);
