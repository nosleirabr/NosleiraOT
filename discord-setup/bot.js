/**
 * ═══════════════════════════════════════════════════════════════════
 *   NosleiraOT — Bot Principal  v3.0
 *   Mantenha rodando SEMPRE com: node bot.js
 * ═══════════════════════════════════════════════════════════════════
 *
 *  FUNCIONALIDADES:
 *   ✅ Verificação (Idade + Vocação) com botões
 *   ✅ Boas-vindas automáticas
 *   ✅ Sistema de Tickets com 6 categorias
 *   ✅ Sistema de Streamers (!NosleiraOT + detecção automática)
 *   ✅ Monitor de Bosses (!boss spawn/drop)
 *   ✅ Comandos de moderação (!mute !unmute !kick !ban)
 */

const {
  Client,
  Events,
  GatewayIntentBits,
  PermissionFlagsBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ActivityType,
} = require('discord.js');

// ─────────────────────────────────────────────
//  CONFIGURAÇÃO
// ─────────────────────────────────────────────
const TOKEN    = 'MTU1MDk0Njg0OTIyMzg2ODQ3Nw.GbKhS5.cStGJn59ObTX8lv-URRPVjSBuoqHg2X0gy64eQ';
const GUILD_ID = '1550944696761843915';
const SITE_URL = 'https://nosleira.com.br';

// Cargos de staff que podem atender tickets
const CARGOS_STAFF = [
  '🎓 Tutor', '⭐ Sênior Tutor',
  '🛡️ Community Manager', '🔱 Game Master',
  '👑 Administrador', '💠 Dono',
];

// Prefixo dos comandos de texto
const PREFIX = '!';
// ─────────────────────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,   // necessário para detectar streams
    GatewayIntentBits.MessageContent,
  ],
});

// ─────────────────────────────────────────────
//  ESTADO EM MEMÓRIA
// ─────────────────────────────────────────────
let   ticketCounter       = 1;
const pendingVerification = new Map(); // userId → { age: true|false }
const activeStreams        = new Map(); // userId → messageId postado em #lives-ao-vivo

// ═══════════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════════
const ehStaff = (member) =>
  member.roles.cache.some((r) => CARGOS_STAFF.includes(r.name));

const getRole = (guild, name) =>
  guild.roles.cache.find((r) => r.name === name);

const getChannel = (guild, fragment) =>
  guild.channels.cache.find(
    (c) => c.name.includes(fragment) && c.type === ChannelType.GuildText,
  );

const getStaffRoles = (guild) =>
  guild.roles.cache.filter((r) => CARGOS_STAFF.includes(r.name));

// Formata data/hora em pt-BR
const agora = () => `<t:${Math.floor(Date.now() / 1000)}:F>`;

// ═══════════════════════════════════════════════════════════════════
//  BOAS-VINDAS + VERIFICAÇÃO INICIAL
// ═══════════════════════════════════════════════════════════════════
client.on(Events.GuildMemberAdd, async (member) => {
  try {
    // Atribui cargo Novato
    const novato = getRole(member.guild, '🆕 Novato');
    if (novato) await member.roles.add(novato);

    // Mensagem de boas-vindas no canal de avisos
    const canalAvisos = getChannel(member.guild, 'avisos');
    if (canalAvisos) {
      const embed = new EmbedBuilder()
        .setColor('#E67E22')
        .setTitle('🎉  Novo Aventureiro chegou!')
        .setDescription(
          `${member} entrou no **NosleiraOT**! Seja muito bem-vindo(a)! 🎮\n\n` +
          '> 📜  Leia as regras em <#regras>\n' +
          '> 🔐  Faça sua verificação para liberar o acesso\n' +
          '> 💬  Converse em **#💬┃chat-geral**\n' +
          '> 🎫  Precisa de suporte? Abra um **ticket**!\n\n' +
          '*Bom jogo e bons loots!* ⚔️🏹🔮🌿'
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `NosleiraOT • Membro #${member.guild.memberCount}` })
        .setTimestamp();
      await canalAvisos.send({ embeds: [embed] });
    }

    // Mensagem de verificação em DM (com fallback para canal de verificação)
    try {
      const embedDM = new EmbedBuilder()
        .setColor('#3498DB')
        .setTitle(`👋  Olá, ${member.user.username}! Bem-vindo ao NosleiraOT!`)
        .setDescription(
          'Para ter acesso completo ao servidor, complete a verificação rápida!\n\n' +
          `Vá até o canal **#🔐┃verificacao** no servidor e clique em **Iniciar Verificação**.\n\n` +
          `🔗 [Clique aqui para ir direto](${SITE_URL})`
        )
        .setFooter({ text: 'NosleiraOT • Verificação Automática' });
      await member.send({ embeds: [embedDM] });
    } catch {
      // DMs fechadas — sem problema, o canal de verificação está disponível
    }
  } catch (err) {
    console.error('[GuildMemberAdd] Erro:', err.message);
  }
});

// ═══════════════════════════════════════════════════════════════════
//  SISTEMA DE STREAMERS — Detecção automática via Presence
// ═══════════════════════════════════════════════════════════════════
client.on(Events.PresenceUpdate, async (oldPresence, newPresence) => {
  try {
    const guild  = newPresence?.guild;
    const member = newPresence?.member;
    if (!guild || !member) return;

    // Canal de lives
    const canalLives = getChannel(guild, 'lives-ao-vivo');
    if (!canalLives) return;

    // Busca atividade de streaming
    const streaming = newPresence?.activities?.find(
      (a) => a.type === ActivityType.Streaming,
    );
    const eraStreaming = oldPresence?.activities?.find(
      (a) => a.type === ActivityType.Streaming,
    );

    const temTag = streaming?.name?.toLowerCase().includes('nosleira') ||
                   streaming?.details?.toLowerCase().includes('nosleira') ||
                   streaming?.state?.toLowerCase().includes('nosleira');

    // Começou a stream com a tag NosleiraOT
    if (streaming && temTag && !activeStreams.has(member.id)) {
      const plataforma = streaming.url?.includes('twitch') ? 'Twitch' :
                         streaming.url?.includes('youtube') ? 'YouTube' : 'Stream';

      const embed = new EmbedBuilder()
        .setColor('#9146FF')
        .setTitle(`📺  ${member.displayName} está ao vivo!`)
        .setDescription(
          `**${streaming.name || 'Ao vivo agora!'}**\n\n` +
          `> 🎮  Jogando: **NosleiraOT**\n` +
          (streaming.url ? `> 🔗  [Assistir na ${plataforma}](${streaming.url})\n` : '') +
          '\n*Use `!NosleiraOT <link>` para anunciar sua stream manualmente!*'
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `NosleiraOT • ${plataforma}` })
        .setTimestamp();

      const msg = await canalLives.send({
        content: '@here 📢 Alguém está ao vivo!',
        embeds:  [embed],
      });
      activeStreams.set(member.id, msg.id);

      // Atribui cargo Streamer se existir
      const cargoStreamer = getRole(guild, '📺 Streamer');
      if (cargoStreamer && !member.roles.cache.has(cargoStreamer.id)) {
        await member.roles.add(cargoStreamer).catch(() => {});
      }
    }

    // Parou de fazer stream
    if (!streaming && eraStreaming && activeStreams.has(member.id)) {
      activeStreams.delete(member.id);
      // Remove cargo Streamer
      const cargoStreamer = getRole(guild, '📺 Streamer');
      if (cargoStreamer && member.roles.cache.has(cargoStreamer.id)) {
        await member.roles.remove(cargoStreamer).catch(() => {});
      }
    }
  } catch (err) {
    console.error('[PresenceUpdate] Erro:', err.message);
  }
});

// ═══════════════════════════════════════════════════════════════════
//  COMANDOS DE TEXTO
// ═══════════════════════════════════════════════════════════════════
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  const guild  = message.guild;
  const member = message.member;

  // ── !NosleiraOT <link> — Anuncia stream manualmente ─────────────
  if (message.content.toLowerCase().startsWith('!nosleiraoт') ||
      message.content.toLowerCase().startsWith('!nosleira')) {

    const partes = message.content.split(' ');
    const link   = partes[1] || null;

    const canalLives = getChannel(guild, 'lives-ao-vivo');
    if (!canalLives) return;

    const embed = new EmbedBuilder()
      .setColor('#9146FF')
      .setTitle(`📺  ${member.displayName} está fazendo live!`)
      .setDescription(
        `**${member.displayName} está jogando NosleiraOT ao vivo!**\n\n` +
        (link ? `> 🔗  [Clique para assistir](${link})\n\n` : '') +
        '*Venha assistir e apoiar a comunidade!* 🎮'
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: 'NosleiraOT • Comunidade' })
      .setTimestamp();

    await canalLives.send({ content: '📺 @here Alguém está ao vivo!', embeds: [embed] });
    await message.react('✅');
    return;
  }

  if (!message.content.startsWith(PREFIX)) return;

  const args    = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  // ── !boss spawn/drop ─────────────────────────────────────────────
  if (command === 'boss') {
    if (!ehStaff(member)) {
      return message.reply('❌ Apenas staff pode usar este comando.');
    }
    const sub = args[0]?.toLowerCase();

    if (sub === 'spawn') {
      // !boss spawn <nome>
      const nomeBoss = args.slice(1).join(' ') || 'Desconhecido';
      const canalSpawn = getChannel(guild, 'boss-spawns');
      if (canalSpawn) {
        const embed = new EmbedBuilder()
          .setColor('#E67E22')
          .setTitle('⚔️  Boss Nasceu!')
          .addFields(
            { name: '👹  Boss',      value: nomeBoss,    inline: true },
            { name: '📅  Hora',      value: agora(),     inline: true },
            { name: '👤  Reportado', value: `${member}`, inline: true },
          )
          .setFooter({ text: 'NosleiraOT • Monitor de Bosses' })
          .setTimestamp();
        await canalSpawn.send({ embeds: [embed] });
        await message.react('✅');
      }
      return;
    }

    if (sub === 'drop') {
      // !boss drop <boss> | <item> | <jogador>
      // Formato: !boss drop Ferumbras | Demon Helmet | Nosleira
      const resto    = args.slice(1).join(' ');
      const partes   = resto.split('|').map((s) => s.trim());
      const nomeBoss = partes[0] || 'Desconhecido';
      const item     = partes[1] || 'Item não informado';
      const jogador  = partes[2] || 'Não informado';

      const canalDrop = getChannel(guild, 'boss-drops');
      if (canalDrop) {
        const embed = new EmbedBuilder()
          .setColor('#9B59B6')
          .setTitle('💀  Drop de Boss!')
          .addFields(
            { name: '👹  Boss',     value: nomeBoss, inline: true },
            { name: '🎁  Item',     value: item,     inline: true },
            { name: '🏆  Jogador',  value: jogador,  inline: true },
            { name: '📅  Hora',     value: agora(),  inline: false },
          )
          .setFooter({ text: 'NosleiraOT • Monitor de Bosses' })
          .setTimestamp();
        await canalDrop.send({ embeds: [embed] });
        await message.react('✅');
      }
      return;
    }

    return message.reply(
      '**Uso correto:**\n' +
      '`!boss spawn <nome>` — Registra spawn de boss\n' +
      '`!boss drop <boss> | <item> | <jogador>` — Registra drop'
    );
  }

  // ── !mute @usuario <motivo> ──────────────────────────────────────
  if (command === 'mute') {
    if (!ehStaff(member)) return message.reply('❌ Sem permissão.');
    const alvo   = message.mentions.members.first();
    const motivo = args.slice(1).join(' ') || 'Sem motivo informado';
    if (!alvo) return message.reply('❌ Mencione um usuário. Ex: `!mute @player spam`');
    await alvo.timeout(10 * 60 * 1000, motivo); // 10 minutos
    await message.reply(`✅ **${alvo.displayName}** foi silenciado por 10 min. Motivo: ${motivo}`);
    return;
  }

  // ── !unmute @usuario ─────────────────────────────────────────────
  if (command === 'unmute') {
    if (!ehStaff(member)) return message.reply('❌ Sem permissão.');
    const alvo = message.mentions.members.first();
    if (!alvo) return message.reply('❌ Mencione um usuário.');
    await alvo.timeout(null);
    await message.reply(`✅ **${alvo.displayName}** foi desmutado.`);
    return;
  }

  // ── !kick @usuario <motivo> ──────────────────────────────────────
  if (command === 'kick') {
    if (!member.permissions.has(PermissionFlagsBits.KickMembers)) return message.reply('❌ Sem permissão.');
    const alvo   = message.mentions.members.first();
    const motivo = args.slice(1).join(' ') || 'Sem motivo informado';
    if (!alvo) return message.reply('❌ Mencione um usuário.');
    await alvo.kick(motivo);
    await message.reply(`✅ **${alvo.displayName}** foi expulso. Motivo: ${motivo}`);
    return;
  }

  // ── !ban @usuario <motivo> ───────────────────────────────────────
  if (command === 'ban') {
    if (!member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply('❌ Sem permissão.');
    const alvo   = message.mentions.members.first();
    const motivo = args.slice(1).join(' ') || 'Sem motivo informado';
    if (!alvo) return message.reply('❌ Mencione um usuário.');
    await alvo.ban({ reason: motivo, deleteMessageSeconds: 86400 });
    await message.reply(`🔨 **${alvo.displayName}** foi banido. Motivo: ${motivo}`);
    return;
  }
});

// ═══════════════════════════════════════════════════════════════════
//  INTERAÇÕES — Botões
// ═══════════════════════════════════════════════════════════════════
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  const { customId, guild, member, channel } = interaction;

  // ══════════════════════════════════════════
  //  VERIFICAÇÃO — Passo 1: Iniciar
  // ══════════════════════════════════════════
  if (customId === 'start_verification') {
    await interaction.reply({
      ephemeral: true,
      embeds: [
        new EmbedBuilder()
          .setColor('#3498DB')
          .setTitle('🔐  Verificação — Passo 1 de 2')
          .setDescription('**Você tem 18 anos ou mais?**\n\n*Sua resposta define se você terá acesso a conteúdo adulto no servidor.*'),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('verify_age_yes').setLabel('✅  Sim, tenho 18+').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId('verify_age_no').setLabel('🔞  Não, tenho menos de 18').setStyle(ButtonStyle.Secondary),
        ),
      ],
    });
    return;
  }

  // ══════════════════════════════════════════
  //  VERIFICAÇÃO — Passo 2: Vocação (após idade)
  // ══════════════════════════════════════════
  if (customId === 'verify_age_yes' || customId === 'verify_age_no') {
    const temDezoito = customId === 'verify_age_yes';
    pendingVerification.set(member.id, { age: temDezoito });

    await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setColor('#E67E22')
          .setTitle('⚔️  Verificação — Passo 2 de 2')
          .setDescription('**Qual vocação você joga no NosleiraOT?**\n\n*Escolha a que você mais utiliza!*'),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('voc_knight').setLabel('⚔️  Knight | EK').setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setCustomId('voc_paladin').setLabel('🏹  Paladin | RP').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId('voc_sorcerer').setLabel('🔮  Sorcerer | MS').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('voc_druid').setLabel('🌿  Druid | ED').setStyle(ButtonStyle.Secondary),
        ),
      ],
    });
    return;
  }

  // ══════════════════════════════════════════
  //  VERIFICAÇÃO — Passo 3: Concluir
  // ══════════════════════════════════════════
  if (['voc_knight', 'voc_paladin', 'voc_sorcerer', 'voc_druid'].includes(customId)) {
    const estado = pendingVerification.get(member.id) || { age: false };
    pendingVerification.delete(member.id);

    const mapa = {
      voc_knight:   '⚔️ Knight | EK',
      voc_paladin:  '🏹 Paladin | RP',
      voc_sorcerer: '🔮 Sorcerer | MS',
      voc_druid:    '🌿 Druid | ED',
    };
    const nomeVoc = mapa[customId];

    try {
      // Remove Novato, adiciona Player
      const novato = getRole(guild, '🆕 Novato');
      const player = getRole(guild, '🎮 Player');
      if (novato) await member.roles.remove(novato).catch(() => {});
      if (player) await member.roles.add(player).catch(() => {});

      // Adiciona cargo de vocação
      const cargoVoc = getRole(guild, nomeVoc);
      if (cargoVoc) await member.roles.add(cargoVoc).catch(() => {});

      // Adiciona cargo de idade
      const nomeIdade = estado.age ? '✅ 18+' : '🔞 -18';
      const cargoIdade = getRole(guild, nomeIdade);
      if (cargoIdade) await member.roles.add(cargoIdade).catch(() => {});

      await interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor('#2ECC71')
            .setTitle('✅  Verificação Concluída!')
            .setDescription(
              `Bem-vindo(a), **${member.displayName}**! 🎉\n\n` +
              `> 🎭  Vocação: **${nomeVoc}**\n` +
              `> 🔞  Faixa etária: **${nomeIdade}**\n\n` +
              '*Você agora tem acesso completo ao servidor. Bom jogo!* 🎮'
            )
            .setFooter({ text: 'NosleiraOT • Verificação Concluída' }),
        ],
        components: [],
      });
    } catch (err) {
      console.error('[Verificação] Erro:', err.message);
      await interaction.update({ content: '❌ Erro na verificação. Contate um admin.', components: [] });
    }
    return;
  }

  // ══════════════════════════════════════════
  //  TICKET — Seleção de Categoria
  // ══════════════════════════════════════════
  if (customId === 'create_ticket') {
    await interaction.reply({
      ephemeral: true,
      embeds: [
        new EmbedBuilder()
          .setColor('#E67E22')
          .setTitle('🎫  Abrir Ticket — Selecione o Assunto')
          .setDescription('**Qual o motivo do seu ticket?**\n\nEscolha a categoria correta para agilizar o atendimento:'),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('ticket_cat_bug').setLabel('🐛  Bug no Jogo').setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setCustomId('ticket_cat_pagamento').setLabel('💳  Problema Pagamento').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('ticket_cat_item').setLabel('🎁  Item Donate').setStyle(ButtonStyle.Success),
        ),
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('ticket_cat_conta').setLabel('👤  Problema Conta').setStyle(ButtonStyle.Secondary),
          new ButtonBuilder().setCustomId('ticket_cat_denuncia').setLabel('🚨  Denúncia').setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setCustomId('ticket_cat_duvida').setLabel('❓  Dúvida Geral').setStyle(ButtonStyle.Secondary),
        ),
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('ticket_cat_dono').setLabel('👑  Falar com o Dono').setStyle(ButtonStyle.Primary),
        ),
      ],
    });
    return;
  }

  // ══════════════════════════════════════════
  //  TICKET — Criar canal por categoria
  // ══════════════════════════════════════════
  const categorias = {
    ticket_cat_bug:       { emoji: '🐛', nome: 'Bug no Jogo',           cor: '#E74C3C', campos: ['🐛 Descreva o bug em detalhes:', '📍 Onde ocorreu (mapa/local):', '🔄 Como reproduzir:'] },
    ticket_cat_pagamento: { emoji: '💳', nome: 'Problema com Pagamento', cor: '#3498DB', campos: ['💳 Valor pago:', '📅 Data do pagamento:', '📧 E-mail usado no pagamento:', '🧾 Comprovante (envie abaixo):'] },
    ticket_cat_item:      { emoji: '🎁', nome: 'Item de Donate',         cor: '#9B59B6', campos: ['🎁 Item que não recebeu:', '🧙 Nome do personagem no jogo:', '💳 ID/Número da compra:'] },
    ticket_cat_conta:     { emoji: '👤', nome: 'Problema com Conta',     cor: '#F39C12', campos: ['👤 Nome da conta:', '🧙 Personagem afetado:', '📋 Descreva o problema:'] },
    ticket_cat_denuncia:  { emoji: '🚨', nome: 'Denúncia',               cor: '#E74C3C', campos: ['🚨 Quem está denunciando:', '📋 Descreva o ocorrido:', '🧾 Evidências (prints/vídeos):'] },
    ticket_cat_duvida:    { emoji: '❓', nome: 'Dúvida Geral',           cor: '#2ECC71', campos: ['❓ Qual é sua dúvida:'] },
    ticket_cat_dono:      { emoji: '👑', nome: 'Falar com o Dono',       cor: '#FF0000', campos: ['👑 Assunto a tratar diretamente com o Dono:', '📋 Por favor, detalhe ao máximo antes de ser atendido:'] },
  };

  if (categorias[customId]) {
    await interaction.deferUpdate();
    const cat = categorias[customId];

    try {
      // Verifica ticket duplicado
      const ticketExistente = guild.channels.cache.find(
        (c) => c.name === `${cat.emoji}┃ticket-${member.user.username.toLowerCase().replace(/\s+/g, '-')}`,
      );
      if (ticketExistente) {
        return interaction.editReply({
          content: `❌ Você já tem um ticket aberto: ${ticketExistente}`,
          embeds: [], components: [],
        });
      }

      const categoriaSuporte = guild.channels.cache.find(
        (c) => c.name.includes('SUPORTE') && c.type === ChannelType.GuildCategory,
      );
      const staffRoles  = getStaffRoles(guild);
      const overwrites  = [
        { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        {
          id:    member.id,
          allow: [
            PermissionFlagsBits.ViewChannel,    PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AttachFiles,
          ],
        },
        ...staffRoles.map((r) => ({
          id:    r.id,
          allow: [
            PermissionFlagsBits.ViewChannel,    PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages,
            PermissionFlagsBits.AttachFiles,
          ],
        })),
      ];

      const nomeCanal = `${cat.emoji}┃ticket-${member.user.username.toLowerCase().replace(/\s+/g, '-')}`;
      const canalTicket = await guild.channels.create({
        name:                 nomeCanal,
        type:                 ChannelType.GuildText,
        parent:               categoriaSuporte?.id,
        topic:                `[${cat.nome}] Ticket de ${member.user.tag} | #${ticketCounter.toString().padStart(4, '0')}`,
        permissionOverwrites: overwrites,
        reason:               'Ticket aberto via painel',
      });

      // Monta campos de instruções para o usuário
      const instrucoes = cat.campos.map((c) => `> ${c}`).join('\n');

      const embedTicket = new EmbedBuilder()
        .setColor(cat.cor)
        .setTitle(`${cat.emoji}  Ticket #${ticketCounter.toString().padStart(4, '0')} — ${cat.nome}`)
        .setDescription(
          `Olá, ${member}! Seu ticket foi aberto na categoria **${cat.nome}**.\n\n` +
          '**Por favor, responda as perguntas abaixo:**\n' +
          instrucoes + '\n\n' +
          '*Nossa equipe responderá em breve! Tempo médio: até 24 horas.*'
        )
        .addFields(
          { name: '👤  Usuário',   value: `${member}`,                                  inline: true },
          { name: '📋  Categoria', value: `${cat.emoji} ${cat.nome}`,                   inline: true },
          { name: '📅  Aberto em', value: agora(),                                      inline: true },
          { name: '📊  Status',    value: '🟡 Aguardando atendimento',                  inline: false },
        )
        .setFooter({ text: 'NosleiraOT • Suporte Oficial' })
        .setTimestamp();

      const rowTicket = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('claim_ticket').setLabel('✋  Assumir').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('close_ticket').setLabel('🔒  Fechar Ticket').setStyle(ButtonStyle.Danger),
      );

      const mencaoStaff = staffRoles.map((r) => `<@&${r.id}>`).join(' ');
      await canalTicket.send({
        content: `${member} ${mencaoStaff}`,
        embeds:  [embedTicket],
        components: [rowTicket],
      });

      ticketCounter++;

      await interaction.editReply({
        content: `✅ Ticket aberto em ${canalTicket}!`,
        embeds: [], components: [],
      });
    } catch (err) {
      console.error('[create_ticket_cat] Erro:', err.message);
    }
    return;
  }

  // ══════════════════════════════════════════
  //  TICKET — Assumir
  // ══════════════════════════════════════════
  if (customId === 'claim_ticket') {
    if (!ehStaff(member)) {
      return interaction.reply({ content: '❌ Apenas staff pode assumir tickets.', ephemeral: true });
    }
    await interaction.deferUpdate();

    const embedAtualizado = EmbedBuilder.from(interaction.message.embeds[0])
      .setColor('#2ECC71')
      .spliceFields(3, 1, { name: '📊  Status', value: `🟢 Assumido por ${member}`, inline: false });

    await interaction.message.edit({ embeds: [embedAtualizado] });
    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('#2ECC71')
          .setDescription(`✋  **${member.displayName}** assumiu este ticket e te atenderá em breve!`),
      ],
    });
    return;
  }

  // ══════════════════════════════════════════
  //  TICKET — Fechar (pede confirmação)
  // ══════════════════════════════════════════
  if (customId === 'close_ticket') {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('#E74C3C')
          .setTitle('🔒  Fechar Ticket')
          .setDescription('Tem certeza que deseja fechar este ticket?\n*O canal será deletado.*'),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('confirm_close').setLabel('✅  Confirmar').setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setCustomId('cancel_close').setLabel('❌  Cancelar').setStyle(ButtonStyle.Secondary),
        ),
      ],
    });
    return;
  }

  if (customId === 'cancel_close') {
    await interaction.update({ content: '✅ Cancelado.', embeds: [], components: [] });
    return;
  }

  // ══════════════════════════════════════════
  //  TICKET — Confirmar fechamento
  // ══════════════════════════════════════════
  if (customId === 'confirm_close') {
    await interaction.deferUpdate();

    const canalLog = getChannel(guild, 'log-tickets');
    if (canalLog) {
      await canalLog.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#E74C3C')
            .setTitle('🔒  Ticket Fechado')
            .addFields(
              { name: '📋  Canal',      value: channel.name,   inline: true },
              { name: '👤  Fechado por',value: `${member}`,    inline: true },
              { name: '📅  Data',       value: agora(),        inline: true },
            )
            .setFooter({ text: 'NosleiraOT • Log de Tickets' })
            .setTimestamp(),
        ],
      });
    }

    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('#E74C3C')
          .setDescription(`🔒  Ticket fechado por **${member.displayName}**. Canal sendo removido...`),
      ],
    });

    setTimeout(() => channel.delete('Ticket fechado').catch(console.error), 5000);
    return;
  }
});

// ═══════════════════════════════════════════════════════════════════
//  AFK — Muta microfone automaticamente ao entrar no canal AFK
// ═══════════════════════════════════════════════════════════════════
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  try {
    // Entrou no canal AFK
    if (newState.channel && newState.channel.name.includes('AFK')) {
      if (!newState.serverMute) {
        await newState.setMute(true, 'Entrou no canal AFK');
      }
      if (!newState.serverDeaf) {
        await newState.setDeaf(true, 'Entrou no canal AFK');
      }
    }

    // Saiu do canal AFK e foi para outro canal
    if (oldState.channel && oldState.channel.name.includes('AFK') &&
        newState.channel && !newState.channel.name.includes('AFK')) {
      if (newState.serverMute) {
        await newState.setMute(false, 'Saiu do canal AFK');
      }
      if (newState.serverDeaf) {
        await newState.setDeaf(false, 'Saiu do canal AFK');
      }
    }
  } catch (err) {
    console.error('[AFK Mute] Erro:', err.message);
  }
});

// ═══════════════════════════════════════════════════════════════════
//  READY
// ═══════════════════════════════════════════════════════════════════
client.once(Events.ClientReady, () => {
  console.log('═══════════════════════════════════════════════');
  console.log(`🤖  Bot online: ${client.user.tag}`);
  console.log('🔐  Verificação automática:   ATIVA');
  console.log('🎫  Sistema de tickets:       ATIVO');
  console.log('📺  Sistema de streamers:     ATIVO');
  console.log('⚔️   Monitor de bosses:        ATIVO');
  console.log('🛡️   Comandos de moderação:    ATIVOS');
  console.log('🤫  AFK auto-mute:            ATIVO');
  console.log('═══════════════════════════════════════════════');
  client.user.setActivity('NosleiraOT', { type: ActivityType.Watching });
});

client.login(TOKEN);
