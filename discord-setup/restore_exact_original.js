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

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const S = '\u00A0';

function bold(text) {
  const map = {
    A:'𝗔',B:'𝗕',C:'𝗖',D:'𝗗',E:'𝗘',F:'𝗙',G:'𝗚',H:'𝗛',I:'𝗜',J:'𝗝',
    K:'𝗞',L:'𝗟',M:'𝗠',N:'𝗡',O:'𝗢',P:'𝗣',Q:'𝗤',R:'𝗥',S:'𝗦',T:'𝗧',
    U:'𝗨',V:'𝗩',W:'𝗪',X:'𝗫',Y:'𝗬',Z:'𝗭',
    a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',
    k:'𝗸',l:'𝗹',m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',
    u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',y:'𝘆',z:'𝘇',
  };
  return text.split('').map(c => map[c] ?? c).join('');
}

function nome(emoji, texto) {
  return `【${S}${emoji}${S}】${S}${bold(texto)}`;
}

const LINKS = {
  SITE:         'https://www.nosleiraot.com',
  DISCORD:      'https://discord.com/invite/CH4njxpWk7',
  WHATSAPP:     'https://chat.whatsapp.com/JfAG9EkXI5EJUofbr68UcP',
  INSTAGRAM:    'https://www.instagram.com/nosleiraot/',
  FACEBOOK_GRP: 'https://www.facebook.com/groups/939267222077857',
  FACEBOOK_PAG: 'https://www.facebook.com/profile.php?id=61594554905220',
  X:            'https://x.com/NosleiraOT',
  TIKTOK:       'https://www.tiktok.com/@nosleiraot',
  KWAI:         'https://www.kwai.com/@nosleiraot',
  YOUTUBE:      'https://www.youtube.com/@NosleiraOT',
};

async function limparCanal(canal) {
  try {
    const msgs = await canal.messages.fetch({ limit: 50 }).catch(() => null);
    if (!msgs || msgs.size === 0) return;
    for (const m of msgs.values()) {
      await m.delete().catch(() => {});
      await sleep(100);
    }
  } catch (err) {}
}

client.once('ready', async () => {
  console.log(`🤖 Restaurando exatamente como no log inicial: ${client.user.tag}`);
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch().catch(() => {});

  // 1. Categorias exatas originais
  const catDefs = [
    { name: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', pos: 0 },
    { name: '[ 🎫 ] 𝗔𝗧𝗘𝗡𝗗𝗜𝗠𝗘𝗡𝗧𝗢 𝗘 𝗦𝗨𝗣𝗢𝗥𝗧𝗘', pos: 1 },
    { name: '[ 🎮 ] 𝗖𝗢𝗠𝗨𝗡𝗜𝗗𝗔𝗗𝗘 𝗘 𝗠𝗜𝗗𝗜𝗔', pos: 2 },
    { name: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', pos: 3 },
  ];

  const catMap = {};
  for (const c of catDefs) {
    let cat = guild.channels.cache.find(
      (ch) => ch.name.includes(c.name.slice(6, 15)) && ch.type === ChannelType.GuildCategory
    );
    if (!cat) {
      cat = await guild.channels.create({
        name: c.name,
        type: ChannelType.GuildCategory,
        position: c.pos,
      });
    } else {
      await cat.setName(c.name).catch(() => {});
      await cat.setPosition(c.pos).catch(() => {});
    }
    catMap[c.name] = cat;
    await sleep(200);
  }

  // 2. Canais exatos com a formatação original
  const canaisOriginais = [
    // Informações e Comandos
    { match: 'comandos', nome: nome('🤖', 'Comandos-Geral'), cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', tipo: ChannelType.GuildText, pos: 0 },
    { match: 'comunicados', nome: nome('📢', 'Comunicados'), cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', tipo: ChannelType.GuildText, pos: 1 },
    { match: 'atualiza', nome: '【✍🏻】𝗔𝑡𝑢𝑎𝑙𝑖𝑧𝑎çõ𝑒𝑠', cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', tipo: ChannelType.GuildText, pos: 2 },
    { match: 'links', nome: nome('🔱', 'Links'), cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', tipo: ChannelType.GuildText, pos: 3 },
    { match: 'ranks', nome: nome('🏆', 'Ranks'), cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', tipo: ChannelType.GuildText, pos: 4 },
    { match: 'regras', nome: nome('⛔', 'Regras'), cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', tipo: ChannelType.GuildText, pos: 5 },

    // Atendimento e Suporte
    { match: 'ticket-br', nome: nome('🔴', 'Ticket-BR'), cat: '[ 🎫 ] 𝗔𝗧𝗘𝗡𝗗𝗜𝗠𝗘𝗡𝗧𝗢 𝗘 𝗦𝗨𝗣𝗢𝗥𝗧𝗘', tipo: ChannelType.GuildText, pos: 0 },
    { match: 'log-tickets', nome: nome('📋', 'Log-Tickets'), cat: '[ 🎫 ] 𝗔𝗧𝗘𝗡𝗗𝗜𝗠𝗘𝗡𝗧𝗢 𝗘 𝗦𝗨𝗣𝗢𝗥𝗧𝗘', tipo: ChannelType.GuildText, pos: 1 },
    { match: 'staff-voice', nome: '【🔊】Staff-Voice', cat: '[ 🎫 ] 𝗔𝗧𝗘𝗡𝗗𝗜𝗠𝗘𝗡𝗧𝗢 𝗘 𝗦𝗨𝗣𝗢𝗥𝗧𝗘', tipo: ChannelType.GuildVoice, pos: 2 },

    // Comunidade e Mídia
    { match: 'streamers', nome: nome('🎥', 'Streamers'), cat: '[ 🎮 ] 𝗖𝗢𝗠𝗨𝗡𝗜𝗗𝗔𝗗𝗘 𝗘 𝗠𝗜𝗗𝗜𝗔', tipo: ChannelType.GuildText, pos: 0 },
    { match: 'screenshots', nome: nome('📸', 'Screenshots'), cat: '[ 🎮 ] 𝗖𝗢𝗠𝗨𝗡𝗜𝗗𝗔𝗗𝗘 𝗘 𝗠𝗜𝗗𝗜𝗔', tipo: ChannelType.GuildText, pos: 1 },
    { match: 'clips', nome: nome('📺', 'Clips'), cat: '[ 🎮 ] 𝗖𝗢𝗠𝗨𝗡𝗜𝗗𝗔𝗗𝗘 𝗘 𝗠𝗜𝗗𝗜𝗔', tipo: ChannelType.GuildText, pos: 2 },

    // Voz
    { match: 'geral 1', nome: '【🔊】 Geral 1', cat: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', tipo: ChannelType.GuildVoice, pos: 0 },
    { match: 'geral 2', nome: '【🔊】Geral 2', cat: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', tipo: ChannelType.GuildVoice, pos: 1 },
    { match: 'jogando', nome: '【🎮】 Jogando', cat: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', tipo: ChannelType.GuildVoice, pos: 2 },
    { match: 'boss', nome: '【🐉】 Boss', cat: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', tipo: ChannelType.GuildVoice, pos: 3 },
    { match: 'afk', nome: '【💤】 AFK', cat: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', tipo: ChannelType.GuildVoice, pos: 4 },
  ];

  for (const cfg of canaisOriginais) {
    const parentCat = catMap[cfg.cat];
    let ch = guild.channels.cache.find(
      (c) => c.name.toLowerCase().includes(cfg.match) && c.type === cfg.tipo
    );

    if (ch) {
      await ch.setName(cfg.nome).catch(() => {});
      if (parentCat) await ch.setParent(parentCat.id).catch(() => {});
      await ch.setPosition(cfg.pos).catch(() => {});
      console.log(`✓ Canal restaurado: ${cfg.nome}`);
    } else {
      ch = await guild.channels.create({
        name: cfg.nome,
        type: cfg.tipo,
        parent: parentCat?.id,
        position: cfg.pos,
      });
      console.log(`➕ Canal recriado: ${cfg.nome}`);
    }
    await sleep(250);
  }

  // 3. Canal Membros
  let chMembros = guild.channels.cache.find(
    (c) => (c.name.includes('Membros') || c.name.includes('👥')) && c.type === ChannelType.GuildText
  );
  if (chMembros) {
    await chMembros.setName('【👥】𝗠𝗲𝗺𝗯𝗿𝗼𝘀🟢1🔴0').catch(() => {});
  } else {
    await guild.channels.create({
      name: '【👥】𝗠𝗲𝗺𝗯𝗿𝗼𝘀🟢1🔴0',
      type: ChannelType.GuildText,
      position: 0,
    });
  }

  // 4. Mensagens originais nos canais

  // ── Regras ──
  const chRegras = guild.channels.cache.find(c => c.name.toLowerCase().includes('regras') && c.type === ChannelType.GuildText);
  if (chRegras) {
    await limparCanal(chRegras);
    const embedRegras = new EmbedBuilder()
      .setColor('#E74C3C')
      .setTitle('📜  Regras do NosleiraOT')
      .setDescription(
        '**Leia com atenção. O descumprimento resulta em punição progressiva (mute → ban).**\n\n' +
        '**⚠️  PROIBIÇÕES ABSOLUTAS (Ban imediato):**\n' +
        '> 🔞 **Conteúdo adulto/pornografia** — Nudez, conteúdo sexual explícito, links para sites adultos.\n' +
        '> 🎰 **Apostas/casas de apostas (Bets)** — Links para Bet365, Betano, Blaze, Pixbet, Stake, Fortune Tiger, cassinos, roletas, crash, Tigrinho, Mines, Aviator, ou qualquer plataforma de apostas.\n' +
        '> ⚖️ **Racismo/discriminação/bullying** — Ofensas raciais, xenofobia, homofobia, assédio moral, perseguição a membros.\n' +
        '> 🔗 **Links maliciosos/externos não autorizados** — Phishing, scam, afiliados não aprovados, sites suspeitos.\n\n' +
        '**📋  REGRAS GERAIS:**\n' +
        '**1️⃣ Respeito mútuo** — Trate todos com educação. Sem ofensas, xingamentos ou provocações.\n' +
        '**2️⃣ Sem spam/flood** — Sem repetição excessiva, letras aleatórias, emoji em excesso ou flood.\n' +
        '**3️⃣ Sem propaganda não autorizada** — Divulgação de outros servidores, produtos ou serviços só com permissão da staff.\n' +
        '**5️⃣ Obedeça a Staff** — Dúvidas e recursos via **ticket**, nunca em chat público.\n' +
        '**6️⃣ Sem trapaça** — Bots, hacks, exploits ou vantagem indevida no jogo = **ban permanente**.\n' +
        '**7️⃣ Impersonação proibida** — Não se passe por Staff ou jogadores; confira links oficiais em **【 🔱 】 Links**.\n\n' +
        '*Permanecer no servidor = concordar integralmente com estas regras.*'
      )
      .setFooter({ text: 'NosleiraOT • Regras Oficiais' })
      .setTimestamp();
    await chRegras.send({ embeds: [embedRegras] });
  }

  // ── Links ──
  const chLinks = guild.channels.cache.find(c => c.name.toLowerCase().includes('links') && c.type === ChannelType.GuildText);
  if (chLinks) {
    await limparCanal(chLinks);
    const embedLinks = new EmbedBuilder()
      .setColor('#E67E22')
      .setTitle('🌐  Links e Redes Oficiais — NosleiraOT')
      .setDescription(
        'Acesse **todos** os canais oficiais do servidor em um só lugar.\n' +
        '> ⚠️ **Cuidado com golpes e links falsos!** Use apenas os links abaixo.\n\n' +
        `🌐 **Site Oficial:** [www.nosleiraot.com](${LINKS.SITE})\n` +
        `🎮 **Discord:** [Entrar no Discord](${LINKS.DISCORD})\n` +
        `💬 **WhatsApp:** [Entrar no Grupo](${LINKS.WHATSAPP})\n` +
        `📸 **Instagram:** [@nosleiraot](${LINKS.INSTAGRAM})\n` +
        `📘 **Facebook (Grupo):** [Grupo da Comunidade](${LINKS.FACEBOOK_GRP})\n` +
        `📄 **Facebook (Página):** [Página Oficial](${LINKS.FACEBOOK_PAG})\n` +
        `✖️ **X (Twitter):** [@NosleiraOT](${LINKS.X})\n` +
        `🎵 **TikTok:** [@nosleiraot](${LINKS.TIKTOK})\n` +
        `🎬 **Kwai:** [Canal Kwai](${LINKS.KWAI})\n` +
        `▶️ **YouTube:** [@NosleiraOT](${LINKS.YOUTUBE})\n`
      )
      .setFooter({ text: 'NosleiraOT • Central de Links' })
      .setTimestamp();

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🌐 Site').setStyle(ButtonStyle.Link).setURL(LINKS.SITE),
      new ButtonBuilder().setLabel('🎮 Discord').setStyle(ButtonStyle.Link).setURL(LINKS.DISCORD),
      new ButtonBuilder().setLabel('💬 WhatsApp').setStyle(ButtonStyle.Link).setURL(LINKS.WHATSAPP),
      new ButtonBuilder().setLabel('📸 Instagram').setStyle(ButtonStyle.Link).setURL(LINKS.INSTAGRAM),
      new ButtonBuilder().setLabel('📘 Facebook Grupo').setStyle(ButtonStyle.Link).setURL(LINKS.FACEBOOK_GRP)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('📄 Facebook Página').setStyle(ButtonStyle.Link).setURL(LINKS.FACEBOOK_PAG),
      new ButtonBuilder().setLabel('✖️ X (Twitter)').setStyle(ButtonStyle.Link).setURL(LINKS.X),
      new ButtonBuilder().setLabel('🎵 TikTok').setStyle(ButtonStyle.Link).setURL(LINKS.TIKTOK),
      new ButtonBuilder().setLabel('🎬 Kwai').setStyle(ButtonStyle.Link).setURL(LINKS.KWAI),
      new ButtonBuilder().setLabel('▶️ YouTube').setStyle(ButtonStyle.Link).setURL(LINKS.YOUTUBE)
    );

    await chLinks.send({ embeds: [embedLinks], components: [row1, row2] });
  }

  // ── Atualizações ──
  const chAtual = guild.channels.cache.find(c => c.name.toLowerCase().includes('atualiza') && c.type === ChannelType.GuildText);
  if (chAtual) {
    await limparCanal(chAtual);
    const embedAtual = new EmbedBuilder()
      .setTitle('📝 Como funcionam as Atualizações')
      .setDescription(
        'Todas as atualizações do **NosleiraOT** são publicadas diretamente pelo site oficial.\n\n' +
        '🌐 **Acesse o site para ver as últimas novidades:**\n' +
        '**[www.nosleiraot.com](https://www.nosleiraot.com)**\n\n' +
        '📢 Grandes patches e eventos serão anunciados também aqui no Discord.\n' +
        '✅ Fique de olho neste canal para não perder nenhuma atualização!'
      )
      .setColor(0x5865F2)
      .setThumbnail('https://i.imgur.com/HX3oI2a.png')
      .setFooter({ text: 'NosleiraOT 7.4 • Atualizações' })
      .setTimestamp();

    await chAtual.send({ embeds: [embedAtual] });
  }

  // ── Comandos-Geral ──
  const chCmd = guild.channels.cache.find(c => c.name.toLowerCase().includes('comandos') && c.type === ChannelType.GuildText);
  if (chCmd) {
    await limparCanal(chCmd);
    const embedCmd = new EmbedBuilder()
      .setTitle('🤖 Comandos do NosleiraOT-BOT')
      .setDescription(
        'Use os **slash commands** — basta digitar `/` e clicar no comando!\n' +
        'Você também pode usar com `!` se preferir.\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '🌐 Servidor & Site',
          value: [
            '`/site` — Link do site NosleiraOT',
            '`/info` — Informações sobre o servidor',
            '`/discord` — Link de convite do Discord',
          ].join('\n'),
          inline: false,
        },
        {
          name: '📜 Regras & Suporte',
          value: [
            '`/regras` — Ver as regras completas',
            '`/ticket` — Abrir um ticket de suporte',
          ].join('\n'),
          inline: false,
        },
        {
          name: '🏆 Ranking',
          value: [
            '`/rank` — Ver o ranking de membros',
            '`/rankup @membro <nível>` — Anunciar rank-up *(Staff)*',
          ].join('\n'),
          inline: false,
        },
        {
          name: '💡 Como usar',
          value:
            '1️⃣ Digite `/` no chat\n' +
            '2️⃣ Clique no comando que aparece\n' +
            '3️⃣ Preencha os campos (se houver) e envie!',
          inline: false,
        }
      )
      .setColor(0xFFD700)
      .setFooter({ text: 'NosleiraOT 7.4 • Comandos' })
      .setTimestamp();

    const buttonsCmd = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🌐 Site').setStyle(ButtonStyle.Link).setURL('https://www.nosleiraot.com'),
      new ButtonBuilder().setCustomId('cmd_regras').setLabel('📜 Regras').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('cmd_ticket').setLabel('🎫 Ticket').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('cmd_rank').setLabel('🏆 Ranking').setStyle(ButtonStyle.Primary)
    );

    await chCmd.send({ embeds: [embedCmd], components: [buttonsCmd] });
  }

  // ── Ticket-BR ──
  const chTicket = guild.channels.cache.find(c => c.name.toLowerCase().includes('ticket') && c.type === ChannelType.GuildText);
  if (chTicket) {
    await limparCanal(chTicket);
    const embedTicket = new EmbedBuilder()
      .setColor('#E67E22')
      .setTitle('🎫  Suporte NosleiraOT')
      .setDescription(
        '**Precisa de ajuda? Abra um ticket!**\n\n' +
        '🐛 Bug no jogo • 💳 Pagamento • 🎁 Item de donate\n' +
        '👤 Conta • 🚨 Denúncia • ❓ Dúvida\n' +
        '🔑 Recover Key • 🔓 Remover 2F • 👑 Falar com o Dono\n\n' +
        '**Clique no botão abaixo e escolha o assunto.**\n' +
        '*Tempo médio de resposta: até 24 horas.*'
      )
      .setThumbnail('https://img.icons8.com/color/96/scales.png')
      .setFooter({ text: 'NosleiraOT • Suporte Oficial' })
      .setTimestamp();

    const rowTicket = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('create_ticket').setLabel('🎫  Abrir Ticket').setStyle(ButtonStyle.Primary)
    );

    await chTicket.send({ embeds: [embedTicket], components: [rowTicket] });
  }

  console.log('\n🎉 Servidor restaurado exatamente com os nomes, fontes e embeds originais!');
  process.exit(0);
});

client.login(TOKEN);
