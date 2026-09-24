const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('ready', async () => {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.channels.fetch();
    
    // Encontrar o canal Ticket-BR
    const canalTicket = guild.channels.cache.find(c => c.type === 0 && (c.name.includes('🔴') || c.name.toLowerCase().includes('ticket-br')));
    
    if (canalTicket) {
      console.log(`Limpando canal: ${canalTicket.name}`);
      let fetched = await canalTicket.messages.fetch({ limit: 100 });
      
      // Ordenar do mais antigo para o mais novo
      const messagesArray = Array.from(fetched.values()).sort((a, b) => a.createdTimestamp - b.createdTimestamp);
      
      let apagas = 0;
      if (messagesArray.length > 0) {
        // Ignora a primeira mensagem (o painel de tickets)
        console.log(`Mantendo o painel original: ${messagesArray[0].id}`);
        
        for (let i = 1; i < messagesArray.length; i++) {
          await messagesArray[i].delete().catch(() => {});
          apagas++;
        }
      }
      console.log(`✅ Apagadas ${apagas} mensagens interativas no canal Ticket-BR. Painel mantido intacto.`);
    } else {
      console.log('Canal Ticket-BR não encontrado.');
    }
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    process.exit(0);
  }
});

client.login(process.env.TOKEN);
