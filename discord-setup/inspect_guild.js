const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) {
    console.error('Guild not found');
    process.exit(1);
  }
  console.log('Guild:', guild.name);
  console.log('Features:', guild.features);

  const channels = await guild.channels.fetch();
  const sorted = [...channels.values()].sort((a, b) => (a.rawPosition || 0) - (b.rawPosition || 0));
  
  for (const c of sorted) {
    console.log(`[Type ${c.type}] "${c.name}" (id: ${c.id}) parent: ${c.parentId} pos: ${c.rawPosition}`);
  }
  process.exit(0);
});

client.login(process.env.TOKEN);
