const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once('ready', async () => {
  console.log(`🤖 Verificando canal de Bem-Vindos com ${client.user.tag}...`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) {
    console.error('❌ Servidor não encontrado!');
    process.exit(1);
  }

  await guild.channels.fetch();

  const chBemVindos = guild.channels.cache.find(
    (c) => (c.name.includes('bem-vindo') || c.name.includes('👋') || c.name.toLowerCase().includes('welcome')) && c.type === ChannelType.GuildText
  );

  if (!chBemVindos) {
    console.log('Canal de bem-vindos não encontrado');
    process.exit(0);
  }

  console.log(`Canal encontrado: #${chBemVindos.name} (${chBemVindos.id})`);

  const msgs = await chBemVindos.messages.fetch({ limit: 50 }).catch(() => null);
  if (msgs) {
    for (const msg of msgs.values()) {
      // Se a mensagem for sobre ticket ou comando de teste, apaga
      const texto = (msg.content || '') + (msg.embeds?.[0]?.description || '') + (msg.embeds?.[0]?.title || '');
      if (texto.toLowerCase().includes('ticket') || texto.toLowerCase().includes('atendimento') || texto.toLowerCase().includes('limite de criação')) {
        console.log(`🗑️ Apagando mensagem de ticket em #${chBemVindos.name}: ${msg.id}`);
        await msg.delete().catch(() => {});
      }
    }
  }

  console.log('✅ Limpeza do canal de Bem-Vindos concluída.');
  process.exit(0);
});

client.login(process.env.TOKEN);
