const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.once('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (guild) {
    const me = await guild.members.fetchMe().catch(() => null);
    if (me && me.voice && me.voice.channel) {
      console.log(`🔌 Desconectando ${me.displayName} do canal de voz: ${me.voice.channel.name}...`);
      await me.voice.disconnect('Função de rádio delegada para o NosleiraOT-DJ').catch(() => {});
      console.log('✅ Desconectado com sucesso!');
    } else {
      console.log('ℹ️ O bot principal já não está em nenhum canal de voz.');
    }
  }
  process.exit(0);
});

client.login(process.env.TOKEN);
