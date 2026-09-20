const { Client, GatewayIntentBits } = require('discord.js');
const TOKEN    = 'MTU1MDk0Njg0OTIyMzg2ODQ3Nw.GbKhS5.cStGJn59ObTX8lv-URRPVjSBuoqHg2X0gy64eQ';
const GUILD_ID = '1550944696761843915';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log('Limpando categorias antigas...');
  const guild = client.guilds.cache.get(GUILD_ID);
  
  const alvos = ['Tekstkanalen', 'Spraakkanalen', 'Text Channels', 'Voice Channels'];
  
  let apagados = 0;
  for (const [id, channel] of guild.channels.cache) {
    if (alvos.includes(channel.name)) {
      try {
        await channel.delete();
        console.log(`Deletado: ${channel.name}`);
        apagados++;
      } catch (e) {
        console.log(`Erro ao deletar ${channel.name}:`, e.message);
      }
    }
  }
  
  console.log(`\nFinalizado! ${apagados} canais/categorias apagados.`);
  client.destroy();
});

client.login(TOKEN);
