const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('ready', async () => {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.channels.fetch();
    
    // Encontrar o canal de Bem-Vindos
    const canalBV = guild.channels.cache.find(c => c.name.toLowerCase().includes('bem-vindo') || c.name.includes('👋'));
    
    if (canalBV) {
      console.log(`Limpando canal: ${canalBV.name}`);
      let fetched;
      let count = 0;
      
      // Buscar as últimas 100 mensagens
      fetched = await canalBV.messages.fetch({ limit: 100 });
      
      // Ordenar por data de criação (a primeira mensagem = a mais antiga)
      const messagesArray = Array.from(fetched.values()).sort((a, b) => a.createdTimestamp - b.createdTimestamp);
      
      if (messagesArray.length > 0) {
        // A primeira mensagem (painel)
        const firstMsg = messagesArray[0];
        console.log(`Mantendo a mensagem original (Painel): ${firstMsg.id}`);
        
        // Deletar as demais
        for (let i = 1; i < messagesArray.length; i++) {
          await messagesArray[i].delete().catch(() => {});
          count++;
        }
      }
      console.log(`✅ Foram apagadas ${count} mensagens. O painel principal foi mantido!`);
    } else {
      console.log('Canal de boas-vindas não encontrado.');
    }
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    process.exit(0);
  }
});

client.login(process.env.TOKEN);
