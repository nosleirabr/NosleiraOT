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
  await guild.roles.fetch();

  // 1. Pinta o cargo principal do Bot (pos 33) de Vermelho #FF0000
  const botManagedRole = guild.roles.cache.get('1550952009237270678');
  if (botManagedRole) {
    console.log(`🎨 Pintando o cargo "${botManagedRole.name}" de vermelho...`);
    await botManagedRole.setColor('#FF0000').catch(err => console.error('Erro ao pintar:', err.message));
    console.log(`✅ Cargo ${botManagedRole.name} agora está vermelho!`);
  }

  await client.destroy();
});

client.login(env.TOKEN);
