const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.channels.fetch();
    
    // Procura todos os canais que pareçam tickets (nome começando com ticket- ou debaixo da categoria SUPORTE)
    const ticketChannels = guild.channels.cache.filter(c => c.type === 0 && (c.name.startsWith('ticket-') && !c.name.includes('br') && !c.name.includes('dono')));
    
    if (ticketChannels.size > 0) {
      console.log(`Encontrados ${ticketChannels.size} canais de tickets abertos. Deletando...`);
      for (const ch of ticketChannels.values()) {
        console.log(`Deletando canal: ${ch.name}`);
        await ch.delete().catch(() => {});
      }
      console.log('✅ Canais de tickets apagados com sucesso.');
    } else {
      console.log('Nenhum canal de ticket aberto encontrado.');
    }
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    process.exit(0);
  }
});

client.login(process.env.TOKEN);
