const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.channels.fetch();

    const chBemVindos = guild.channels.cache.find(c => c.name.includes('👋') || c.name.toLowerCase().includes('bem-vindo'));
    
    if (chBemVindos) {
      const novoNome = '【👋】𝐁𝐞𝐦-𝐕𝐢𝐧𝐝𝐨𝐬';
      await chBemVindos.setName(novoNome).catch(console.error);
      console.log(`✅ Bem-Vindos renomeado para: ${novoNome}`);
    } else {
      console.log('Canal não encontrado.');
    }
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    process.exit(0);
  }
});

client.login(process.env.TOKEN);
