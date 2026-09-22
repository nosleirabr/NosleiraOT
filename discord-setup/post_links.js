const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} = require('discord.js');

const TOKEN    = 'MTU1MDk0Njg0OTIyMzg2ODQ3Nw.GbKhS5.cStGJn59ObTX8lv-URRPVjSBuoqHg2X0gy64eQ';
const GUILD_ID = '1550944696761843915';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Links Oficiais Atuais
const LINKS = {
  SITE:      'https://nosleira.com.br',
  DISCORD:   'https://discord.gg/CH4njxpWk7',
  WHATSAPP:  'https://chat.whatsapp.com/JfAG9EkXI5EJUofbr68UcP',
  TELEGRAM:  'https://t.me/nosleiraot', // placeholder / atualizável
  TIKTOK:    'https://www.tiktok.com/@arielsonrodrigue22',
  INSTAGRAM: 'https://www.instagram.com/nosleiraot/',
};

client.once('ready', async () => {
  console.log('Postando embeds de redes sociais e links oficiais...');
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) {
    console.error('Guild não encontrada!');
    process.exit(1);
  }

  await guild.channels.fetch();

  // Helper para buscar canal de texto
  const findText = (nameFragment) =>
    guild.channels.cache.find(
      (c) => c.name.includes(nameFragment) && c.type === ChannelType.GuildText
    );

  // 1. Canal WhatsApp
  const canalWhats = findText('whatsapp');
  if (canalWhats) {
    const embedWhats = new EmbedBuilder()
      .setColor('#25D366')
      .setTitle('💬  Grupo Oficial do WhatsApp — NosleiraOT')
      .setDescription(
        'Entre na nossa comunidade do WhatsApp para interagir com outros jogadores, receber avisos em primeira mão e conversar!\n\n' +
        `👉 **[Clique aqui para entrar no Grupo](${LINKS.WHATSAPP})**\n\n` +
        '*Mantenha sempre o respeito com os membros e siga as regras do grupo.*'
      )
      .setThumbnail('https://img.icons8.com/color/96/whatsapp--v1.png')
      .setFooter({ text: 'NosleiraOT • Redes Oficiais' })
      .setTimestamp();

    const rowWhats = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('🟢 Entrar no Grupo do WhatsApp')
        .setStyle(ButtonStyle.Link)
        .setURL(LINKS.WHATSAPP)
    );

    await canalWhats.send({ embeds: [embedWhats], components: [rowWhats] });
    console.log('✅ Postado em whatsapp');
  }

  // 2. Canal TikTok
  const canalTikTok = findText('tiktok');
  if (canalTikTok) {
    const embedTikTok = new EmbedBuilder()
      .setColor('#EE1D52')
      .setTitle('🎵  TikTok Oficial — NosleiraOT')
      .setDescription(
        'Siga o nosso perfil oficial no **TikTok** para acompanhar clipes épicos, novidades, vídeos e muito mais do servidor!\n\n' +
        `👉 **[Clique aqui para seguir no TikTok](${LINKS.TIKTOK})**\n\n` +
        '*Deixe seu like e compartilhe os vídeos com os amigos!* 🎮'
      )
      .setThumbnail('https://img.icons8.com/color/96/tiktok--v1.png')
      .setFooter({ text: 'NosleiraOT • TikTok Oficial' })
      .setTimestamp();

    const rowTikTok = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('🎵 Seguir no TikTok')
        .setStyle(ButtonStyle.Link)
        .setURL(LINKS.TIKTOK)
    );

    await canalTikTok.send({ embeds: [embedTikTok], components: [rowTikTok] });
    console.log('✅ Postado em tiktok');
  }

  // 3. Canal Instagram
  const canalInsta = findText('instagram');
  if (canalInsta) {
    const embedInsta = new EmbedBuilder()
      .setColor('#E1306C')
      .setTitle('📸  Instagram Oficial — NosleiraOT')
      .setDescription(
        'Siga a nossa página oficial no **Instagram** para ver bastidores, novidades dos updates, sorteios e interagir com a comunidade!\n\n' +
        `👉 **[Clique aqui para seguir no Instagram](${LINKS.INSTAGRAM})**\n\n` +
        '*Marque o @nosleiraot nas suas publicações e stories!* 📸'
      )
      .setThumbnail('https://img.icons8.com/color/96/instagram-new--v1.png')
      .setFooter({ text: 'NosleiraOT • Instagram Oficial' })
      .setTimestamp();

    const rowInsta = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('📸 Seguir no Instagram')
        .setStyle(ButtonStyle.Link)
        .setURL(LINKS.INSTAGRAM)
    );

    await canalInsta.send({ embeds: [embedInsta], components: [rowInsta] });
    console.log('✅ Postado em instagram');
  }

  // 4. Canal Links Oficiais
  const canalLinks = findText('links-oficiais');
  if (canalLinks) {
    const embedLinks = new EmbedBuilder()
      .setColor('#E67E22')
      .setTitle('🌐  Links e Redes Oficiais — NosleiraOT')
      .setDescription(
        'Acesse todos os canais oficiais do servidor em um só lugar. Cuidado com golpes e links falsos!\n\n' +
        `🌐 **Site Oficial:** [nosleira.com.br](${LINKS.SITE})\n` +
        `💬 **Grupo WhatsApp:** [Entrar no WhatsApp](${LINKS.WHATSAPP})\n` +
        `🎮 **Discord:** [discord.gg/CH4njxpWk7](${LINKS.DISCORD})\n` +
        `🎵 **TikTok:** [Seguir no TikTok](${LINKS.TIKTOK})\n` +
        `📸 **Instagram:** [Seguir no Instagram](${LINKS.INSTAGRAM})\n\n` +
        '*Novos canais serão adicionados aqui conforme forem criados!*'
      )
      .setFooter({ text: 'NosleiraOT • Central de Links' })
      .setTimestamp();

    const rowLinks = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('🌐 Site')
        .setStyle(ButtonStyle.Link)
        .setURL(LINKS.SITE),
      new ButtonBuilder()
        .setLabel('💬 WhatsApp')
        .setStyle(ButtonStyle.Link)
        .setURL(LINKS.WHATSAPP),
      new ButtonBuilder()
        .setLabel('🎮 Discord')
        .setStyle(ButtonStyle.Link)
        .setURL(LINKS.DISCORD),
      new ButtonBuilder()
        .setLabel('🎵 TikTok')
        .setStyle(ButtonStyle.Link)
        .setURL(LINKS.TIKTOK),
      new ButtonBuilder()
        .setLabel('📸 Instagram')
        .setStyle(ButtonStyle.Link)
        .setURL(LINKS.INSTAGRAM)
    );

    await canalLinks.send({ embeds: [embedLinks], components: [rowLinks] });
    console.log('✅ Postado em links-oficiais');
  }

  console.log('Concluído!');
  client.destroy();
});

client.login(TOKEN);
