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

// Categorias e canais originais
const ESTRUTURA_ORIGINAL = [
  {
    categoria: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦',
    canais: [
      { nome: '〔 🤖 〕 Comandos-Geral', tipo: ChannelType.GuildText, key: 'comandos' },
      { nome: '〔 📢 〕 Comunicados',    tipo: ChannelType.GuildText, key: 'comunicados' },
      { nome: '〔 ✍🏻 〕 Atualizacoes',  tipo: ChannelType.GuildText, key: 'atualizacoes' },
      { nome: '〔 🔱 〕 Links',          tipo: ChannelType.GuildText, key: 'links' },
      { nome: '〔 🏆 〕 Ranks',          tipo: ChannelType.GuildText, key: 'ranks' },
      { nome: '〔 ⛔ 〕 Regras',         tipo: ChannelType.GuildText, key: 'regras' },
    ],
  },
  {
    categoria: '[ 🎫 ] 𝗔𝗧𝗘𝗡𝗗𝗜𝗠𝗘𝗡𝗧𝗢 𝗘 𝗦𝗨𝗣𝗢𝗥𝗧𝗘',
    canais: [
      { nome: '〔 🔴 〕 Ticket-BR',   tipo: ChannelType.GuildText, key: 'ticket-br' },
      { nome: '〔 📋 〕 Log-Tickets', tipo: ChannelType.GuildText, key: 'log-tickets', privado: true },
      { nome: '〔 🔊 〕 Staff-Voice', tipo: ChannelType.GuildVoice, key: 'staff-voice', privado: true },
    ],
  },
  {
    categoria: '[ 🎮 ] 𝗖𝗢𝗠𝗨𝗡𝗜𝗗𝗔𝗗𝗘 𝗘 𝗠𝗜𝗗𝗜𝗔',
    canais: [
      { nome: '〔 🎥 〕 Streamers',   tipo: ChannelType.GuildText, key: 'streamers' },
      { nome: '〔 📸 〕 Screenshots', tipo: ChannelType.GuildText, key: 'screenshots' },
      { nome: '〔 📺 〕 Clips',       tipo: ChannelType.GuildText, key: 'clips' },
    ],
  },
  {
    categoria: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭',
    canais: [
      { nome: '〔 🔊 〕 Geral 1',      tipo: ChannelType.GuildVoice },
      { nome: '〔 🔊 〕 Geral 2',      tipo: ChannelType.GuildVoice },
      { nome: '〔 🎮 〕 Jogando',      tipo: ChannelType.GuildVoice },
      { nome: '〔 🐉 〕 Boss',         tipo: ChannelType.GuildVoice },
      { nome: '〔 💤 〕 AFK',          tipo: ChannelType.GuildVoice },
    ],
  },
];

async function limparCanal(canal) {
  try {
    const msgs = await canal.messages.fetch({ limit: 100 }).catch(() => null);
    if (!msgs || msgs.size === 0) return;
    for (const m of msgs.values()) {
      await m.delete().catch(() => {});
      await sleep(150);
    }
  } catch (err) {}
}

client.once('ready', async () => {
  console.log(`🤖 Restaurando servidor original: ${client.user.tag}`);
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) {
    console.error('Guild não encontrada');
    process.exit(1);
  }

  await guild.roles.fetch().catch(() => {});
  await guild.channels.fetch().catch(() => {});

  // 1. Remove categoria extra se existir (ex: MEMBER COUNT)
  const catMemberCount = guild.channels.cache.find(
    (c) => c.name.toUpperCase().includes('MEMBER COUNT') && c.type === ChannelType.GuildCategory
  );
  if (catMemberCount) {
    await catMemberCount.delete('Restaurando layout original').catch(() => {});
  }

  // 2. Garante as 4 categorias e canais originais
  for (let i = 0; i < ESTRUTURA_ORIGINAL.length; i++) {
    const bloco = ESTRUTURA_ORIGINAL[i];
    let cat = guild.channels.cache.find(
      (c) => (c.name.includes(bloco.categoria.slice(6, 15)) || c.name === bloco.categoria) && c.type === ChannelType.GuildCategory
    );

    if (!cat) {
      cat = await guild.channels.create({
        name: bloco.categoria,
        type: ChannelType.GuildCategory,
        position: i,
      });
      console.log(`✅ Categoria restaurada: ${bloco.categoria}`);
    } else {
      await cat.setName(bloco.categoria).catch(() => {});
      await cat.setPosition(i).catch(() => {});
    }

    for (let j = 0; j < bloco.canais.length; j++) {
      const cfg = bloco.canais[j];
      let ch = guild.channels.cache.find(
        (c) => (c.name.includes(cfg.nome.slice(4, 10)) || (cfg.key && c.name.toLowerCase().includes(cfg.key))) &&
               c.type === cfg.tipo
      );

      if (!ch) {
        ch = await guild.channels.create({
          name: cfg.nome,
          type: cfg.tipo,
          parent: cat.id,
          position: j,
        });
        console.log(`✅ Canal criado: ${cfg.nome}`);
      } else {
        await ch.setName(cfg.nome).catch(() => {});
        await ch.setParent(cat.id).catch(() => {});
        await ch.setPosition(j).catch(() => {});
        console.log(`✅ Canal atualizado: ${cfg.nome}`);
      }
      await sleep(250);
    }
  }

  // 3. Canal de contagem de membros no topo
  let chMembros = guild.channels.cache.find(
    (c) => (c.name.includes('Membros') || c.name.includes('👥')) && c.type === ChannelType.GuildText
  );
  if (!chMembros) {
    chMembros = await guild.channels.create({
      name: '【👥】𝗠𝗲𝗺𝗯𝗿𝗼𝘀🟢1🔴0',
      type: ChannelType.GuildText,
      position: 0,
      reason: 'Contador de membros original',
    });
  } else {
    await chMembros.setName('【👥】𝗠𝗲𝗺𝗯𝗿𝗼𝘀🟢1🔴0').catch(() => {});
  }

  // 4. RESTAURAR CONTEÚDO ORIGINAL DOS CANAIS:

  // ── Canal: 〔 ⛔ 〕 Regras ──
  const chRegras = guild.channels.cache.find(
    (c) => (c.name.includes('Regras') || c.name.includes('⛔') || c.name.includes('regras')) && c.type === ChannelType.GuildText
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
    console.log('✅ Regras restauradas em 〔 ⛔ 〕 Regras');
  }

  // ── Canal: 〔 🔱 〕 Links ──
  const chLinks = guild.channels.cache.find(
    (c) => (c.name.includes('Links') || c.name.includes('🔱')) && c.type === ChannelType.GuildText
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
    console.log('✅ Links oficiais restaurados em 〔 🔱 〕 Links');
  }

  // ── Canal: 〔 ✍🏻 〕 Atualizacoes ──
  const chAtual = guild.channels.cache.find(
    (c) => (c.name.includes('Atualizacoes') || c.name.includes('Atualizações') || c.name.includes('✍🏻')) && c.type === ChannelType.GuildText
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
    console.log('✅ Atualizações restauradas em 〔 ✍🏻 〕 Atualizacoes');
  }

  // ── Canal: 〔 🤖 〕 Comandos-Geral ──
  const chCmd = guild.channels.cache.find(
    (c) => (c.name.includes('Comandos') || c.name.includes('🤖')) && c.type === ChannelType.GuildText
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
    console.log('✅ Comandos restaurados em 〔 🤖 〕 Comandos-Geral');
  }

  // ── Canal: 〔 🔴 〕 Ticket-BR ──
  const chTicket = guild.channels.cache.find(
    (c) => (c.name.includes('Ticket') || c.name.includes('🔴')) && c.type === ChannelType.GuildText
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
    console.log('✅ Painel de Ticket restaurado em 〔 🔴 〕 Ticket-BR');
  }

  console.log('\n🎉 SERVIDOR 100% RESTAURADO PARA O ESTADO ORIGINAL!');
  process.exit(0);
});

client.login(TOKEN);
