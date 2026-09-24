const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.channels.fetch();
    
    // Procura o canal que acabamos de criar
    const securityChannel = guild.channels.cache.find(c => c.name.includes('🔒'));
    
    if (securityChannel) {
      const newName = '【🔒】𝗟𝗼𝗴-𝗦𝗲𝗴𝘂𝗿𝗮𝗻𝗰𝗮';
      await securityChannel.edit({ name: newName });
      console.log(`✅ Canal renomeado para o padrão exato: ${newName}`);
    } else {
      console.log('Canal de segurança não encontrado para renomear.');
    }
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    process.exit(0);
  }
});

client.login(process.env.TOKEN);
