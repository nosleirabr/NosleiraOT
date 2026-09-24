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
  console.log(`🤖 Logado como ${client.user.tag}`);
  console.log('Servidores conectados:');
  client.guilds.cache.forEach(g => {
    console.log(`- ${g.name} (ID: ${g.id}) | Membros: ${g.memberCount}`);
  });
  await client.destroy();
});

client.login(env.TOKEN);
