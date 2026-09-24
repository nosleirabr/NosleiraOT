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
    }
  } catch (err) {}
}

client.once('ready', async () => {
  console.log(`🤖 Restaurando mensagens oficiais: ${client.user.tag}`);
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  // 1. Regras
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
        '**7️⃣ Impersonação proibida** — Não se passe por Staff ou jogadores; confira links oficiais em **[ 🔱 ] Links**.\n\n' +
        '*Permanecer no servidor = concordar integralmente com estas regras.*'
      )
      .setFooter({ text: 'NosleiraOT • Regras Oficiais' })
      .setTimestamp();
    await chRegras.send({ embeds: [embedRegras] });
    console.log('✅ Regras postadas');
  }

  // 2. Links
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
    console.log('✅ Links postados');
  }

  // 3. Atualizações
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
    console.log('✅ Atualizações postadas');
  }

  // 4. Comandos-Geral
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
    console.log('✅ Comandos postados');
  }

  // 5. Ticket-BR
  const chTicket = guild.channels.cache.find(c => c.name.toLowerCase().includes('ticket') && c.type === ChannelType.GuildText);
  if (chTicket) {
    await limparCanal(chTicket);
    const embedTicket = new EmbedBuilder()
      .setColor('#E67E22')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Central de Atendimento & Suporte',
        iconURL: guild.iconURL() || 'https://img.icons8.com/fluency/96/shield.png',
      })
      .setTitle('🛡️  Central de Suporte Oficial')
      .setDescription(
        'Bem-vindo ao suporte do **NosleiraOT**! Nosso sistema garante um atendimento individual, seguro e confidencial diretamente com a equipe.\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '📂  Departamentos Disponíveis',
          value: [
            '> 🐛 **Bug no Jogo** — Falhas técnicas, bugs de mapa, spells ou quests.',
            '> 💳 **Financeiro & Doações** — Confirmações de PIX, doações e entregas.',
            '> 🎁 **Itens & Donate** — Suporte para recebimento de itens adquiridos.',
            '> 👤 **Gestão de Conta** — Recuperação de chave (Recover Key) e 2FA.',
            '> 🚨 **Denúncias** — Reporte de bots, abusos ou violação de regras.',
            '> ❓ **Dúvidas Gerais** — Informações sobre gameplay, rates e sistemas.',
            '> 👑 **Direção / Dono** — Assuntos sigilosos diretamente com o Dono.',
          ].join('\n'),
          inline: false,
        },
        {
          name: '📋  Como funciona o Atendimento?',
          value: [
            '1️⃣ Clique no botão **`🎫 Abrir Ticket`** abaixo.',
            '2️⃣ Selecione o departamento correspondente à sua necessidade.',
            '3️⃣ Um **subtópico privado e exclusivo** será aberto para você.',
            '4️⃣ Descreva seu caso com detalhes e anexe prints se necessário.',
          ].join('\n'),
          inline: false,
        },
        {
          name: '⏱️  Informações & Diretrizes',
          value:
            '> 🕒 **Tempo de Resposta:** Respondemos o mais breve possível (até 24h).\n' +
            '> 🔒 **Privacidade:** Apenas você e a Staff autorizada visualizam seu ticket.\n' +
            '> ⚠️ **Aviso:** Evite criar múltiplos tickets para o mesmo assunto.',
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT 7.4 • Atendimento Oficial • Suporte Criptografado' })
      .setTimestamp();

    const rowTicket = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('🎫  Abrir Ticket de Suporte')
        .setStyle(ButtonStyle.Success)
    );

    await chTicket.send({ embeds: [embedTicket], components: [rowTicket] });
    console.log('✅ Ticket-BR postado');
  }

  console.log('🎉 Todas as mensagens e embeds foram 100% restaurados!');
  process.exit(0);
});

client.login(TOKEN);
