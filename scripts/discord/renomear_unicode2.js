/**
 * renomear_unicode2.js — troca para 〔 emoji 〕 Nome nos canais de texto
 */
const { Client, GatewayIntentBits } = require("discord.js");

const BOT_TOKEN = "MTU1MDk0Njg0OTIyMzg2ODQ3Nw.G8TczK.LlFaIPBqhFjlmNAxwuCdy73-wkV3lHmmyYI1u8";
const GUILD_ID  = "1550944696761843915";

const RENOMEAR = {
  "1552164314473832489": "〔 🤖 〕 Comandos-Geral",
  "1552164320064962611": "〔 📢 〕 Comunicados",
  "1552119197784477700": "〔 ✍🏻 〕 Atualizacoes",
  "1550954702198415382": "〔 🔱 〕 Links",
  "1552139244770697278": "〔 🏆 〕 Ranks",
  "1550954758905397271": "〔 🔴 〕 Ticket-BR",
  "1550954696678580295": "〔 ⛔ 〕 Regras",
  "1550954762067910706": "〔 📋 〕 Log-Tickets",
  "1552123472535224440": "〔 🎥 〕 Streamers",
  "1550954745051488266": "〔 📸 〕 Screenshots",
  "1552108282926207097": "〔 📺 〕 Clips",
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", async () => {
  console.log(`Bot: ${client.user.tag}\nAplicando padrão 〔 〕...\n`);
  const guild = await client.guilds.fetch(GUILD_ID);
  await guild.channels.fetch();

  for (const [id, novoNome] of Object.entries(RENOMEAR)) {
    const canal = guild.channels.cache.get(id);
    if (!canal) { console.log(`  ℹ ${id} não encontrado`); continue; }
    try {
      console.log(`  ✏️  "${canal.name}" → "${novoNome}"`);
      await canal.setName(novoNome, "Padrão visual 〔 〕 Nosleira OT");
      await sleep(1000);
    } catch (e) {
      console.log(`  ⚠ Erro: ${e.message}`);
    }
  }

  console.log("\n✅ Pronto!");
  client.destroy();
});

client.login(BOT_TOKEN);
