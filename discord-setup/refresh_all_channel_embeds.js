const {
  Client,
  GatewayIntentBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  AttachmentBuilder,
  StringSelectMenuBuilder,
} = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
});

const BANNER_PATH = path.join(__dirname, 'assets', 'welcome_banner.jpg');
const SITE_URL = 'https://www.nosleiraot.com';

async function limparCanal(canal) {
  try {
    const msgs = await canal.messages.fetch({ limit: 50 }).catch(() => null);
    if (!msgs || msgs.size === 0) return;
    for (const m of msgs.values()) {
      await m.delete().catch(() => {});
    }
  } catch (err) {}
}

const findCh = (guild, keyword) => {
  const kw = keyword.toLowerCase();
  return guild.channels.cache.find(
    (c) =>
      c.type === ChannelType.GuildText &&
      (c.name.toLowerCase().includes(kw) || c.name.normalize('NFKD').toLowerCase().includes(kw))
  );
};

client.once('ready', async () => {
  console.log(`🤖 Iniciando atualização completa de fotos, avatares e embeds: ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) {
    console.error('❌ Servidor não encontrado!');
    process.exit(1);
  }

  await guild.channels.fetch();
  await guild.members.fetch().catch(() => {});

  const owner = await guild.fetchOwner().catch(() => null);
  const botAvatar = client.user.displayAvatarURL({ dynamic: true, size: 512 });
  const guildIcon = guild.iconURL({ dynamic: true, size: 512 }) || botAvatar;
  const ownerAvatar = owner ? owner.user.displayAvatarURL({ dynamic: true, size: 512 }) : botAvatar;

  console.log(`📸 Fotos carregadas em tempo real:`);
  console.log(`   - Ícone do Servidor: ${guildIcon}`);
  console.log(`   - Foto do Bot: ${botAvatar}`);
  console.log(`   - Foto do Admin/Dono: ${ownerAvatar}`);

  const chLinks = findCh(guild, 'links');
  const chTicket = findCh(guild, 'ticket-br');
  const chRegras = findCh(guild, 'regras');
  const chComandos = findCh(guild, 'comandos');

  // ─────────────────────────────────────────────
  // 1. CANAL DE BOAS-VINDAS (【👋】𝗕𝗲𝗺-𝗩𝗶𝗻𝗱𝗼𝘀)
  // ─────────────────────────────────────────────
  const chBV = findCh(guild, 'bem-vindos') || findCh(guild, 'bem-vindo');
  if (chBV) {
    console.log('🔄 Atualizando canal de Boas-Vindas...');
    await limparCanal(chBV);

    const embedBV = new EmbedBuilder()
      .setColor('#E67E22')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Servidor Oficial',
        iconURL: guildIcon,
      })
      .setTitle('⚔️  BEM-VINDO(A) AO NOSLEIRA OT 7.4!  ⚔️')
      .setDescription(
        'Seja muito bem-vindo(a) à nossa comunidade **Tibia 7.4 Old School**!\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        `🌐 **Site Oficial:** [www.nosleiraot.com](${SITE_URL}) — Crie sua conta.\n` +
        (chLinks ? `📥 **Downloads & Links:** <#${chLinks.id}>\n` : '') +
        (chTicket ? `🎫 **Central de Suporte:** <#${chTicket.id}> — Abra seu ticket aqui.\n` : '') +
        (chRegras ? `📜 **Regras do Servidor:** <#${chRegras.id}>\n` : '') +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .setThumbnail(guildIcon)
      .setImage('attachment://welcome_banner.jpg')
      .setFooter({ text: 'NosleiraOT 7.4 • Boas-Vindas Oficial', iconURL: botAvatar })
      .setTimestamp();

    const rowBV = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🌐 Criar Conta').setStyle(ButtonStyle.Link).setURL(SITE_URL),
      new ButtonBuilder().setCustomId('create_ticket').setLabel('🎫 Abrir Ticket').setStyle(ButtonStyle.Success)
    );

    const files = [];
    if (fs.existsSync(BANNER_PATH)) {
      files.push(new AttachmentBuilder(BANNER_PATH, { name: 'welcome_banner.jpg' }));
    }

    await chBV.send({
      embeds: [embedBV],
      components: [rowBV],
      files: files.length > 0 ? files : undefined,
    });
    console.log('✅ Canal Boas-Vindas atualizado com fotos em tempo real!');
  }

  // ─────────────────────────────────────────────
  // 2. CANAL DE REGRAS (【⛔】𝗥𝗲𝗴𝗿𝗮𝘀)
  // ─────────────────────────────────────────────
  if (chRegras) {
    console.log('🔄 Atualizando canal de Regras...');
    await limparCanal(chRegras);

    const embedRegras = new EmbedBuilder()
      .setColor('#E74C3C')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Diretrizes & Conduta Oficial',
        iconURL: guildIcon,
      })
      .setTitle('📜  Regras Oficiais da Comunidade & Servidor')
      .setDescription(
        'Para manter um ambiente justo, seguro e respeitoso para todos os aventureiros, ' +
        'o cumprimento das diretrizes abaixo é **obrigatório** em todos os canais do Discord e dentro do jogo.\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '1️⃣  Respeito Mútuo & Convivência Saudável',
          value:
            '> • Proibido qualquer tipo de preconceito, racismo, homofobia, assédio, ódio ou discriminação.\n' +
            '> • Evite brigas tóxicas e ofensas pesadas fora do contexto natural e esportivo de PvP do jogo.',
          inline: false,
        },
        {
          name: '2️⃣  Proibição Rígida de Conteúdo Impróprio (Tolerância Zero)',
          value:
            '> • **Proibido pornografia, nudes, links adultos ou gore (Banimento Imediato).**\n' +
            '> • **Proibido links ou divulgação de casas de apostas, cassinos, bots de bet ou jogos de azar.**',
          inline: false,
        },
        {
          name: '3️⃣  Trapaças, Bots & Segurança de Contas',
          value:
            '> • Proibido uso de softwares ilegais, botting invasivo, packet injection, speed hacks ou bugs abusivos.\n' +
            '> • Nunca compartilhe sua senha ou conta. A staff nunca solicita sua senha!',
          inline: false,
        },
        {
          name: '4️⃣  Divulgação & Spam',
          value:
            '> • Proibido divulgar outros servidores, links maliciosos, scams, phishing ou canais externos não autorizados.',
          inline: false,
        },
        {
          name: '5️⃣  Atendimento & Suporte Oficial',
          value:
            chTicket ? `> • Para denúncias, dúvidas ou suporte, abra um ticket exclusivo em <#${chTicket.id}>.` : '> • Utilize os canais oficiais de ticket para suporte.',
          inline: false,
        }
      )
      .setThumbnail(ownerAvatar)
      .setFooter({ text: 'NosleiraOT 7.4 • Administração', iconURL: botAvatar })
      .setTimestamp();

    const rowRegras = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🌐 Site Oficial').setStyle(ButtonStyle.Link).setURL(SITE_URL),
      new ButtonBuilder().setCustomId('create_ticket').setLabel('🎫 Suporte & Denúncias').setStyle(ButtonStyle.Danger)
    );

    await chRegras.send({ embeds: [embedRegras], components: [rowRegras] });
    console.log('✅ Canal de Regras atualizado com fotos em tempo real!');
  }

  // ─────────────────────────────────────────────
  // 3. CANAL DE LINKS & DOWNLOADS (【🔱】𝗟𝗶𝗻𝗸𝘀)
  // ─────────────────────────────────────────────
  if (chLinks) {
    console.log('🔄 Atualizando canal de Links & Downloads...');
    await limparCanal(chLinks);

    const embedLinks = new EmbedBuilder()
      .setColor('#9B59B6')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Central de Links Oficiais',
        iconURL: guildIcon,
      })
      .setTitle('🔱  Links Úteis & Download do Cliente')
      .setDescription(
        'Todos os links oficiais e seguros do **NosleiraOT 7.4** reunidos em um só lugar:\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '🌐 Site & Criação de Contas',
          value: `> [www.nosleiraot.com](${SITE_URL})\n> Acesse para registrar sua conta, ver o ranking e gerenciar seu char.`,
          inline: false,
        },
        {
          name: '📥 Download do Cliente Dedicado (OTCv8)',
          value: `> [Download Direto no Site Oficial](${SITE_URL})\n> Cliente completo com gráficos suaves, FPS desbloqueado e som integrado.`,
          inline: false,
        },
        {
          name: '🎫 Atendimento & Dúvidas',
          value: chTicket ? `> <#${chTicket.id}> — Abra seu chamado diretamente com a equipe.` : '> Utilize nosso suporte oficial.',
          inline: false,
        }
      )
      .setThumbnail(guildIcon)
      .setFooter({ text: 'NosleiraOT 7.4 • Links Oficiais', iconURL: botAvatar })
      .setTimestamp();

    const rowLinks = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🌐 Acessar Site').setStyle(ButtonStyle.Link).setURL(SITE_URL),
      new ButtonBuilder().setLabel('📥 Baixar Cliente').setStyle(ButtonStyle.Link).setURL(SITE_URL),
      new ButtonBuilder().setCustomId('create_ticket').setLabel('🎫 Suporte').setStyle(ButtonStyle.Success)
    );

    await chLinks.send({ embeds: [embedLinks], components: [rowLinks] });
    console.log('✅ Canal de Links atualizado com fotos em tempo real!');
  }

  // ─────────────────────────────────────────────
  // 4. CANAL DE COMANDOS (【🤖】𝗖𝗼𝗺𝗮𝗻𝗱𝗼𝘀-𝗚𝗲𝗿𝗮𝗹)
  // ─────────────────────────────────────────────
  if (chComandos) {
    console.log('🔄 Atualizando canal de Comandos...');
    await limparCanal(chComandos);

    const embedCmd = new EmbedBuilder()
      .setColor('#2ECC71')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Central de Comandos & Utilitários',
        iconURL: guildIcon,
      })
      .setTitle('🤖  Guia de Comandos do NosleiraOT-BOT')
      .setDescription(
        'Aqui estão os comandos e atalhos rápidos disponíveis para você utilizar no Discord:\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '💬 Comandos de Chat (`!`)',
          value: [
            '> `!rank` ou `!perfil` — Exibe seu nível de atividade e tempo em call.',
            '> `!top` — Ranking dos jogadores mais ativos da comunidade.',
            '> `!site` — Link direto para criar conta e download.',
            '> `!regras` — Resumo rápido das regras principais.',
            '> `!boss list` — Lista os bosses monitorados e status.',
          ].join('\n'),
          inline: false,
        },
        {
          name: '🎥 Mídia, Lives & Prints',
          value: [
            '> `!stream <link>` — Divulga sua transmissão ao vivo no canal de streamers.',
            '> `!print <título> | <link>` — Compartilha screenshots e vitórias.',
            '> `!clip <título> | <link>` — Publica os melhores clipes de PvP e quests.',
          ].join('\n'),
          inline: false,
        }
      )
      .setThumbnail(botAvatar)
      .setFooter({ text: 'NosleiraOT 7.4 • Bot Integrado', iconURL: botAvatar })
      .setTimestamp();

    const rowCmd = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('cmd_rank_self').setLabel('🏆 Meu Rank').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('cmd_vocacao_menu').setLabel('🛡️ Escolher Vocação').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('create_ticket').setLabel('🎫 Abrir Ticket').setStyle(ButtonStyle.Success)
    );

    await chComandos.send({ embeds: [embedCmd], components: [rowCmd] });
    console.log('✅ Canal de Comandos atualizado com fotos em tempo real!');
  }

  // ─────────────────────────────────────────────
  // 5. CANAL DE TICKET (【🔴】𝗧𝗶𝗰𝗸𝗲𝘁-𝗕𝗥)
  // ─────────────────────────────────────────────
  if (chTicket) {
    console.log('🔄 Atualizando canal de Ticket...');
    await limparCanal(chTicket);

    const embedTicket = new EmbedBuilder()
      .setColor('#E67E22')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Central de Suporte & Atendimento',
        iconURL: guildIcon,
      })
      .setTitle('🎫  Precisa de Ajuda? Abra um Atendimento!')
      .setDescription(
        'Nossa equipe de suporte está pronta para te atender com agilidade e total segurança!\n\n' +
        '**Departamentos Disponíveis:**\n' +
        '> 👑 **Falar com o Dono** (Assuntos exclusivos)\n' +
        '> 🎁 **Item de Donate** & 💳 **Problemas com Pagamento**\n' +
        '> 🐛 **Bug no Jogo** & 🚨 **Denúncias**\n' +
        '> 👤 **Problema com Conta**, 🔑 **Recover Key** & 🔓 **Remover 2FA**\n' +
        '> ❓ **Dúvidas Gerais**\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        '👉 **Clique no botão verde abaixo para abrir seu ticket:**'
      )
      .setThumbnail(guildIcon)
      .setFooter({ text: 'NosleiraOT 7.4 • Atendimento 24/7', iconURL: botAvatar })
      .setTimestamp();

    const rowTicket = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('🎫 Abrir Atendimento')
        .setStyle(ButtonStyle.Success)
    );

    await chTicket.send({ embeds: [embedTicket], components: [rowTicket] });
    console.log('✅ Painel de Ticket atualizado com fotos em tempo real!');
  }

  console.log('\n🎉 TODOS OS CANAIS E FOTOS FORAM ATUALIZADOS COM SUCESSO!');
  process.exit(0);
});

client.login(process.env.TOKEN);
