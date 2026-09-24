const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();
  const sorted = [...guild.channels.cache.values()].sort((a, b) => (a.rawPosition || 0) - (b.rawPosition || 0));

  console.log('--- LISTA DE CANAIS ATUAIS ---');
  for (const c of sorted) {
    console.log(`[Type ${c.type}] "${c.name}"`);
  }
  process.exit(0);
});

client.login(process.env.TOKEN);
