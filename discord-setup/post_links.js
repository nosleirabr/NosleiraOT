/**
 * ═══════════════════════════════════════════════════════════════════
 *   NosleiraOT — Painéis Oficiais  v4.0 (estrutura v2: [ emoji ] nome)
 *   Apaga TODAS as mensagens antigas e posta os embeds atualizados.
 *   node post_links.js
 *   NOTA: blocos sociais antigos (sem canal) são pulados sozinhos.
 * ═══════════════════════════════════════════════════════════════════
 */

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} = require('discord.js');

require('dotenv').config();
const TOKEN    = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ─────────────────────────────────────────────────────────────────
//  Links Oficiais Atuais
// ─────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────
//  Helper: apaga TODAS as mensagens do canal (bulk + antigas)
// ─────────────────────────────────────────────────────────────────
async function limparCanal(canal) {
  let deletadas = 0;
  try {
    // Busca e apaga em lotes (máx 100 por vez, bulk delete apenas msgs < 14 dias)
    let continuar = true;
    while (continuar) {
      const msgs = await canal.messages.fetch({ limit: 100 });
      if (msgs.size === 0) { continuar = false; break; }

      const recentes = msgs.filter(
        (m) => Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000
      );
      const antigas = msgs.filter(
        (m) => Date.now() - m.createdTimestamp >= 14 * 24 * 60 * 60 * 1000
      );

      // Bulk delete para mensagens recentes (< 14 dias)
      if (recentes.size > 1) {
        await canal.bulkDelete(recentes);
        deletadas += recentes.size;
      } else if (recentes.size === 1) {
        await recentes.first().delete();
        deletadas += 1;
      }

      // Apaga uma a uma mensagens mais antigas
      for (const msg of antigas.values()) {
        await msg.delete().catch(() => {});
        deletadas += 1;
        await sleep(300); // evita rate-limit
      }

      if (msgs.size < 100) continuar = false;
    }
    console.log(`  🗑️  ${deletadas} mensagem(ns) apagada(s) em #${canal.name}`);
  } catch (err) {
    console.warn(`  ⚠️  Erro ao limpar #${canal.name}:`, err.message);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─────────────────────────────────────────────────────────────────
//  Helper: busca canal de texto pelo fragmento de nome
// ─────────────────────────────────────────────────────────────────
const findText = (guild, frag) =>
  guild.channels.cache.find(
    (c) => c.name.includes(frag) && c.type === ChannelType.GuildText
  );

// ═══════════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════════
client.once('ready', async () => {
  console.log('🚀 Atualizando embeds de redes sociais e links oficiais...\n');

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) { console.error('❌ Guild não encontrada!'); process.exit(1); }
  await guild.channels.fetch();

  // ───────────────────────────────────────────────────────────────
  // 1. Canal WhatsApp
  // ───────────────────────────────────────────────────────────────
  const canalWhats = findText(guild, 'whatsapp');
  if (canalWhats) {
    await limparCanal(canalWhats);
    const embed = new EmbedBuilder()
      .setColor('#25D366')
      .setTitle('💬  Grupo Oficial do WhatsApp — NosleiraOT')
      .setDescription(
        'Entre na nossa comunidade do **WhatsApp** para interagir com outros jogadores, ' +
        'receber avisos em primeira mão e conversar!\n\n' +
        `👉 **[Clique aqui para entrar no Grupo](${LINKS.WHATSAPP})**\n\n` +
        '*Mantenha o respeito e siga as regras do grupo.*'
      )
      .setThumbnail('https://img.icons8.com/color/96/whatsapp--v1.png')
      .setFooter({ text: 'NosleiraOT • Redes Oficiais' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🟢 Entrar no Grupo').setStyle(ButtonStyle.Link).setURL(LINKS.WHATSAPP)
    );
    await canalWhats.send({ embeds: [embed], components: [row] });
    console.log('✅ Postado: #whatsapp');
  }

  // ───────────────────────────────────────────────────────────────
  // 2. Canal Instagram
  // ───────────────────────────────────────────────────────────────
  const canalInsta = findText(guild, 'instagram');
  if (canalInsta) {
    await limparCanal(canalInsta);
    const embed = new EmbedBuilder()
      .setColor('#E1306C')
      .setTitle('📸  Instagram Oficial — NosleiraOT')
      .setDescription(
        'Siga a nossa página no **Instagram** para bastidores, novidades, sorteios e mais!\n\n' +
        `👉 **[Clique aqui para seguir no Instagram](${LINKS.INSTAGRAM})**\n\n` +
        '*Marque o @nosleiraot nas suas publicações e stories!* 📸'
      )
      .setThumbnail('https://img.icons8.com/color/96/instagram-new--v1.png')
      .setFooter({ text: 'NosleiraOT • Instagram Oficial' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('📸 Seguir no Instagram').setStyle(ButtonStyle.Link).setURL(LINKS.INSTAGRAM)
    );
    await canalInsta.send({ embeds: [embed], components: [row] });
    console.log('✅ Postado: #instagram');
  }

  // ───────────────────────────────────────────────────────────────
  // 3. Canal Facebook
  // ───────────────────────────────────────────────────────────────
  const canalFb = findText(guild, 'facebook');
  if (canalFb) {
    await limparCanal(canalFb);
    const embed = new EmbedBuilder()
      .setColor('#1877F2')
      .setTitle('📘  Facebook Oficial — NosleiraOT')
      .setDescription(
        'Siga o NosleiraOT no **Facebook**! Temos grupo para discussões e página oficial com novidades.\n\n' +
        `👥 **Grupo:** [Entrar no Grupo do Facebook](${LINKS.FACEBOOK_GRP})\n` +
        `📄 **Página Oficial:** [Curtir a Página](${LINKS.FACEBOOK_PAG})\n\n` +
        '*Fique por dentro de tudo que acontece no servidor!* 🎮'
      )
      .setThumbnail('https://img.icons8.com/color/96/facebook-new.png')
      .setFooter({ text: 'NosleiraOT • Facebook Oficial' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('👥 Grupo Facebook').setStyle(ButtonStyle.Link).setURL(LINKS.FACEBOOK_GRP),
      new ButtonBuilder().setLabel('📄 Página Oficial').setStyle(ButtonStyle.Link).setURL(LINKS.FACEBOOK_PAG)
    );
    await canalFb.send({ embeds: [embed], components: [row] });
    console.log('✅ Postado: #facebook');
  }

  // ───────────────────────────────────────────────────────────────
  // 4. Canal TikTok
  // ───────────────────────────────────────────────────────────────
  const canalTikTok = findText(guild, 'tiktok');
  if (canalTikTok) {
    await limparCanal(canalTikTok);
    const embed = new EmbedBuilder()
      .setColor('#EE1D52')
      .setTitle('🎵  TikTok Oficial — NosleiraOT')
      .setDescription(
        'Siga o nosso perfil no **TikTok** para clipes épicos, novidades e vídeos do servidor!\n\n' +
        `👉 **[Clique aqui para seguir no TikTok](${LINKS.TIKTOK})**\n\n` +
        '*Deixe seu like e compartilhe com os amigos!* 🎮'
      )
      .setThumbnail('https://img.icons8.com/color/96/tiktok--v1.png')
      .setFooter({ text: 'NosleiraOT • TikTok Oficial' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🎵 Seguir no TikTok').setStyle(ButtonStyle.Link).setURL(LINKS.TIKTOK)
    );
    await canalTikTok.send({ embeds: [embed], components: [row] });
    console.log('✅ Postado: #tiktok');
  }

  // ───────────────────────────────────────────────────────────────
  // 5. Canal X (Twitter)
  // ───────────────────────────────────────────────────────────────
  const canalX = findText(guild, 'x-twitter') || findText(guild, 'twitter');
  if (canalX) {
    await limparCanal(canalX);
    const embed = new EmbedBuilder()
      .setColor('#1DA1F2')
      .setTitle('✖️  X (Twitter) Oficial — NosleiraOT')
      .setDescription(
        'Siga o **@NosleiraOT** no X para novidades, atualizações e posts em tempo real!\n\n' +
        `👉 **[Clique aqui para seguir no X](${LINKS.X})**\n\n` +
        '*Fique por dentro de tudo em primeira mão!* 🚀'
      )
      .setThumbnail('https://img.icons8.com/color/96/twitterx--v1.png')
      .setFooter({ text: 'NosleiraOT • X (Twitter) Oficial' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('✖️ Seguir no X').setStyle(ButtonStyle.Link).setURL(LINKS.X)
    );
    await canalX.send({ embeds: [embed], components: [row] });
    console.log('✅ Postado: #x-twitter');
  }

  // ───────────────────────────────────────────────────────────────
  // 6. Canal Kwai
  // ───────────────────────────────────────────────────────────────
  const canalKwai = findText(guild, 'kwai');
  if (canalKwai) {
    await limparCanal(canalKwai);
    const embed = new EmbedBuilder()
      .setColor('#FFCC00')
      .setTitle('🎬  Kwai Oficial — NosleiraOT')
      .setDescription(
        'Siga o NosleiraOT no **Kwai** para vídeos e conteúdos exclusivos do servidor!\n\n' +
        `👉 **[Clique aqui para seguir no Kwai](${LINKS.KWAI})**\n\n` +
        '*Curta, comente e compartilhe com seus amigos!* 🎮'
      )
      .setThumbnail('https://img.icons8.com/color/96/video.png')
      .setFooter({ text: 'NosleiraOT • Kwai Oficial' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🎬 Seguir no Kwai').setStyle(ButtonStyle.Link).setURL(LINKS.KWAI)
    );
    await canalKwai.send({ embeds: [embed], components: [row] });
    console.log('✅ Postado: #kwai');
  }

  // (6b removido na v2: [ 🔴 ] youtube agora é só alertas de live)

  // ───────────────────────────────────────────────────────────────
  // 6c. Painel Ticket-BR — botão de abrir ticket (botão limpo e único)
  // ───────────────────────────────────────────────────────────────
  const canalTicketBR = findText(guild, '🔴');
  if (canalTicketBR) {
    await limparCanal(canalTicketBR);
    const embedTicket = new EmbedBuilder()
      .setColor('#E67E22')
      .setTitle('🎫  Suporte NosleiraOT')
      .setDescription(
        '**Precisa de ajuda? Abra um ticket!**\n\n' +
        '> 🐛 Bug no jogo • 💳 Pagamento • 🎁 Item de donate\n' +
        '> 👤 Conta • 🚨 Denúncia • ❓ Dúvida\n' +
        '> 🔑 Recover Key • 🔓 Remover 2F • 👑 Falar com o Dono\n\n' +
        '**Clique no botão abaixo e escolha o assunto.**\n' +
        '*Tempo médio de resposta: até 24 horas.*'
      )
      .setThumbnail('https://img.icons8.com/color/96/scales.png')
      .setFooter({ text: 'NosleiraOT • Suporte Oficial' })
      .setTimestamp();
    const rowTicket = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('create_ticket').setLabel('🎫  Abrir Ticket').setStyle(ButtonStyle.Primary)
    );
    await canalTicketBR.send({ embeds: [embedTicket], components: [rowTicket] });
    console.log('✅ Postado: #ticket-br');
  }

  // ───────────────────────────────────────────────────────────────
  // 6d. Regras — quadro oficial (limpo e único)
  // ───────────────────────────────────────────────────────────────
  const canalRegras = findText(guild, '🚫');
  if (canalRegras) {
    await limparCanal(canalRegras);
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
    await canalRegras.send({ embeds: [embedRegras] });
    console.log('✅ Postado: #regras');
  }

  // ───────────────────────────────────────────────────────────────
  // 7. Canal Comandos / Informações
  // ───────────────────────────────────────────────────────────────
  const canalCmd = findText(guild, '🤖') || findText(guild, 'comandos');
  if (canalCmd) {
    await limparCanal(canalCmd);
    await limparCanal(canalCmd);

    const chRegras = guild.channels.cache.find(c => c.name.toLowerCase().includes('regras'));
    const chLinks = guild.channels.cache.find(c => c.name.toLowerCase().includes('links') && !c.name.includes('comandos'));

    const embedCmd = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🌐  Informações Essenciais — NosleiraOT')
      .setDescription(
        '**Seja bem-vindo ao NosleiraOT!** Aqui estão as informações mais importantes:\n\n' +
        '**🌐 Criar sua Conta e Site Oficial:**\n' +
        `👉 [www.nosleiraot.com](${LINKS.SITE})\n\n` +
        '**📜 Regras do Servidor:**\n' +
        `👉 ${chRegras ? `<#${chRegras.id}>` : 'Canal de Regras'}\n\n` +
        '**🔗 Links e Redes Sociais:**\n' +
        `👉 ${chLinks ? `<#${chLinks.id}>` : 'Canal de Links'}`
      )
      .setFooter({ text: 'NosleiraOT • Informações' })
      .setTimestamp();

    const rowInfo = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🌐 Criar Conta').setStyle(ButtonStyle.Link).setURL(LINKS.SITE)
    );

    await canalCmd.send({ embeds: [embedCmd], components: [rowInfo] });
    console.log('✅ Postado: informações no canal substituindo guia de comandos');
  }

  // ───────────────────────────────────────────────────────────────
  // 8. Canal Links Oficiais — CENTRAL (todos os links reunidos, sem duplicar)
  // Um único embed + 10 botões únicos (5+5). Limpa antes para nunca duplicar.
  // ───────────────────────────────────────────────────────────────
  const canalLinks = findText(guild, '🔱');
  if (canalLinks) {
    await limparCanal(canalLinks);
    // Garante 2ª passada caso alguma msg antiga tenha escapado do rate-limit
    await limparCanal(canalLinks);

    const embed = new EmbedBuilder()
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
      .setFooter({ text: 'NosleiraOT • Central de Links — Atualizado em' })
      .setTimestamp();

    // Discord: máx 5 botões por ActionRow
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

    await canalLinks.send({ embeds: [embed], components: [row1, row2] });
    console.log('✅ Postado: #links-oficiais');
  }

  console.log('\n🎉 Concluído! Todos os embeds foram atualizados.');
  client.destroy();
});

client.login(TOKEN);
