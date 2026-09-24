const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('ready', async () => {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.channels.fetch();
    
    const canalComunicados = guild.channels.cache.find(c => c.type === 0 && c.name.includes('📢'));
    
    if (canalComunicados) {
      console.log(`Limpando canal: ${canalComunicados.name}`);
      let fetched = await canalComunicados.messages.fetch({ limit: 100 });
      let apagas = 0;
      
      // Apagar todas as mensagens enviadas pelo bot que pareçam boas-vindas
      for (const msg of fetched.values()) {
        if (msg.author.id === client.user.id) {
          const hasTitle = msg.embeds.length > 0 && msg.embeds[0].title && msg.embeds[0].title.toLowerCase().includes('bem-vindo');
          const hasDesc = msg.embeds.length > 0 && msg.embeds[0].description && msg.embeds[0].description.toLowerCase().includes('bem-vindo');
          const hasText = msg.content && msg.content.toLowerCase().includes('bem-vindo');
          
          if (hasTitle || hasDesc || hasText) {
             await msg.delete().catch(() => {});
             apagas++;
          }
        }
      }
      console.log(`✅ Apagadas ${apagas} mensagens de boas-vindas indevidas no canal Comunicados.`);
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
