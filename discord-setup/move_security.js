const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.channels.fetch();
    
    const securityChannel = guild.channels.cache.find(c => c.name.includes('🔒'));
    const regrasChannel = guild.channels.cache.find(c => c.name.includes('⛔'));
    
    if (securityChannel && regrasChannel) {
      const parentId = regrasChannel.parentId;
      
      // Move to same category
      if (securityChannel.parentId !== parentId) {
        await securityChannel.setParent(parentId, { lockPermissions: false });
        console.log('Movido para a categoria de Informações.');
      }
      
      // Set position
      await securityChannel.setPosition(regrasChannel.position + 1);
      console.log(`✅ Canal posicionado logo abaixo de ${regrasChannel.name}`);
    } else {
      console.log('Canais não encontrados!', {
        sec: securityChannel ? securityChannel.name : 'não achou',
        regras: regrasChannel ? regrasChannel.name : 'não achou'
      });
    }
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    process.exit(0);
  }
});

client.login(process.env.TOKEN);
