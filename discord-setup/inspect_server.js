const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  const guild = client.guilds.cache.get(env.GUILD_ID);
  await guild.channels.fetch();
  await guild.roles.fetch();

  console.log('--- ROLES ---');
  guild.roles.cache.forEach(r => console.log(`[${r.id}] ${r.name} (pos: ${r.position}, color: ${r.hexColor})`));

  console.log('\n--- CHANNELS ---');
  guild.channels.cache.forEach(c => console.log(`[${c.id}] ${c.type} -> ${c.name} (parent: ${c.parentId})`));

  await client.destroy();
});

client.login(env.TOKEN);
