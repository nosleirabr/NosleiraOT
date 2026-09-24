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
  console.log(`🤖 Iniciando restauração: ${client.user.tag}`);
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) {
    console.error('Guild não encontrada');
    process.exit(1);
  }

  await guild.channels.fetch().catch(() => {});

  // 1. Remove qualquer categoria Member Count extra
  const catMemberCount = guild.channels.cache.find(
    (c) => c.name.toUpperCase().includes('MEMBER COUNT') && c.type === ChannelType.GuildCategory
  );
  if (catMemberCount) {
    console.log('🗑️ Removendo categoria MEMBER COUNT...');
    await catMemberCount.delete().catch(() => {});
  }

  // 2. Garante as 4 Categorias Originais com os nomes exatos
  const categoriasConfig = [
    { name: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', pos: 0 },
    { name: '[ 🎫 ] 𝗔𝗧𝗘𝗡𝗗𝗜𝗠𝗘𝗡𝗧𝗢 𝗘 𝗦𝗨𝗣𝗢𝗥𝗧𝗘', pos: 1 },
    { name: '[ 🎮 ] 𝗖𝗢𝗠𝗨𝗡𝗜𝗗𝗔𝗗𝗘 𝗘 𝗠𝗜𝗗𝗜𝗔', pos: 2 },
    { name: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', pos: 3 },
  ];

  const catMap = {};
  for (const item of categoriasConfig) {
    let cat = guild.channels.cache.find(
      (c) => (c.name.includes(item.name.slice(6, 15)) || c.name === item.name) && c.type === ChannelType.GuildCategory
    );
    if (!cat) {
      cat = await guild.channels.create({
        name: item.name,
        type: ChannelType.GuildCategory,
        position: item.pos,
      });
    } else {
      await cat.setName(item.name).catch(() => {});
      await cat.setPosition(item.pos).catch(() => {});
    }
    catMap[item.name] = cat;
    console.log(`📁 Categoria OK: ${item.name}`);
    await sleep(200);
  }

  // 3. Garante cada canal original dentro de sua categoria com o padrão 〔 〕
  const canaisConfig = [
    // Informações
    { cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', match: 'comandos', nome: '〔 🤖 〕 Comandos-Geral', tipo: ChannelType.GuildText },
    { cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', match: 'comunicados', nome: '〔 📢 〕 Comunicados', tipo: ChannelType.GuildText },
    { cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', match: 'atualiza', nome: '〔 ✍🏻 〕 Atualizacoes', tipo: ChannelType.GuildText },
    { cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', match: 'links', nome: '〔 🔱 〕 Links', tipo: ChannelType.GuildText },
    { cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', match: 'ranks', nome: '〔 🏆 〕 Ranks', tipo: ChannelType.GuildText },
    { cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', match: 'regras', nome: '〔 ⛔ 〕 Regras', tipo: ChannelType.GuildText },

    // Suporte
    { cat: '[ 🎫 ] 𝗔𝗧𝗘𝗡𝗗𝗜𝗠𝗘𝗡𝗧𝗢 𝗘 𝗦𝗨𝗣𝗢𝗥𝗧𝗘', match: 'ticket-br', nome: '〔 🔴 〕 Ticket-BR', tipo: ChannelType.GuildText },
    { cat: '[ 🎫 ] 𝗔𝗧𝗘𝗡𝗗𝗜𝗠𝗘𝗡𝗧𝗢 𝗘 𝗦𝗨𝗣𝗢𝗥𝗧𝗘', match: 'log-tickets', nome: '〔 📋 〕 Log-Tickets', tipo: ChannelType.GuildText },
    { cat: '[ 🎫 ] 𝗔𝗧𝗘𝗡𝗗𝗜𝗠𝗘𝗡𝗧𝗢 𝗘 𝗦𝗨𝗣𝗢𝗥𝗧𝗘', match: 'staff-voice', nome: '〔 🔊 〕 Staff-Voice', tipo: ChannelType.GuildVoice },

    // Mídia
    { cat: '[ 🎮 ] 𝗖𝗢𝗠𝗨𝗡𝗜𝗗𝗔𝗗𝗘 𝗘 𝗠𝗜𝗗𝗜𝗔', match: 'streamers', nome: '〔 🎥 〕 Streamers', tipo: ChannelType.GuildText },
    { cat: '[ 🎮 ] 𝗖𝗢𝗠𝗨𝗡𝗜𝗗𝗔𝗗𝗘 𝗘 𝗠𝗜𝗗𝗜𝗔', match: 'screenshots', nome: '〔 📸 〕 Screenshots', tipo: ChannelType.GuildText },
    { cat: '[ 🎮 ] 𝗖𝗢𝗠𝗨𝗡𝗜𝗗𝗔𝗗𝗘 𝗘 𝗠𝗜𝗗𝗜𝗔', match: 'clips', nome: '〔 📺 〕 Clips', tipo: ChannelType.GuildText },

    // Voz
    { cat: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', match: 'geral 1', nome: '〔 🔊 〕 Geral 1', tipo: ChannelType.GuildVoice },
    { cat: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', match: 'geral 2', nome: '〔 🔊 〕 Geral 2', tipo: ChannelType.GuildVoice },
    { cat: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', match: 'jogando', nome: '〔 🎮 〕 Jogando', tipo: ChannelType.GuildVoice },
    { cat: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', match: 'boss', nome: '〔 🐉 〕 Boss', tipo: ChannelType.GuildVoice },
    { cat: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', match: 'afk', nome: '〔 💤 〕 AFK', tipo: ChannelType.GuildVoice },
  ];

  for (const cfg of canaisConfig) {
    const parentCat = catMap[cfg.cat];
    let ch = guild.channels.cache.find(
      (c) => c.name.toLowerCase().includes(cfg.match) && c.type === cfg.tipo
    );

    if (!ch) {
      ch = await guild.channels.create({
        name: cfg.nome,
        type: cfg.tipo,
        parent: parentCat?.id,
      });
      console.log(`➕ Canal criado: ${cfg.nome}`);
    } else {
      await ch.setName(cfg.nome).catch(() => {});
      if (parentCat) await ch.setParent(parentCat.id).catch(() => {});
      console.log(`✓ Canal ajustado: ${cfg.nome}`);
    }
    await sleep(250);
  }

  // 4. Canal de contagem de membros no topo
  let chMembros = guild.channels.cache.find(
    (c) => (c.name.includes('Membros') || c.name.includes('👥')) && c.type === ChannelType.GuildText
  );
  if (!chMembros) {
    chMembros = await guild.channels.create({
      name: '【👥】𝗠𝗲𝗺𝗯𝗿𝗼𝘀🟢1🔴0',
      type: ChannelType.GuildText,
      position: 0,
    });
  } else {
    await chMembros.setName('【👥】𝗠𝗲𝗺𝗯𝗿𝗼𝘀🟢1🔴0').catch(() => {});
    await chMembros.setParent(null).catch(() => {});
  }

  // 5. RESTAURAR CONTEÚDOS EXATOS:

  // ── 〔 ⛔ 〕 Regras ──
  const chRegras = guild.channels.cache.find(
    (c) => c.name.toLowerCase().includes('regras') && c.type === ChannelType.GuildText
  );
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
        '**7️⃣ Impersonação proibida** — Não se passe por Staff ou jogadores; confira links oficiais em **〔 🔱 〕 Links**.\n\n' +
        '*Permanecer no servidor = concordar integralmente com estas regras.*'
      )
      .setFooter({ text: 'NosleiraOT • Regras Oficiais' })
      .setTimestamp();

    await chRegras.send({ embeds: [embedRegras] });
    console.log('✅ Regras restauradas');
  }

  // ── 〔 🔱 〕 Links ──
  const chLinks = guild.channels.cache.find(
    (c) => c.name.toLowerCase().includes('links') && c.type === ChannelType.GuildText
  );
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
    console.log('✅ Links restaurados');
  }

  // ── 〔 ✍🏻 〕 Atualizacoes ──
  const chAtual = guild.channels.cache.find(
    (c) => c.name.toLowerCase().includes('atualiza') && c.type === ChannelType.GuildText
  );
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
    console.log('✅ Atualizações restauradas');
  }

  // ── 〔 🤖 〕 Comandos-Geral ──
  const chCmd = guild.channels.cache.find(
    (c) => c.name.toLowerCase().includes('comandos') && c.type === ChannelType.GuildText
  );
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
    console.log('✅ Comandos restaurados');
  }

  // ── 〔 🔴 〕 Ticket-BR ──
  const chTicket = guild.channels.cache.find(
    (c) => c.name.toLowerCase().includes('ticket-br') && c.type === ChannelType.GuildText
  );
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
    console.log('✅ Ticket-BR restaurado');
  }

  console.log('\n🎉 RESTAURAÇÃO COMPLETA COM SUCESSO!');
  process.exit(0);
});

client.login(TOKEN);
