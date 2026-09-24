const {
  Client,
  GatewayIntentBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once('ready', async () => {
  console.log(`🤖 Configurando canal/subtópico de regras da rádio com ${client.user.tag}...`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  const catVoz = guild.channels.cache.find(
    (c) => (c.name.includes('CANAI') || c.name.includes('VOZ') || c.name.normalize('NFKD').includes('VOZ')) && c.type === ChannelType.GuildCategory
  );

  const chRadioVoice = guild.channels.cache.find(
    (c) => (c.name.includes('Radio') || c.name.includes('📻') || c.name.normalize('NFKD').includes('Radio')) && c.type === ChannelType.GuildVoice
  );

  let chRegrasRadio = guild.channels.cache.find(
    (c) => (c.name.includes('regras') && c.name.includes('radio')) || (c.name.includes('comandos') && c.name.includes('radio'))
  );

  if (!chRegrasRadio) {
    chRegrasRadio = await guild.channels.create({
      name: '【📜】𝗿𝗲𝗴𝗿𝗮𝘀-𝗲-𝗰𝗼𝗺𝗮𝗻𝗱𝗼𝘀-𝗿𝗮𝗱𝗶𝗼',
      type: ChannelType.GuildText,
      parent: catVoz ? catVoz.id : undefined,
      position: chRadioVoice ? chRadioVoice.position + 1 : undefined,
      topic: 'Regras de convivência, boas práticas e guia de comandos para a Rádio Nosleira 24/7',
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
          deny: [PermissionFlagsBits.SendMessages],
        },
      ],
    });
    console.log(`✅ Canal de regras da rádio criado: ${chRegrasRadio.name}`);
  }

  // Limpa mensagens antigas no canal de regras da rádio
  const msgs = await chRegrasRadio.messages.fetch({ limit: 50 }).catch(() => null);
  if (msgs && msgs.size > 0) {
    for (const m of msgs.values()) {
      await m.delete().catch(() => {});
    }
  }

  const botAvatar = client.user.displayAvatarURL({ dynamic: true, size: 512 });
  const guildIcon = guild.iconURL({ dynamic: true, size: 512 }) || botAvatar;

  const embedRegras = new EmbedBuilder()
    .setColor('#00F0FF')
    .setAuthor({
      name: 'NosleiraOT 7.4 • Rádio Oficial & Sistema de Som 24/7',
      iconURL: guildIcon,
    })
    .setTitle('📻  Regras de Convivência & Comandos da Rádio')
    .setDescription(
      'Bem-vindo ao espaço oficial de convivência e música do **NosleiraOT**!\n' +
      'Abaixo estão todas as regras e o guia completo de comandos para curtir suas músicas com alta fidelidade na sala de voz.'
    )
    .addFields(
      {
        name: '⚖️  Regras de Convivência na Rádio',
        value: [
          '> 🎧 **Respeito à Fila:** Respeite as músicas pedidas pelos outros jogadores.',
          '> 🚫 **Proibido Earrape:** Proibido áudios estourados, ruídos estridentes ou que incomodem os membros.',
          '> 🔞 **Proibido Ofensas:** Conteúdo preconceituoso, ofensivo ou discursos de ódio geram punição imediata.',
          '> 🤖 **Permanência 24/7:** O bot de rádio fica conectado 24h na sala de rádio sem interrupções.',
        ].join('\n'),
        inline: false,
      },
      {
        name: '🎵  Comandos de Música (Usar no chat da Rádio)',
        value: [
          '> `!play <nome ou link>` — Toca uma música ou playlist do YouTube/SoundCloud',
          '> `!pause` — Pausa a reprodução atual',
          '> `!resume` — Retoma a música pausada',
          '> `!skip` ou `!pular` — Pula para a próxima música da fila',
          '> `!stop` ou `!sair` — Interrompe a reprodução e limpa a fila',
        ].join('\n'),
        inline: false,
      },
      {
        name: '🎛️  Comandos de Controle de Fila',
        value: [
          '> `!queue` ou `!fila` — Visualiza todas as faixas que estão na fila',
          '> `!np` — Mostra a faixa tocando no momento com barra de progresso',
          '> `!volume <1 a 100>` — Ajusta o volume do áudio',
          '> `!loop` — Ativa a repetição da música atual ou da fila',
          '> `!shuffle` — Embaralha a ordem das faixas na fila',
        ].join('\n'),
        inline: false,
      }
    )
    .setFooter({ text: 'NosleiraOT 7.4 • Rádio 24h • Sistema Permanente', iconURL: botAvatar })
    .setTimestamp();

  const rowControls = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('music_play_pause').setLabel('⏯️ Play / Pause').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('music_skip').setLabel('⏭️ Pular').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('music_queue').setLabel('📜 Ver Fila').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('music_stop').setLabel('⏹️ Parar').setStyle(ButtonStyle.Danger)
  );

  await chRegrasRadio.send({
    embeds: [embedRegras],
    components: [rowControls],
  });

  console.log(`✅ Guia oficial de regras e comandos postado em #${chRegrasRadio.name}!`);
  process.exit(0);
});

client.login(process.env.RADIO_TOKEN);
