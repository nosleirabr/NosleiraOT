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

console.log('Testing bot connection...');
console.log('Guild ID:', env.GUILD_ID);

async function testToken(name, token) {
  if (!token) return;
  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
  try {
    await client.login(token);
    console.log(`✅ [${name}] Conectado com sucesso como: ${client.user.tag} (${client.user.id})`);
    const guild = client.guilds.cache.get(env.GUILD_ID);
    if (guild) {
      console.log(`🏰 [${name}] Servidor encontrado: ${guild.name} (${guild.memberCount} membros)`);
    } else {
      console.log(`⚠️ [${name}] Servidor GUILD_ID não encontrado no cache do bot.`);
    }
    await client.destroy();
  } catch (err) {
    console.log(`❌ [${name}] Falha:`, err.message);
  }
}

async function run() {
  await testToken('BOT_PRINCIPAL', env.TOKEN);
  await testToken('RADIO_DJ', env.RADIO_TOKEN);
}

run();
