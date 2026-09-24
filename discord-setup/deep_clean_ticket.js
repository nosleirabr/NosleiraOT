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
      console.log(`Limpando 100% do canal: ${canalTicket.name}`);
      let messages;
      let lastId = null;
      let apagas = 0;
      let hasPanel = false;

      do {
        const options = { limit: 100 };
        if (lastId) options.before = lastId;
        messages = await canalTicket.messages.fetch(options);

        for (const msg of messages.values()) {
          // Verifica se é o painel de tickets (Tem embed e titulo com "Ticket" ou "Suporte" ou botões)
          const isPanel = msg.author.id === client.user.id && msg.components.length > 0 && msg.embeds.length > 0 && msg.embeds[0].title && msg.embeds[0].title.toLowerCase().includes('suporte');

          if (isPanel) {
            console.log(`Painel encontrado e mantido: ${msg.id}`);
            hasPanel = true;
          } else {
            await msg.delete().catch(() => {});
            apagas++;
          }
          lastId = msg.id;
        }
      } while (messages.size === 100);

      console.log(`✅ Limpeza total finalizada. Apagadas ${apagas} mensagens reais.`);
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
