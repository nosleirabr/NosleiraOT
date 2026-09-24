const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

client.once('ready', async () => {
  console.log(`🤖 Logged in as: ${client.user.tag}`);
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) {
    console.error('❌ Servidor não encontrado!');
    process.exit(1);
  }

  await guild.roles.fetch().catch(() => {});
  await guild.channels.fetch().catch(() => {});

  console.log('🔄 Atualizando estrutura de canais e categorias...');

  // 1. Categoria MEMBER COUNT no topo absoluto (position: 0)
  let catMemberCount = guild.channels.cache.find(
    (c) => c.name.toUpperCase().includes('MEMBER COUNT') && c.type === ChannelType.GuildCategory
  );
  if (!catMemberCount) {
    catMemberCount = await guild.channels.create({
      name: 'MEMBER COUNT',
      type: ChannelType.GuildCategory,
      position: 0,
    });
    console.log('✅ Categoria MEMBER COUNT criada');
  } else {
    await catMemberCount.setPosition(0).catch(() => {});
  }

  // Remove canais de texto antigos de membros para evitar duplicados
  const antigosTextoMembros = guild.channels.cache.filter(
    (c) => (c.name.includes('Membros') || c.name.includes('👥')) && c.type === ChannelType.GuildText
  );
  for (const c of antigosTextoMembros.values()) {
    await c.delete('Migrado para canal de voz com cadeado').catch(() => {});
  }

  // Canal de Voz com cadeado para Membros
  let chMembros = guild.channels.cache.find(
    (c) => (c.name.includes('Membros') || c.name.includes('👥')) && c.type === ChannelType.GuildVoice
  );

  const memberCount = guild.memberCount || 1;
  const nomeMembros = `⌈ 👥 ⌋ Membros-🟢[1]-🔴[${Math.max(0, memberCount - 1)}]`;

  if (!chMembros) {
    chMembros = await guild.channels.create({
      name: nomeMembros,
      type: ChannelType.GuildVoice,
      parent: catMemberCount.id,
      position: 0,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionFlagsBits.Connect],
          allow: [PermissionFlagsBits.ViewChannel],
        },
      ],
      reason: 'Canal de contagem de membros com cadeado',
    });
    console.log('✅ Canal de voz com cadeado [Membros] criado');
  } else {
    await chMembros.setName(nomeMembros).catch(() => {});
    await chMembros.setParent(catMemberCount.id).catch(() => {});
    await chMembros.setPosition(0).catch(() => {});
    await chMembros.permissionOverwrites.set([
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.Connect],
        allow: [PermissionFlagsBits.ViewChannel],
      },
    ]).catch(() => {});
    console.log('✅ Canal de voz [Membros] atualizado com cadeado');
  }

  // 2. Categoria INFORMAÇÕES E COMUNICADOS
  let catInfo = guild.channels.cache.find(
    (c) => (c.name.includes('INFORMACOES') || c.name.includes('INFORMAÇÕES')) && c.type === ChannelType.GuildCategory
  );
  if (!catInfo) {
    catInfo = await guild.channels.create({
      name: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦',
      type: ChannelType.GuildCategory,
      position: 1,
    });
  } else {
    await catInfo.setName('[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦').catch(() => {});
    await catInfo.setPosition(1).catch(() => {});
  }

  const infoChannelsConfig = [
    { key: 'comunicados', name: '⌈ 📣 ⌋ Comunicados', topic: 'Comunicados oficiais do NosleiraOT.' },
    { key: 'atualizacoes', name: '⌈ ✏️ ⌋ Atualizações', topic: 'Atualizações e novidades do servidor.' },
    { key: 'links', name: '⌈ 🔗 ⌋ Links', topic: 'Links oficiais e úteis.' },
    { key: 'ranks', name: '⌈ 🏆 ⌋ Ranks', topic: 'Rankings, conquistas e promoções de cargos!' },
    { key: 'regras', name: '⌈ ⛔ ⌋ Regras', topic: 'Regras oficiais do servidor.' },
    { key: 'comandos', name: '⌈ 🤖 ⌋ Comandos-Geral', topic: 'Guia de comandos do bot.' },
  ];

  for (let i = 0; i < infoChannelsConfig.length; i++) {
    const cfg = infoChannelsConfig[i];
    let ch = guild.channels.cache.find(
      (c) => (c.name.toLowerCase().includes(cfg.key) || c.name.includes(cfg.name.slice(4, 9))) &&
             c.type === ChannelType.GuildText
    );
    if (!ch) {
      ch = await guild.channels.create({
        name: cfg.name,
        type: ChannelType.GuildText,
        parent: catInfo.id,
        topic: cfg.topic,
        position: i,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.SendMessages],
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
          },
        ],
      });
      console.log(`✅ Canal criado: ${cfg.name}`);
    } else {
      await ch.setName(cfg.name).catch(() => {});
      await ch.setParent(catInfo.id).catch(() => {});
      await ch.setPosition(i).catch(() => {});
      await ch.permissionOverwrites.edit(guild.roles.everyone.id, {
        SendMessages: false,
        ViewChannel: true,
        ReadMessageHistory: true,
      }).catch(() => {});
      console.log(`✅ Canal atualizado: ${cfg.name}`);
    }
    await sleep(250);
  }

  // 3. Categoria ATENDIMENTO E SUPORTE
  let catSuporte = guild.channels.cache.find(
    (c) => (c.name.includes('ATENDIMENTO') || c.name.includes('SUPORTE')) && c.type === ChannelType.GuildCategory
  );
  if (!catSuporte) {
    catSuporte = await guild.channels.create({
      name: '[ 🎫 ] 𝗔𝗧𝗘𝗡𝗗𝗜𝗠𝗘𝗡𝗧𝗢 𝗘 𝗦𝗨𝗣𝗢𝗥𝗧𝗘',
      type: ChannelType.GuildCategory,
      position: 2,
    });
  } else {
    await catSuporte.setPosition(2).catch(() => {});
  }

  const suporteChannelsConfig = [
    { key: 'ticket-br', name: '⌈ 🔴 ⌋ Ticket-BR', topic: 'Abra seu ticket de suporte.' },
    { key: 'log-tickets', name: '⌈ 📋 ⌋ Log-Tickets', topic: 'Registro de tickets para a staff.', private: true },
  ];

  for (let i = 0; i < suporteChannelsConfig.length; i++) {
    const cfg = suporteChannelsConfig[i];
    let ch = guild.channels.cache.find(
      (c) => (c.name.toLowerCase().includes(cfg.key) || c.name.includes(cfg.name.slice(4, 9))) &&
             c.type === ChannelType.GuildText
    );
    if (!ch) {
      ch = await guild.channels.create({
        name: cfg.name,
        type: ChannelType.GuildText,
        parent: catSuporte.id,
        topic: cfg.topic,
        position: i,
      });
      console.log(`✅ Canal criado: ${cfg.name}`);
    } else {
      await ch.setName(cfg.name).catch(() => {});
      await ch.setParent(catSuporte.id).catch(() => {});
      await ch.setPosition(i).catch(() => {});
      console.log(`✅ Canal atualizado: ${cfg.name}`);
    }
    await sleep(250);
  }

  // 4. Categoria COMUNIDADE E MÍDIA
  let catComunidade = guild.channels.cache.find(
    (c) => (c.name.includes('COMUNIDADE') || c.name.includes('MIDIA') || c.name.includes('MÍDIA')) && c.type === ChannelType.GuildCategory
  );
  if (!catComunidade) {
    catComunidade = await guild.channels.create({
      name: '[ 🎮 ] 𝗖𝗢𝗠𝗨𝗡𝗜𝗗𝗔𝗗𝗘 𝗘 𝗠𝗜𝗗𝗜𝗔',
      type: ChannelType.GuildCategory,
      position: 3,
    });
  } else {
    await catComunidade.setPosition(3).catch(() => {});
  }

  const midiaChannelsConfig = [
    { key: 'streamers', name: '⌈ 🎥 ⌋ Streamers', topic: 'Alertas e transmissões ao vivo da comunidade.' },
    { key: 'screenshots', name: '⌈ 📸 ⌋ Screenshots', topic: 'Screenshots e prints de hunts, drops e bosses!' },
    { key: 'clips', name: '⌈ 📺 ⌋ Clips', topic: 'Melhores momentos e clipes em vídeo!' },
  ];

  for (let i = 0; i < midiaChannelsConfig.length; i++) {
    const cfg = midiaChannelsConfig[i];
    let ch = guild.channels.cache.find(
      (c) => (c.name.toLowerCase().includes(cfg.key) || c.name.includes(cfg.name.slice(4, 9))) &&
             c.type === ChannelType.GuildText
    );
    if (!ch) {
      ch = await guild.channels.create({
        name: cfg.name,
        type: ChannelType.GuildText,
        parent: catComunidade.id,
        topic: cfg.topic,
        position: i,
      });
      console.log(`✅ Canal criado: ${cfg.name}`);
    } else {
      await ch.setName(cfg.name).catch(() => {});
      await ch.setParent(catComunidade.id).catch(() => {});
      await ch.setPosition(i).catch(() => {});
      console.log(`✅ Canal atualizado: ${cfg.name}`);
    }
    await sleep(250);
  }

  // 5. Categoria CANAIS DE VOZ
  let catVoz = guild.channels.cache.find(
    (c) => c.name.includes('VOZ') && c.type === ChannelType.GuildCategory
  );
  if (!catVoz) {
    catVoz = await guild.channels.create({
      name: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭',
      type: ChannelType.GuildCategory,
      position: 4,
    });
  } else {
    await catVoz.setPosition(4).catch(() => {});
  }

  const voiceChannelsConfig = [
    { name: '⌈ 🔊 ⌋ Geral 1' },
    { name: '⌈ 🔊 ⌋ Geral 2' },
    { name: '⌈ 🎮 ⌋ Jogando' },
    { name: '⌈ 🐉 ⌋ Boss' },
    { name: '⌈ 💤 ⌋ AFK' },
    { name: '⌈ 🔒 ⌋ Staff Voice' },
  ];

  for (let i = 0; i < voiceChannelsConfig.length; i++) {
    const cfg = voiceChannelsConfig[i];
    let ch = guild.channels.cache.find(
      (c) => (c.name.includes(cfg.name.slice(4, 9)) || (cfg.name.includes('Staff') && c.name.toLowerCase().includes('staff'))) &&
             c.type === ChannelType.GuildVoice
    );
    if (!ch) {
      ch = await guild.channels.create({
        name: cfg.name,
        type: ChannelType.GuildVoice,
        parent: catVoz.id,
        position: i,
      });
      console.log(`✅ Canal de voz criado: ${cfg.name}`);
    } else {
      await ch.setName(cfg.name).catch(() => {});
      await ch.setParent(catVoz.id).catch(() => {});
      await ch.setPosition(i).catch(() => {});
      console.log(`✅ Canal de voz atualizado: ${cfg.name}`);
    }
    await sleep(250);
  }

  // 6. Atualizar Painel de Ticket no canal [ 🔴 ] Ticket-BR
  const chTicketBR = guild.channels.cache.find(
    (c) => c.name.includes('Ticket-BR') && c.type === ChannelType.GuildText
  );
  if (chTicketBR) {
    const embedTicket = new EmbedBuilder()
      .setColor('#E67E22')
      .setTitle('🎫  Suporte NosleiraOT')
      .setDescription(
        '**Precisa de ajuda? Abra um ticket!**\n\n' +
        '🐛 **Bug no jogo** • 💳 **Pagamento** • 🎁 **Item de donate**\n' +
        '👤 **Conta** • 🚨 **Denúncia** • ❓ **Dúvida**\n' +
        '🔑 **Recover Key** • 🔓 **Remover 2FA** • 👑 **Falar com o Dono**\n\n' +
        'Clique no botão abaixo e escolha o assunto.\n' +
        '*Tempo médio de resposta: até 24 horas.*'
      )
      .setThumbnail('https://img.icons8.com/color/96/scales.png')
      .setFooter({ text: 'NosleiraOT • Suporte Oficial' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('🎫  Abrir Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    const msgs = await chTicketBR.messages.fetch({ limit: 10 }).catch(() => null);
    if (msgs && msgs.size > 0) {
      for (const m of msgs.values()) {
        await m.delete().catch(() => {});
      }
    }
    await chTicketBR.send({ embeds: [embedTicket], components: [row] });
    console.log('✅ Painel de Ticket atualizado no canal Ticket-BR');
  }

  // 7. Atualizar Canal de Comandos com guia completo
  const chComandos = guild.channels.cache.find(
    (c) => c.name.includes('Comandos-Geral') && c.type === ChannelType.GuildText
  );
  if (chComandos) {
    const embedComandos = new EmbedBuilder()
      .setColor('#3498DB')
      .setTitle('🤖  Central de Comandos — NosleiraOT')
      .setDescription(
        'Aqui estão todos os comandos disponíveis para os jogadores no servidor do Discord:\n\u200B'
      )
      .addFields(
        {
          name: '🎥  Comandos de Transmissão / Live',
          value:
            '`!stream <link>` ou `!live <link>`\n' +
            '> Divulga sua transmissão ao vivo no canal **⌈ 🎥 ⌋ Streamers**.\n' +
            '> Suporta Twitch, YouTube, Kick e TikTok!\n' +
            '*Dica: Streams com "Nosleira" no título na Twitch/YouTube conectada no Discord são detectadas automaticamente!*',
          inline: false,
        },
        {
          name: '📸  Comandos de Screenshots / Prints',
          value:
            '`!screenshot [descrição]` ou `!print [descrição]` ou `!ss [descrição]`\n' +
            '> Compartilha sua print com imagem anexada ou link no canal **⌈ 📸 ⌋ Screenshots**.',
          inline: false,
        },
        {
          name: '🎬  Comandos de Vídeos / Clipes',
          value:
            '`!clip <link> [descrição]`\n' +
            '> Envia seu clipe ou jogada épica para o canal **⌈ 📺 ⌋ Clips**.',
          inline: false,
        },
        {
          name: '🏆  Comandos de Ranking e Atividade',
          value:
            '`!rank` ou `!rank @jogador`\n' +
            '> Consulta seu nível de atividade, tempo em call de voz e mensagens enviadas.\n' +
            '> Ao subir de nível ou conquistar novos cargos, seu progresso é anunciado no canal **⌈ 🏆 ⌋ Ranks**!',
          inline: false,
        },
        {
          name: '🎫  Comandos de Suporte',
          value:
            '> Para abrir um ticket de suporte, utilize o canal **⌈ 🔴 ⌋ Ticket-BR** clicando no botão.\n' +
            '> Categorias disponíveis: Bug, Pagamento, Donate, Conta, Recover Key, 2FA, Denúncia e Falar com o Dono.',
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT • Sistema de Comandos Integrado' })
      .setTimestamp();

    const msgsCmd = await chComandos.messages.fetch({ limit: 10 }).catch(() => null);
    if (msgsCmd && msgsCmd.size > 0) {
      for (const m of msgsCmd.values()) {
        await m.delete().catch(() => {});
      }
    }
    await chComandos.send({ embeds: [embedComandos] });
    console.log('✅ Painel de Comandos publicado em Comandos-Geral');
  }

  console.log('\n🎉 Estrutura e canais atualizados com sucesso no Discord!');
  process.exit(0);
});

client.login(TOKEN);
