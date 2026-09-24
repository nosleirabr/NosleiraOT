const {
  Client,
  GatewayIntentBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once('ready', async () => {
  console.log(`🤖 Configurando subtópico de regras da rádio com ${client.user.tag}...`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  const chRadio = guild.channels.cache.find(
    (c) => (c.name.includes('Radio') || c.name.includes('📻') || c.name.normalize('NFKD').includes('Radio')) && c.type === ChannelType.GuildVoice
  );

  if (!chRadio) {
    console.error('❌ Canal de voz da Rádio não encontrado!');
    process.exit(1);
  }

  console.log(`📻 Canal de Rádio: #${chRadio.name} (${chRadio.id})`);

  const botAvatar = client.user.displayAvatarURL({ dynamic: true, size: 512 });
  const guildIcon = guild.iconURL({ dynamic: true, size: 512 }) || botAvatar;

  // 1. Cria ou busca o subtópico dentro do canal da rádio
  let threadRegras = null;
  if (chRadio.threads) {
    const ativas = await chRadio.threads.fetchActive().catch(() => null);
    if (ativas && ativas.threads) {
      threadRegras = ativas.threads.find((t) => t.name.includes('Regras') || t.name.includes('Comandos'));
    }
  }

  if (!threadRegras) {
    try {
      threadRegras = await chRadio.threads.create({
        name: '📜-Regras-e-Comandos-da-Radio',
        autoArchiveDuration: 10080, // 7 dias (máximo)
        reason: 'Subtópico oficial de regras e comandos da Rádio Nosleira',
      });
      console.log(`✅ Subtópico criado: ${threadRegras.name}`);
    } catch (e) {
      console.warn('Tentando criar thread via mensagem base:', e.message);
      // Se precisar de mensagem base para abrir thread em canal de voz
      const baseMsg = await chRadio.send({
        content: '📌 **Subtópico Oficial de Diretrizes:** Acesse a aba de Regras e Comandos da Rádio abaixo:',
      });
      threadRegras = await baseMsg.startThread({
        name: '📜-Regras-e-Comandos-da-Radio',
        autoArchiveDuration: 10080,
      });
    }
  }

  // 2. Limpa mensagens antigas dentro da thread
  if (threadRegras) {
    const msgs = await threadRegras.messages.fetch({ limit: 20 }).catch(() => null);
    if (msgs && msgs.size > 0) {
      for (const m of msgs.values()) {
        await m.delete().catch(() => {});
      }
    }

    // 3. Posta o Embed Completo e Organizado de Regras e Comandos
    const embedRegrasRadio = new EmbedBuilder()
      .setColor('#00F0FF')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Diretrizes Oficiais da Rádio 24/7',
        iconURL: guildIcon,
      })
      .setTitle('📜  Regras & Guia de Comandos da Rádio')
      .setDescription(
        'Bem-vindo ao espaço oficial de convivência e música do **NosleiraOT**!\n' +
        'Aqui estão todas as regras de uso e comandos para aproveitar o som em alta fidelidade.'
      )
      .addFields(
        {
          name: '⚖️  Regras de Uso da Sala de Rádio',
          value: [
            '> 🎧 **Respeito à Fila:** Respeite a ordem dos pedidos de música dos outros membros.',
            '> 🚫 **Proibido Earrape:** Áudios estourados, ruídos estridentes ou que incomodem geram remoção.',
            '> 🔞 **Proibido Conteúdo Adulto/Ofensivo:** Músicas com discurso de ódio ou ofensas diretas são proibidas.',
            '> 🤖 **Permanência do Bot:** O DJ toca 24/7 de forma contínua para toda a comunidade.',
          ].join('\n'),
          inline: false,
        },
        {
          name: '🎵  Comandos de Música (No chat da Rádio)',
          value: [
            '> `!play <nome ou link>` — Adiciona uma música ou playlist à fila',
            '> `!pause` — Pausa a reprodução atual',
            '> `!resume` — Retoma a música pausada',
            '> `!skip` ou `!pular` — Pula para a próxima música da fila',
            '> `!stop` ou `!sair` — Interrompe a reprodução e limpa a fila',
          ].join('\n'),
          inline: false,
        },
        {
          name: '🎛️  Comandos de Fila & Ajustes',
          value: [
            '> `!queue` ou `!fila` — Visualiza todas as faixas que estão na fila',
            '> `!np` — Mostra a faixa tocando no momento e a duração',
            '> `!volume <1 a 100>` — Ajusta o volume do áudio',
            '> `!loop` — Ativa a repetição da música atual',
            '> `!shuffle` — Embaralha as faixas da fila',
          ].join('\n'),
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT 7.4 • Regras Permanentes da Rádio', iconURL: botAvatar })
      .setTimestamp();

    const rowControls = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('music_play_pause').setLabel('⏯️ Play / Pause').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('music_skip').setLabel('⏭️ Pular').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('music_queue').setLabel('📜 Ver Fila').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('music_stop').setLabel('⏹️ Parar').setStyle(ButtonStyle.Danger)
    );

    await threadRegras.send({
      embeds: [embedRegrasRadio],
      components: [rowControls],
    });

    console.log(`✅ Regras e comandos implementados com sucesso dentro de: ${threadRegras.name}`);
  }

  process.exit(0);
});

client.login(process.env.TOKEN);
