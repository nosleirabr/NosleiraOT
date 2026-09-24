/**
 * listar_canais.js — lista todos os canais do servidor com categoria
 * Rodar: node listar_canais.js
 */
const { Client, GatewayIntentBits, ChannelType } = require("discord.js");

const BOT_TOKEN = "MTU1MDk0Njg0OTIyMzg2ODQ3Nw.G8TczK.LlFaIPBqhFjlmNAxwuCdy73-wkV3lHmmyYI1u8";
const GUILD_ID  = "1550944696761843915";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", async () => {
  const guild = await client.guilds.fetch(GUILD_ID);
  await guild.channels.fetch();

  // Agrupa por categoria
  const categorias = guild.channels.cache
    .filter(c => c.type === ChannelType.GuildCategory)
    .sort((a, b) => a.position - b.position);

  const semCategoria = guild.channels.cache
    .filter(c => c.type !== ChannelType.GuildCategory && !c.parentId)
    .sort((a, b) => a.position - b.position);

  console.log(`\nServidor: ${guild.name} | Total canais: ${guild.channels.cache.size}\n`);

  if (semCategoria.size > 0) {
    console.log("📂 SEM CATEGORIA:");
    semCategoria.forEach(c => {
      const tipo = c.type === ChannelType.GuildVoice ? "🔊" : "💬";
      console.log(`  ${tipo} [${c.id}] ${c.name}`);
    });
  }

  categorias.forEach(cat => {
    console.log(`\n📁 [${cat.id}] ${cat.name}`);
    guild.channels.cache
      .filter(c => c.parentId === cat.id)
      .sort((a, b) => a.position - b.position)
      .forEach(c => {
        const tipo = c.type === ChannelType.GuildVoice ? "🔊" : "💬";
        console.log(`  ${tipo} [${c.id}] ${c.name}`);
      });
  });

  console.log("\n--- FIM ---");
  client.destroy();
});

client.login(BOT_TOKEN);
