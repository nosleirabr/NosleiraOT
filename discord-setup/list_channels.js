const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();
  console.log('=== CANAIS DO SERVIDOR ===');
  guild.channels.cache.forEach((c) => {
    console.log(`[${c.type}] ${c.name} (ID: ${c.id})`);
  });
  process.exit(0);
});

client.login(process.env.TOKEN);
