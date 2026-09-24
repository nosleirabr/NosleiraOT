const {
  Client,
  GatewayIntentBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once('ready', async () => {
  console.log(`🤖 Configurando Rádio Nosleira com ${client.user.tag}...`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) {
    console.error('❌ Servidor não encontrado!');
    process.exit(1);
  }

  await guild.channels.fetch();

  // 1. Busca o canal de voz da rádio
  const chRadio = guild.channels.cache.find(
    (c) => (c.name.includes('Radio') || c.name.includes('📻') || c.name.normalize('NFKD').includes('Radio')) && c.type === ChannelType.GuildVoice
  );

  if (!chRadio) {
    console.error('❌ Canal de voz da Rádio não encontrado!');
    process.exit(1);
  }

  console.log(`📻 Canal de Rádio encontrado: #${chRadio.name} (${chRadio.id})`);

  // 2. Limpa mensagens antigas no chat do canal de voz
  try {
    const msgs = await chRadio.messages.fetch({ limit: 50 }).catch(() => null);
    if (msgs && msgs.size > 0) {
      for (const m of msgs.values()) {
        await m.delete().catch(() => {});
      }
    }
  } catch (e) {
    console.warn('Aviso ao limpar chat da rádio:', e.message);
  }

  const botAvatar = client.user.displayAvatarURL({ dynamic: true, size: 512 });
  const guildIcon = guild.iconURL({ dynamic: true, size: 512 }) || botAvatar;

  // 3. Cria o Embed Oficial de Guia e Comandos da Rádio
  const embedRadio = new EmbedBuilder()
    .setColor('#00F0FF')
    .setAuthor({
      name: 'NosleiraOT 7.4 • Rádio Oficial & Sistema de Som',
      iconURL: guildIcon,
    })
    .setTitle('📻  Rádio Nosleira 24/7 — Comandos & Boas Práticas')
    .setDescription(
      'Seja bem-vindo ao canal oficial de **Música & Rádio do NosleiraOT**!\n' +
      'Ouça suas músicas favoritas em alta qualidade enquanto caça, treina ou troca ideias com os amigos.'
    )
    .addFields(
      {
        name: '🎵  Comandos Principais de Reprodução',
        value: [
          '> `!play <música ou link>` — Toca uma música ou playlist do YouTube/SoundCloud',
          '> `!pause` — Pausa a reprodução atual',
          '> `!resume` — Retoma a música pausada',
          '> `!skip` ou `!pular` — Pula para a próxima música da fila',
          '> `!stop` ou `!sair` — Interrompe a música e limpa a fila',
        ].join('\n'),
        inline: false,
      },
      {
        name: '🎛️  Comandos de Controle & Fila',
        value: [
          '> `!queue` ou `!fila` — Mostra a lista de músicas aguardando reprodução',
          '> `!np` — Exibe a música tocando no momento com barra de tempo',
          '> `!volume <1 a 100>` — Ajusta o volume do áudio',
          '> `!loop` — Ativa/desativa a repetição da faixa ou da fila',
          '> `!shuffle` — Embaralha a ordem das músicas na fila',
        ].join('\n'),
        inline: false,
      },
      {
        name: '⚖️  Boas Práticas de Convivência na Rádio',
        value: [
          '> 🎧 **Respeito à Fila:** Respeite as escolhas dos outros membros da sala.',
          '> 🚫 **Sem Áudios Estourados:** Proibido earrape, ruídos estridentes ou ofensivos.',
          '> 🔍 **Links Claros:** Utilize nomes de músicas precisos para buscas rápidas.',
          '> 🎙️ **Microfones:** Deixe seu microfone no modo *Apertar para Falar* se houver barulho de fundo.',
        ].join('\n'),
        inline: false,
      }
    )
    .setFooter({ text: 'NosleiraOT 7.4 • Sistema de DJ & Áudio de Alta Fidelidade', iconURL: botAvatar })
    .setTimestamp();

  // Botões de Ação Rápida
  const rowControls = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('music_play_pause').setLabel('⏯️ Play / Pause').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('music_skip').setLabel('⏭️ Pular Faixa').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('music_queue').setLabel('📜 Ver Fila').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('music_stop').setLabel('⏹️ Parar').setStyle(ButtonStyle.Danger)
  );

  await chRadio.send({
    embeds: [embedRadio],
    components: [rowControls],
  });

  console.log('✅ Embed de comandos e boas práticas enviado com sucesso no chat da Rádio!');

  // 4. Conecta o bot na sala de voz da Rádio
  try {
    const connection = joinVoiceChannel({
      channelId: chRadio.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log(`🎧 DJ Conectado com sucesso no canal de voz: ${chRadio.name}`);
      process.exit(0);
    });

    setTimeout(() => {
      console.log('Conexão inicializada.');
      process.exit(0);
    }, 3000);
  } catch (err) {
    console.error('Erro ao conectar na call:', err.message);
    process.exit(0);
  }
});

client.login(process.env.TOKEN);
