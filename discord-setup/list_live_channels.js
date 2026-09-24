const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  await guild.channels.fetch();
  
  console.log('--- CANAIS ---');
  guild.channels.cache.filter(c => c.type === 0).forEach(c => {
    console.log(c.name);
  });
  
  process.exit(0);
});
client.login(process.env.TOKEN);
