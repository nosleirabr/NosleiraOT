const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  const members = await guild.members.fetch();
  console.log('--- LISTA DE MEMBROS E BOTS NO SERVIDOR ---');
  for (const m of members.values()) {
    console.log(`- ${m.user.tag} (ID: ${m.id}) | Bot: ${m.user.bot} | Nick: ${m.displayName}`);
  }
  process.exit(0);
});

client.login(process.env.TOKEN);
