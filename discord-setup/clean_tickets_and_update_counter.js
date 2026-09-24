const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  // Limpa os canais de ticket de teste que foram criados soltos
  const testTickets = guild.channels.cache.filter(
    (c) => c.name.startsWith('ticket-') && c.type === ChannelType.GuildText
  );

  for (const t of testTickets.values()) {
    console.log(`🗑️ Removendo ticket de teste: ${t.name} (${t.id})`);
    await t.delete('Limpeza de tickets de teste').catch(() => {});
  }

  // Atualiza canal de contagem de membros com 🟢[online] e 🔴[total]
  const chMembros = guild.channels.cache.find(
    (c) => (c.name.includes('Membros') || c.name.includes('👥')) && c.type === ChannelType.GuildVoice
  );

  const members = await guild.members.fetch().catch(() => null);
  const total = members ? members.filter((m) => !m.user.bot).size : guild.memberCount;
  const online = members
    ? members.filter((m) => m.presence && m.presence.status !== 'offline' && !m.user.bot).size
    : 1;

  if (chMembros) {
    const nomeMembros = `⌈ 👥 ⌋ Membros: 🟢[${online}] 🔴[${total}]`;
    await chMembros.setName(nomeMembros).catch(() => {});
    console.log(`✅ Canal de Membros atualizado: "${nomeMembros}"`);
  }

  console.log('✅ Pronto!');
  process.exit(0);
});

client.login(process.env.TOKEN);
