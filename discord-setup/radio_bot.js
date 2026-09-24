/**
 * ═══════════════════════════════════════════════════════════════════
 *   NosleiraOT-DJ — Rádio & DJ Oficial 24/7 com Sistema de Fila
 * ═══════════════════════════════════════════════════════════════════
 */

const {
  Client,
  GatewayIntentBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActivityType,
} = require('discord.js');

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
  StreamType,
} = require('@discordjs/voice');

const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
process.env.FFMPEG_PATH = ffmpegPath;

let playdl = null;
try {
  playdl = require('play-dl');
} catch (e) {}

require('dotenv').config({ path: path.join(__dirname, '.env') });

const TOKEN = process.env.RADIO_TOKEN || process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;

// ─────────────────────────────────────────────
//  PLAYLISTS / ESTAÇÕES OFICIAIS 24/7 (AUTO-DJ)
// ─────────────────────────────────────────────
const PLAYLISTS_RADIO = {
  sertanejo: {
    id: 'sertanejo',
    nome: '🤠 Sertanejo & Modão Raiz',
    frequencia: '98.1 FM',
    genero: 'Sertanejo Raiz • Modão de Viola • Universitário',
    cor: '#E67E22',
    emoji: '🤠',
    artistas: 'Chitãozinho & Xororó, Tião Carreiro, Gusttavo Lima, Jorge & Mateus',
    streamUrl: 'https://live.hunter.fm/sertanejo_high',
  },
  rock: {
    id: 'rock',
    nome: '🎸 Rock Clássico 80s/90s',
    frequencia: '98.3 FM',
    genero: 'Classic Rock • Hard Rock • Heavy Metal',
    cor: '#E74C3C',
    emoji: '🎸',
    artistas: 'Queen, AC/DC, Guns N\' Roses, Scorpions, Iron Maiden',
    streamUrl: 'https://live.hunter.fm/rock_high',
  },
  pop: {
    id: 'pop',
    nome: '🎧 Pop & Hits Mundiais',
    frequencia: '98.5 FM',
    genero: 'Top Brasil • Pop Global • Billboard Hits',
    cor: '#3498DB',
    emoji: '🎧',
    artistas: 'Coldplay, Bruno Mars, Dua Lipa, The Weeknd',
    streamUrl: 'https://live.hunter.fm/pop_high',
  },
  pagode: {
    id: 'pagode',
    nome: '🪘 Pagode & Samba de Raiz',
    frequencia: '98.7 FM',
    genero: 'Pagode 90 • Samba de Roda',
    cor: '#1ABC9C',
    emoji: '🪘',
    artistas: 'Exaltasamba, Revelação, Raça Negra, Zeca Pagodinho',
    streamUrl: 'https://live.hunter.fm/pagode_high',
  },
  forro: {
    id: 'forro',
    nome: '🪗 Forró & Piseiro',
    frequencia: '98.8 FM',
    genero: 'Forró Pé de Serra • Piseiro',
    cor: '#2ECC71',
    emoji: '🪗',
    artistas: 'Luiz Gonzaga, Barões da Pisadinha, João Gomes',
    streamUrl: 'https://live.hunter.fm/pisadinha_high',
  },
  eletronica: {
    id: 'eletronica',
    nome: '⚡ Eletrônica & EDM',
    frequencia: '98.9 FM',
    genero: 'Dance • EDM • Trance • House',
    cor: '#00D2FF',
    emoji: '⚡',
    artistas: 'David Guetta, Avicii, Tiësto, Alok, Vintage Culture',
    streamUrl: 'http://ice1.somafm.com/thetrip-128-mp3',
  }
};

// ─────────────────────────────────────────────
//  ESTADO GLOBAL DO DJ & FILA DE REPRODUÇÃO
// ─────────────────────────────────────────────
let playlistAtiva = PLAYLISTS_RADIO.rock;
let conexaoVoz = null;
let playerAudio = null;
let filaMusicas = []; // Fila de músicas pedidas pelos usuários (FIFO)
let musicaAtual = null; // Música pedida que está tocando no momento (ou null se rádio 24/7)
let statusReproducao = 'tocando'; // 'tocando' | 'pausado'
let modoAtual = 'radio'; // 'radio' (Auto-DJ 24h) | 'fila' (Músicas dos jogadores)
let tempoInicioMusica = 0;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
});

// ─────────────────────────────────────────────
//  SISTEMA DE ÁUDIO & TOCADOR
// ─────────────────────────────────────────────
function criarPlayerSeNecessario() {
  if (!playerAudio) {
    playerAudio = createAudioPlayer();

    playerAudio.on(AudioPlayerStatus.Playing, () => {
      statusReproducao = 'tocando';
      tempoInicioMusica = Date.now();
      if (musicaAtual) {
        console.log(`[DJ] 🎵 Tocando da Fila: "${musicaAtual.titulo}" (Pedido por: ${musicaAtual.autorNome})`);
      } else {
        console.log(`[DJ] 📻 Tocando Rádio 24/7: ${playlistAtiva.nome} (${playlistAtiva.frequencia})`);
      }
    });

    playerAudio.on(AudioPlayerStatus.Idle, () => {
      console.log('[DJ] ⏭️ Faixa finalizada. Verificando próxima na fila...');
      musicaAtual = null;
      tocarProximaFaixa();
    });

    playerAudio.on('error', (err) => {
      console.error('[DJ Player] Erro na reprodução:', err.message);
      musicaAtual = null;
      setTimeout(() => tocarProximaFaixa(), 2000);
    });

    if (conexaoVoz) {
      conexaoVoz.subscribe(playerAudio);
    }
  }
}

async function tocarProximaFaixa() {
  try {
    criarPlayerSeNecessario();
    if (!conexaoVoz) return;

    // 1. Se tem música na fila dos jogadores: toca a próxima (Ordem FIFO justa: Pedro -> João -> Marcinho)
    if (filaMusicas.length > 0) {
      modoAtual = 'fila';
      musicaAtual = filaMusicas.shift();

      if (playdl && musicaAtual.url) {
        try {
          const stream = await playdl.stream(musicaAtual.url);
          const recurso = createAudioResource(stream.stream, {
            inputType: stream.type,
            inlineVolume: true,
          });
          if (recurso.volume) recurso.volume.setVolume(0.7);
          playerAudio.play(recurso);
          return;
        } catch (e) {
          console.error('[DJ] Erro ao streamar do YouTube/SoundCloud:', e.message);
        }
      }
    }

    // 2. Se a fila está vazia: volta automaticamente para a Rádio 24/7 (Auto-DJ)
    modoAtual = 'radio';
    musicaAtual = null;
    const recursoRadio = createAudioResource(playlistAtiva.streamUrl, {
      inputType: StreamType.Arbitrary,
      inlineVolume: true,
    });
    if (recursoRadio.volume) recursoRadio.volume.setVolume(0.7);
    playerAudio.play(recursoRadio);
  } catch (err) {
    console.error('[tocarProximaFaixa] Erro:', err.message);
  }
}

// ─────────────────────────────────────────────
//  CONEXÃO AO CANAL DE VOZ DA RÁDIO (24/7)
// ─────────────────────────────────────────────
async function conectarCanalRadio(guild) {
  try {
    if (!guild) return;
    await guild.channels.fetch().catch(() => {});

    const chRadio =
      guild.channels.cache.get('1552454700652167249') ||
      guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildVoice && (
          c.name.includes('Radio') ||
          c.name.normalize('NFKD').includes('Radio') ||
          c.name.includes('📻')
        )
      );

    if (!chRadio) {
      console.error('[DJ] Canal de voz 【📻】 Radio-Nosleira-98 não encontrado.');
      return;
    }

    console.log(`[DJ] 🔌 Conectando ao canal de voz: ${chRadio.name}...`);

    conexaoVoz = joinVoiceChannel({
      channelId: chRadio.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: true,
      selfMute: false,
    });

    conexaoVoz.on(VoiceConnectionStatus.Ready, () => {
      console.log('✅ [DJ] Conectado e pronto para transmitir!');
      criarPlayerSeNecessario();
      tocarProximaFaixa();
    });

    conexaoVoz.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        console.log('[DJ] ⚠️ Conexão oscilou. Reconectando...');
        await Promise.race([
          entersState(conexaoVoz, VoiceConnectionStatus.Signalling, 5_000),
          entersState(conexaoVoz, VoiceConnectionStatus.Connecting, 5_000),
        ]);
      } catch (error) {
        console.log('[DJ] 🔄 Reconectando do zero...');
        conectarCanalRadio(guild);
      }
    });
  } catch (err) {
    console.error('[conectarCanalRadio] Erro:', err.message);
  }
}

// ─────────────────────────────────────────────
//  PAINEL VISUAL NOW PLAYING (ESTILO RYTHM / DJ)
// ─────────────────────────────────────────────
function gerarCardNowPlaying(guild, clientUser) {
  const botAvatar = clientUser.displayAvatarURL({ dynamic: true, size: 512 });
  const guildIcon = guild.iconURL({ dynamic: true, size: 512 }) || botAvatar;

  const embed = new EmbedBuilder();

  if (modoAtual === 'fila' && musicaAtual) {
    // Modo Fila de Jogador Ativo
    embed
      .setColor('#FF007F')
      .setAuthor({
        name: `NosleiraOT-DJ • Pedido da Galera (${filaMusicas.length} na fila)`,
        iconURL: guildIcon,
      })
      .setTitle(`🎵  Tocando Agora: ${musicaAtual.titulo}`)
      .setDescription(
        `👤 **Pedido por:** <@${musicaAtual.autorId}> (\`${musicaAtual.autorNome}\`)\n` +
        `⏱️ **Duração:** \`${musicaAtual.duracao || 'Ao vivo'}\`\n` +
        `🔗 **Link:** [Ouvir no YouTube/Web](${musicaAtual.url})\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🎚️ **Progresso:** 🟩🟩🟩🟩🟩🟩⬛⬛⬛⬛ \`Em reprodução\`\n` +
        `📋 **Próximas Músicas na Fila:** \`${filaMusicas.length}\` aguardando\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `*Após terminar, a próxima música da fila tocará automaticamente.*`
      )
      .setThumbnail(musicaAtual.thumbnail || botAvatar)
      .setFooter({ text: 'NosleiraOT-DJ • Use !play <música> para entrar na fila', iconURL: botAvatar })
      .setTimestamp();
  } else {
    // Modo Rádio Oficial 24/7
    embed
      .setColor(playlistAtiva.cor)
      .setAuthor({
        name: `NosleiraOT-DJ • Rádio Nosleira ${playlistAtiva.frequencia}`,
        iconURL: guildIcon,
      })
      .setTitle(`${playlistAtiva.emoji}  Tocando Agora: ${playlistAtiva.nome}`)
      .setDescription(
        `📻 **Playlist Ativa:** **${playlistAtiva.genero}**\n` +
        `⭐ **Artistas em Destaque:** *${playlistAtiva.artistas}*\n` +
        `📡 **Status:** \`🟢 TRANSMISSÃO 24/7 AO VIVO\` • \`HQ Opus 128kbps\`\n` +
        `🔊 **Canal:** **【📻】 𝗥𝗮𝗱𝗶𝗼-𝗡𝗼𝘀𝗹𝗲𝗶𝗿𝗮-𝟵𝟴**\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🎚️ **Transmissão Contínua:**\n` +
        `\`04:20\` 🟩🟩🟩🟩🟩🟩🟩🟩🟩⬛ \`100%\` 🔴 *Live contínua*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `*Peça uma música com \`!play <nome>\` para tocar na frente da rádio!*`
      )
      .setThumbnail(botAvatar)
      .setFooter({ text: 'NosleiraOT-DJ • 24 Horas sem parar no Discord!', iconURL: botAvatar })
      .setTimestamp();
  }

  return embed;
}

function gerarControlesDJ() {
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('dj_select_playlist')
    .setPlaceholder('📻 Selecione uma Playlist Oficial da Rádio...')
    .addOptions(
      { label: 'Sertanejo & Modão (98.1 FM)', description: 'Chitãozinho & Xororó, Tião Carreiro, Gusttavo Lima', value: 'sertanejo', emoji: '🤠' },
      { label: 'Rock Clássico 80s/90s (98.3 FM)', description: 'Queen, AC/DC, Guns N\' Roses, Iron Maiden', value: 'rock', emoji: '🎸' },
      { label: 'Pop & Hits Mundiais (98.5 FM)', description: 'Coldplay, Bruno Mars, Dua Lipa, Top Brasil', value: 'pop', emoji: '🎧' },
      { label: 'Pagode & Samba (98.7 FM)', description: 'Raça Negra, Exaltasamba, Zeca Pagodinho', value: 'pagode', emoji: '🪘' },
      { label: 'Forró & Piseiro (98.8 FM)', description: 'Luiz Gonzaga, Barões da Pisadinha, João Gomes', value: 'forro', emoji: '🪗' },
      { label: 'Eletrônica & EDM (98.9 FM)', description: 'Daft Punk, David Guetta, Avicii, Tiësto, Alok', value: 'eletronica', emoji: '⚡' }
    );

  const rowSelect = new ActionRowBuilder().addComponents(selectMenu);

  const rowBotoes = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('dj_btn_pause').setLabel('⏸️ Pausar/Play').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('dj_btn_skip').setLabel('⏭️ Pular Faixa').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('dj_btn_queue').setLabel('📋 Ver Fila').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('dj_btn_help').setLabel('❓ Como Usar').setStyle(ButtonStyle.Secondary)
  );

  return [rowSelect, rowBotoes];
}

// ─────────────────────────────────────────────
//  EVENTO READY
// ─────────────────────────────────────────────
client.once('ready', async () => {
  console.log('═══════════════════════════════════════════════');
  console.log(`🎧  NosleiraOT-DJ Online: ${client.user.tag}`);
  console.log('🎵  Sistema de Fila & Playlists 24/7 Ativo');
  console.log('═══════════════════════════════════════════════');

  client.user.setPresence({
    status: 'online',
    activities: [
      {
        name: '📻 Rádio Nosleira 98 FM • 24/7',
        type: ActivityType.Listening,
      },
    ],
  });

  const guild = client.guilds.cache.get(GUILD_ID);
  if (guild) {
    await conectarCanalRadio(guild);

    setInterval(async () => {
      if (!conexaoVoz || conexaoVoz.state.status === VoiceConnectionStatus.Destroyed || conexaoVoz.state.status === VoiceConnectionStatus.Disconnected) {
        console.log('[DJ Watchdog] Reconectando 24/7 à Rádio Nosleira 98...');
        await conectarCanalRadio(guild);
      }
    }, 10 * 1000);
  }
});

// ─────────────────────────────────────────────
//  COMANDOS DE TEXTO (!play, !fila, !skip, etc)
// ─────────────────────────────────────────────
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  const raw = message.content.trim();
  const prefix = '!';
  if (!raw.startsWith(prefix)) return;

  const args = raw.slice(prefix.length).trim().split(/ +/);
  const comando = args.shift().toLowerCase();

  // ── !play ou !tocar ──────────────────────────────────────────────
  if (['play', 'tocar', 'p', 't'].includes(comando)) {
    const busca = args.join(' ').trim();
    if (!busca) {
      return message.reply({
        content: '❓ **Como pedir música:** Digite `!play <nome da música ou cantor>` (Exemplo: `!play Evidencias Chitãozinho` ou `!play Sweet Child O Mine`).',
      });
    }

    try {
      const msgBuscando = await message.reply('🔍 *Buscando a melhor versão da música para a fila...*');

      let itemMusica = null;

      if (playdl) {
        const res = await playdl.search(busca, { limit: 1 }).catch(() => []);
        if (res && res.length > 0) {
          const video = res[0];
          itemMusica = {
            titulo: video.title || busca,
            url: video.url,
            duracao: video.durationRaw || '03:30',
            thumbnail: video.thumbnails?.[0]?.url || null,
            autorId: message.author.id,
            autorNome: message.author.displayName || message.author.username,
          };
        }
      }

      if (!itemMusica) {
        itemMusica = {
          titulo: busca,
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(busca)}`,
          duracao: '03:45',
          thumbnail: null,
          autorId: message.author.id,
          autorNome: message.author.displayName || message.author.username,
        };
      }

      filaMusicas.push(itemMusica);
      const posicaoFila = filaMusicas.length;

      const embedAdd = new EmbedBuilder()
        .setColor('#2ECC71')
        .setTitle('✅ Música Adicionada à Fila do DJ!')
        .setDescription(
          `🎵 **${itemMusica.titulo}**\n\n` +
          `👤 **Pedido por:** ${message.author}\n` +
          `⏱️ **Duração:** \`${itemMusica.duracao}\`\n` +
          `📊 **Posição na Fila:** **#${posicaoFila}**\n\n` +
          `*Assim que as músicas anteriores terminarem, a sua tocará automaticamente em **【📻】 𝗥𝗮𝗱𝗶𝗼-𝗡𝗼𝘀𝗹𝗲𝗶𝗿𝗮-𝟵𝟴**!*`
        )
        .setThumbnail(itemMusica.thumbnail || client.user.displayAvatarURL())
        .setFooter({ text: 'NosleiraOT-DJ • Fila Justa e Organizada' });

      await msgBuscando.edit({ content: '', embeds: [embedAdd] });

      // Se não estava tocando nada da fila, inicia a música pedida
      if (modoAtual === 'radio') {
        tocarProximaFaixa();
      }
    } catch (err) {
      console.error('[!play] Erro:', err.message);
      message.reply('❌ Ocorreu um erro ao buscar a música. Tente novamente com outro termo.');
    }
    return;
  }

  // ── !fila ou !queue ──────────────────────────────────────────────
  if (['fila', 'queue', 'q'].includes(comando)) {
    const embedFila = new EmbedBuilder()
      .setColor('#9B59B6')
      .setTitle('📋  Fila de Músicas — NosleiraOT-DJ')
      .setDescription(
        `🎵 **Tocando Agora:** ${musicaAtual ? `**${musicaAtual.titulo}** (Pedido por: <@${musicaAtual.autorId}>)` : `**Rádio 24/7:** ${playlistAtiva.nome}`}\n\n` +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        '**Próximas Músicas na Fila:**'
      );

    if (filaMusicas.length === 0) {
      embedFila.addFields({
        name: 'A fila de pedidos está vazia!',
        value: '> A rádio está tocando a **Playlist Oficial 24/7**.\n> Digite `!play <música>` para ser o próximo a tocar!',
      });
    } else {
      const listaTexto = filaMusicas
        .slice(0, 10)
        .map((m, idx) => `**#${idx + 1}** • **${m.titulo}** — *<@${m.autorId}>* (\`${m.duracao}\`)`)
        .join('\n');

      embedFila.addFields({
        name: `Total de Músicas: ${filaMusicas.length}`,
        value: listaTexto,
      });

      if (filaMusicas.length > 10) {
        embedFila.setFooter({ text: `+ ${filaMusicas.length - 10} músicas na fila...` });
      }
    }

    return message.reply({ embeds: [embedFila] });
  }

  // ── !pular ou !skip ──────────────────────────────────────────────
  if (['pular', 'skip', 'next'].includes(comando)) {
    if (modoAtual === 'fila') {
      const nomePulado = musicaAtual ? musicaAtual.titulo : 'Música atual';
      message.reply(`⏭️ **${nomePulado}** foi pulada por ${message.author}!`);
      tocarProximaFaixa();
    } else {
      message.reply('ℹ️ A **Rádio 24/7** está ao vivo contínua. Para colocar sua música, digite `!play <nome da música>`.');
    }
    return;
  }

  // ── !pausar ou !pause ────────────────────────────────────────────
  if (['pausar', 'pause'].includes(comando)) {
    if (playerAudio) {
      playerAudio.pause();
      statusReproducao = 'pausado';
      message.reply('⏸️ Música pausada com sucesso. Digite `!resumir` para continuar.');
    }
    return;
  }

  // ── !resumir ou !resume ──────────────────────────────────────────
  if (['resumir', 'resume', 'despausar', 'unpause'].includes(comando)) {
    if (playerAudio) {
      playerAudio.unpause();
      statusReproducao = 'tocando';
      message.reply('▶️ Música retomada!');
    }
    return;
  }

  // ── !tocando, !np ou !radio ──────────────────────────────────────
  if (['tocando', 'np', 'nowplaying', 'radio', 'dj'].includes(comando)) {
    const embed = gerarCardNowPlaying(message.guild, client.user);
    const controles = gerarControlesDJ();
    return message.reply({ embeds: [embed], components: controles });
  }

  // ── !limparfila (Staff) ──────────────────────────────────────────
  if (['limparfila', 'clearqueue'].includes(comando)) {
    filaMusicas = [];
    message.reply('🧹 A fila de músicas foi limpa com sucesso. Voltando para a Rádio 24/7!');
    if (modoAtual === 'fila') tocarProximaFaixa();
    return;
  }

  // ── !comandosdj ou !ajudadj ──────────────────────────────────────
  if (['comandosdj', 'ajudadj', 'drajuda', 'djajuda'].includes(comando)) {
    const embedAjuda = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🎧  Guia de Comandos do NosleiraOT-DJ')
      .setDescription(
        'Divirta-se ouvindo música com a galera no canal **【📻】 𝗥𝗮𝗱𝗶𝗼-𝗡𝗼𝘀𝗹𝗲𝗶𝗿𝗮-𝟵𝟴**!\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '🎵  Como Pedir Músicas na Fila?',
          value: [
            '> `!play <nome ou link>` — Adiciona uma música na fila ordenada.',
            '> `!tocar <nome>` — Atalho rápido para pedir música.',
            '> `!fila` ou `!queue` — Visualiza a ordem das músicas que vão tocar.',
            '> `!pular` ou `!skip` — Pula para a próxima música da fila.',
            '> `!tocando` ou `!np` — Mostra o card da música atual.',
          ].join('\n'),
          inline: false,
        },
        {
          name: '⚖️  Como Funciona a Fila Justa?',
          value: [
            '> • As músicas tocam rigorosamente na **ordem que foram pedidas** (Fila 1 a 1).',
            '> • Quando a música de alguém termina, o DJ toca a próxima da fila automaticamente.',
            '> • Se ninguém pedir nada, a rádio continua tocando a **Playlist 24/7** sem parar!',
          ].join('\n'),
          inline: false,
        },
        {
          name: '📻  Playlists Oficiais da Rádio 24/7',
          value: [
            '🤠 **Sertanejo & Modão** • 🎸 **Rock 80s/90s** • 📻 **Flashback** • 🎧 **Pop Hits** • ⚡ **Eletrônica** • 🛡️ **Tibia Lo-Fi**',
          ].join('\n'),
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT-DJ • Música de alta qualidade 24/7' });

    const controles = gerarControlesDJ();
    return message.reply({ embeds: [embedAjuda], components: controles });
  }
});

// ─────────────────────────────────────────────
//  INTERAÇÃO COM BOTÕES E MENUS DO DJ
// ─────────────────────────────────────────────
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;
  const { customId, guild } = interaction;

  // Troca de Playlist 24/7 pelo Select Menu
  if (interaction.isStringSelectMenu() && customId === 'dj_select_playlist') {
    const key = interaction.values[0];
    if (PLAYLISTS_RADIO[key]) {
      playlistAtiva = PLAYLISTS_RADIO[key];
      // Se não está tocando fila de jogador, atualiza a rádio na hora
      if (modoAtual === 'radio') {
        tocarProximaFaixa();
      }
    }
    const embed = gerarCardNowPlaying(guild, client.user);
    const controles = gerarControlesDJ();
    return interaction.update({ embeds: [embed], components: controles }).catch(() => {});
  }

  // Botão Pausar / Play
  if (customId === 'dj_btn_pause') {
    if (playerAudio) {
      if (statusReproducao === 'tocando') {
        playerAudio.pause();
        statusReproducao = 'pausado';
      } else {
        playerAudio.unpause();
        statusReproducao = 'tocando';
      }
    }
    const embed = gerarCardNowPlaying(guild, client.user);
    const controles = gerarControlesDJ();
    return interaction.update({ embeds: [embed], components: controles }).catch(() => {});
  }

  // Botão Pular Faixa
  if (customId === 'dj_btn_skip') {
    if (modoAtual === 'fila') {
      tocarProximaFaixa();
    }
    const embed = gerarCardNowPlaying(guild, client.user);
    const controles = gerarControlesDJ();
    return interaction.update({ embeds: [embed], components: controles }).catch(() => {});
  }

  // Botão Parar
  if (customId === 'dj_btn_stop') {
    if (playerAudio) {
      playerAudio.stop();
      statusReproducao = 'parado';
      filaMusicas = [];
    }
    const embed = gerarCardNowPlaying(guild, client.user);
    const controles = gerarControlesDJ();
    return interaction.update({ embeds: [embed], components: controles }).catch(() => {});
  }

  // Botão Ver Fila
  if (customId === 'dj_btn_queue') {
    let descFila = `🎵 **Tocando:** ${musicaAtual ? `**${musicaAtual.titulo}**` : `**Rádio 24/7:** ${playlistAtiva.nome}`}\n\n`;
    if (filaMusicas.length === 0) {
      descFila += '✨ **A fila está vazia no momento!**\nUse `!play <música>` para ser o próximo a tocar.';
    } else {
      descFila += filaMusicas
        .slice(0, 5)
        .map((m, i) => `**#${i + 1}** • **${m.titulo}** (<@${m.autorId}>)`)
        .join('\n');
    }

    return interaction.reply({
      content: descFila,
      ephemeral: true,
    });
  }

  // Botão Como Usar
  if (customId === 'dj_btn_help') {
    return interaction.reply({
      content:
        '🎧 **Como usar o NosleiraOT-DJ:**\n' +
        '• Digite `!play <nome da música>` para colocar uma música na fila.\n' +
        '• O DJ tocará uma por uma na ordem que foi pedida (Fila Justa).\n' +
        '• Digite `!fila` para ver quem é o próximo.\n' +
        '• Digite `!pular` para avançar a música atual.\n' +
        '• Se a fila acabar, a rádio continua tocando 24h sem parar!',
      ephemeral: true,
    });
  }
});

// ─────────────────────────────────────────────
//  PREVENÇÃO DE CRASHES
// ─────────────────────────────────────────────
process.on('unhandledRejection', (reason) => console.error('[Unhandled Rejection]:', reason));
process.on('uncaughtException', (err) => console.error('[Uncaught Exception]:', err));

client.login(TOKEN);
