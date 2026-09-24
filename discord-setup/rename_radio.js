const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.channels.fetch();
    
    // Procura o canal
    const radioChannel = guild.channels.cache.find(c => c.name.includes('𝗿𝗲𝗴𝗿𝗮𝘀-𝗲-𝗰𝗼𝗺𝗮𝗻𝗱𝗼𝘀-𝗿𝗮𝗱𝗶𝗼') || c.name.includes('📜'));
    
    if (radioChannel) {
      // Usando espaço comum; se o Discord reclamar e colocar traço, usamos um espaço especial unicode (U+2005)
      // C = 𝗖, o = 𝗼, m = 𝗺, a = 𝗮, n = 𝗻, d = 𝗱, o = 𝗼, s = 𝘀
      // R = 𝗥, á = 𝗮́ (ou 𝗮\u0301), d = 𝗱, i = 𝗶, o = 𝗼
      const newName = '【📜】𝗖𝗼𝗺𝗮𝗻𝗱𝗼𝘀\u2005𝗥𝗮́𝗱𝗶𝗼';
      await radioChannel.edit({ name: newName });
      console.log(`✅ Canal de rádio renomeado para: ${newName}`);
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
