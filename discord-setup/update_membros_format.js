const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  // Garante a categoria MEMBER COUNT
  let cat = guild.channels.cache.find(
    (c) => c.name.toUpperCase().includes('MEMBER COUNT') && c.type === ChannelType.GuildCategory
  );
  if (!cat) {
    cat = await guild.channels.create({
      name: 'MEMBER COUNT',
      type: ChannelType.GuildCategory,
      position: 0,
    });
  } else {
    await cat.setPosition(0).catch(() => {});
  }

  // Busca o canal de voz de contagem de membros
  let ch = guild.channels.cache.find(
    (c) => (c.name.includes('Membros') || c.name.includes('👥')) && c.type === ChannelType.GuildVoice
  );

  const members = await guild.members.fetch().catch(() => null);
  const total = members ? members.filter((m) => !m.user.bot).size : guild.memberCount;
  const online = members
    ? members.filter((m) => m.presence && m.presence.status !== 'offline' && !m.user.bot).size
    : 1;
  const offline = Math.max(0, total - online);

  // Formato pedido: : e o verde com número entre colchetes, sem hífen, daí o vermelho com número entre colchetes
  const nomeFormatado = `⌈ 👥 ⌋ Membros: 🟢[${online}] 🔴[${offline}]`;

  if (!ch) {
    ch = await guild.channels.create({
      name: nomeFormatado,
      type: ChannelType.GuildVoice,
      parent: cat.id,
      position: 0,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionFlagsBits.Connect],
          allow: [PermissionFlagsBits.ViewChannel],
        },
      ],
    });
    console.log(`✅ Canal de voz com cadeado criado: "${nomeFormatado}"`);
  } else {
    await ch.setName(nomeFormatado).catch((e) => console.log(e.message));
    await ch.setParent(cat.id).catch(() => {});
    await ch.setPosition(0).catch(() => {});
    await ch.permissionOverwrites.set([
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.Connect],
        allow: [PermissionFlagsBits.ViewChannel],
      },
    ]).catch(() => {});
    console.log(`✅ Canal de voz atualizado: "${nomeFormatado}"`);
  }

  process.exit(0);
});

client.login(process.env.TOKEN);
