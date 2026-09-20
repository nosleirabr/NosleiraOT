/**
 * ═══════════════════════════════════════════════════════════════════
 *   NosleiraOT — Setup Completo do Servidor Discord  v2.0
 *   Rode APENAS UMA VEZ para montar toda a estrutura
 * ═══════════════════════════════════════════════════════════════════
 *   npm install discord.js
 *   node setup.js
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
} = require('discord.js');

// ─────────────────────────────────────────────
//  CONFIGURAÇÃO
// ─────────────────────────────────────────────
const TOKEN    = 'MTU1MDk0Njg0OTIyMzg2ODQ3Nw.GbKhS5.cStGJn59ObTX8lv-URRPVjSBuoqHg2X0gy64eQ';
const GUILD_ID = '1550944696761843915';

// URL do site (para integração futura com avisos)
const SITE_URL  = 'https://nosleira.com.br'; // ajuste conforme necessário
// ─────────────────────────────────────────────

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// ═══════════════════════════════════════════════════════════════════
//  CARGOS  (ordem: maior → menor na hierarquia)
// ═══════════════════════════════════════════════════════════════════
const ROLES = [
  // ── Staff ──────────────────────────────────────────────────────
  {
    name: '💠 Dono',
    colors: '#FF0000',
    hoist: true, mentionable: false,
    permissions: [PermissionFlagsBits.Administrator],
  },
  {
    name: '👑 Administrador',
    colors: '#C0392B',
    hoist: true, mentionable: true,
    permissions: [PermissionFlagsBits.Administrator],
  },
  {
    name: '🔱 Game Master',
    colors: '#E67E22',
    hoist: true, mentionable: true,
    permissions: [
      PermissionFlagsBits.ViewChannel,      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.ReadMessageHistory,PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.KickMembers,      PermissionFlagsBits.BanMembers,
      PermissionFlagsBits.MuteMembers,      PermissionFlagsBits.DeafenMembers,
      PermissionFlagsBits.MoveMembers,      PermissionFlagsBits.ManageNicknames,
      PermissionFlagsBits.Connect,          PermissionFlagsBits.Speak,
      PermissionFlagsBits.EmbedLinks,       PermissionFlagsBits.AttachFiles,
    ],
  },
  {
    name: '🛡️ Community Manager',
    colors: '#F39C12',
    hoist: true, mentionable: true,
    permissions: [
      PermissionFlagsBits.ViewChannel,      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.ReadMessageHistory,PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.KickMembers,      PermissionFlagsBits.MuteMembers,
      PermissionFlagsBits.MoveMembers,      PermissionFlagsBits.ManageNicknames,
      PermissionFlagsBits.Connect,          PermissionFlagsBits.Speak,
      PermissionFlagsBits.EmbedLinks,       PermissionFlagsBits.AttachFiles,
    ],
  },
  {
    name: '⭐ Sênior Tutor',
    colors: '#FFD700',
    hoist: true, mentionable: true,
    permissions: [
      PermissionFlagsBits.ViewChannel,      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.ReadMessageHistory,PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.MuteMembers,      PermissionFlagsBits.MoveMembers,
      PermissionFlagsBits.Connect,          PermissionFlagsBits.Speak,
      PermissionFlagsBits.EmbedLinks,       PermissionFlagsBits.AttachFiles,
    ],
  },
  {
    name: '🎓 Tutor',
    colors: '#3498DB',
    hoist: true, mentionable: true,
    permissions: [
      PermissionFlagsBits.ViewChannel,      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.ReadMessageHistory,PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.Connect,          PermissionFlagsBits.Speak,
      PermissionFlagsBits.EmbedLinks,       PermissionFlagsBits.AttachFiles,
    ],
  },
  // ── Jogadores ──────────────────────────────────────────────────
  {
    name: '💎 VIP',
    colors: '#9B59B6',
    hoist: true, mentionable: true,
    permissions: [
      PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.Connect,
      PermissionFlagsBits.Speak, PermissionFlagsBits.AddReactions,
    ],
  },
  {
    name: '🎮 Player',
    colors: '#2ECC71',
    hoist: true, mentionable: false,
    permissions: [
      PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.Connect,
      PermissionFlagsBits.Speak, PermissionFlagsBits.AddReactions,
    ],
  },
  // ── Vocações (tags, sem hoist) ─────────────────────────────────
  { name: '⚔️ Knight | EK',    colors: '#E74C3C', hoist: false, mentionable: false, permissions: [] },
  { name: '🏹 Paladin | RP',   colors: '#27AE60', hoist: false, mentionable: false, permissions: [] },
  { name: '🔮 Sorcerer | MS',  colors: '#8E44AD', hoist: false, mentionable: false, permissions: [] },
  { name: '🌿 Druid | ED',     colors: '#16A085', hoist: false, mentionable: false, permissions: [] },
  // ── Idade (tags, sem hoist) ────────────────────────────────────
  { name: '✅ 18+',            colors: '#2ECC71', hoist: false, mentionable: false, permissions: [] },
  { name: '🔞 -18',            colors: '#E74C3C', hoist: false, mentionable: false, permissions: [] },
  // ── Sistema ────────────────────────────────────────────────────
  { name: '🆕 Novato',         colors: '#95A5A6', hoist: false, mentionable: false, permissions: [] },
  { name: '🤖 Bots',           colors: '#7F8C8D', hoist: false, mentionable: false, permissions: [] },
];

// ═══════════════════════════════════════════════════════════════════
//  ESTRUTURA  (função que recebe roleMap + everyoneId já resolvidos)
// ═══════════════════════════════════════════════════════════════════
const buildStructure = (rm, ev) => {
  // Helpers de permissão
  const staffAllow = (perms) => [
    rm['🎓 Tutor'], rm['⭐ Sênior Tutor'],
    rm['🛡️ Community Manager'], rm['🔱 Game Master'],
    rm['👑 Administrador'], rm['💠 Dono'],
  ].map((r) => ({ id: r.id, allow: perms }));

  return [

    // ── 1. VERIFICAÇÃO ─────────────────────────────────────────────
    {
      name: '🔐 VERIFICAÇÃO',
      permissionOverwrites: [
        { id: ev, deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['🆕 Novato'].id, allow: [PermissionFlagsBits.ViewChannel] },
        ...staffAllow([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]),
      ],
      channels: [
        {
          name: '📋┃como-verificar',
          type: ChannelType.GuildText,
          topic: 'Instruções de verificação.',
          key: 'comoVerificar',
        },
        {
          name: '🔐┃verificacao',
          type: ChannelType.GuildText,
          topic: 'Responda as perguntas para liberar o acesso ao servidor.',
          key: 'verificacao',
        },
      ],
    },

    // ── 2. INFORMAÇÕES ─────────────────────────────────────────────
    {
      name: '📌 INFORMAÇÕES',
      permissionOverwrites: [
        { id: ev, deny: [PermissionFlagsBits.SendMessages] },
        ...staffAllow([PermissionFlagsBits.SendMessages]),
      ],
      channels: [
        { name: '📜┃regras',          type: ChannelType.GuildText, topic: 'Regras do NosleiraOT.', key: 'regras' },
        { name: '📢┃avisos',          type: ChannelType.GuildText, topic: `Avisos oficiais — integração futura com ${SITE_URL}`, key: 'avisos' },
        { name: '🌐┃links-oficiais',  type: ChannelType.GuildText, topic: 'Links do servidor.' },
        { name: '🗓️┃eventos',         type: ChannelType.GuildText, topic: 'Eventos e promoções.' },
        { name: '📊┃status-servidor', type: ChannelType.GuildText, topic: 'Status online/offline.' },
      ],
    },

    // ── 3. REDES SOCIAIS ───────────────────────────────────────────
    {
      name: '🌐 REDES SOCIAIS',
      permissionOverwrites: [
        { id: ev, deny: [PermissionFlagsBits.SendMessages] },
        { id: rm['👑 Administrador'].id, allow: [PermissionFlagsBits.SendMessages] },
        { id: rm['💠 Dono'].id,          allow: [PermissionFlagsBits.SendMessages] },
      ],
      channels: [
        { name: '📸┃instagram', type: ChannelType.GuildText, topic: 'Siga nosso Instagram!' },
        { name: '📘┃facebook',  type: ChannelType.GuildText, topic: 'Curta nossa página no Facebook!' },
        { name: '💬┃whatsapp',  type: ChannelType.GuildText, topic: 'Entre no grupo do WhatsApp!' },
        { name: '✈️┃telegram',  type: ChannelType.GuildText, topic: 'Acesse nosso canal no Telegram!' },
        { name: '▶️┃youtube',   type: ChannelType.GuildText, topic: 'Inscreva-se no YouTube!' },
        { name: '🎵┃tiktok',    type: ChannelType.GuildText, topic: 'Nos siga no TikTok!' },
      ],
    },

    // ── 4. COMUNIDADE ──────────────────────────────────────────────
    {
      name: '💬 COMUNIDADE',
      permissionOverwrites: [],
      channels: [
        { name: '💬┃chat-geral',       type: ChannelType.GuildText, topic: 'Chat geral da comunidade.' },
        { name: '📸┃imagens-e-videos', type: ChannelType.GuildText, topic: 'Compartilhe capturas do jogo!' },
        { name: '🤖┃comandos-bot',     type: ChannelType.GuildText, topic: 'Use os comandos do bot aqui.' },
        { name: '🎉┃giveaways',        type: ChannelType.GuildText, topic: 'Sorteios e eventos especiais.' },
        { name: '🏆┃rankings',         type: ChannelType.GuildText, topic: 'Rankings do servidor.' },
      ],
    },

    // ── 5. SUPORTE / TICKETS ───────────────────────────────────────
    {
      name: '🛠️ SUPORTE',
      permissionOverwrites: [
        { id: ev, deny: [PermissionFlagsBits.SendMessages] },
        ...staffAllow([PermissionFlagsBits.SendMessages]),
      ],
      channels: [
        { name: '🎫┃abrir-ticket', type: ChannelType.GuildText, topic: 'Abra um ticket de suporte.', key: 'ticketPanel' },
        { name: '📋┃log-tickets',  type: ChannelType.GuildText, topic: 'Log de tickets fechados.', staffOnly: true },
      ],
    },

    // ── 6. ÁREA VIP ────────────────────────────────────────────────
    {
      name: '💎 ÁREA VIP',
      permissionOverwrites: [
        { id: ev, deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['💎 VIP'].id, allow: [PermissionFlagsBits.ViewChannel] },
        ...staffAllow([PermissionFlagsBits.ViewChannel]),
      ],
      channels: [
        { name: '💎┃chat-vip',       type: ChannelType.GuildText, topic: 'Chat exclusivo para VIPs.' },
        { name: '🎁┃beneficios-vip', type: ChannelType.GuildText, topic: 'Benefícios exclusivos VIP.' },
      ],
    },

    // ── 7. STAFF ───────────────────────────────────────────────────
    {
      name: '🔒 STAFF',
      permissionOverwrites: [
        { id: ev, deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['🎮 Player'].id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['💎 VIP'].id,    deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['🆕 Novato'].id, deny: [PermissionFlagsBits.ViewChannel] },
        ...staffAllow([PermissionFlagsBits.ViewChannel]),
      ],
      channels: [
        { name: '📋┃staff-chat',   type: ChannelType.GuildText, topic: 'Chat interno da staff.' },
        { name: '📝┃anotacoes',    type: ChannelType.GuildText, topic: 'Anotações importantes.' },
        { name: '⚠️┃punicoes',     type: ChannelType.GuildText, topic: 'Registro de punições.' },
        { name: '📊┃relatorios',   type: ChannelType.GuildText, topic: 'Relatórios e métricas.' },
        { name: '📣┃staff-avisos', type: ChannelType.GuildText, topic: 'Avisos internos da staff.' },
      ],
    },

    // ── 8. BOSSES (só Dono + GM veem) ─────────────────────────────
    {
      name: '⚔️ BOSSES',
      permissionOverwrites: [
        { id: ev, deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['🆕 Novato'].id,           deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['🎮 Player'].id,            deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['💎 VIP'].id,               deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['🎓 Tutor'].id,             deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['⭐ Sênior Tutor'].id,       deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['🛡️ Community Manager'].id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['🔱 Game Master'].id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { id: rm['👑 Administrador'].id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { id: rm['💠 Dono'].id,         allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      ],
      channels: [
        { name: '📊┃boss-spawns',    type: ChannelType.GuildText, topic: 'Registro de quando os bosses nascem.', key: 'bossSpawns' },
        { name: '💀┃boss-drops',     type: ChannelType.GuildText, topic: 'Itens dropados pelos bosses.' },
        { name: '📜┃boss-historico', type: ChannelType.GuildText, topic: 'Histórico completo dos bosses.' },
      ],
    },

    // ── 9. CANAIS DE VOZ ───────────────────────────────────────────
    {
      name: '🔊 CANAIS DE VOZ',
      permissionOverwrites: [],
      channels: [
        { name: '🔊 Geral 1', type: ChannelType.GuildVoice },
        { name: '🔊 Geral 2', type: ChannelType.GuildVoice },
        { name: '🎮 Jogando',  type: ChannelType.GuildVoice },
        { name: '🤫 AFK',      type: ChannelType.GuildVoice },
        {
          name: '🔊 Staff Voice',
          type: ChannelType.GuildVoice,
          extraOverwrites: [
            { id: ev, deny: [PermissionFlagsBits.ViewChannel] },
            ...(['🎓 Tutor', '⭐ Sênior Tutor', '🛡️ Community Manager',
                 '🔱 Game Master', '👑 Administrador', '💠 Dono'
            ].map((n) => ({ id: rm[n].id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect] }))),
          ],
        },
      ],
    },
  ];
};

// ─────────────────────────────────────────────
//  UTILITÁRIOS
// ─────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─────────────────────────────────────────────
//  CRIAR CARGOS
// ─────────────────────────────────────────────
async function criarCargos(guild) {
  const mapa = {};
  console.log('\n🎭 Criando cargos...');
  await guild.roles.fetch();

  for (const def of ROLES) {
    let role = guild.roles.cache.find((r) => r.name === def.name);
    if (role) {
      mapa[def.name] = role;
      console.log(`  ⏭️  Já existe: ${def.name}`);
    } else {
      role = await guild.roles.create({
        name:        def.name,
        colors:      def.colors,
        hoist:       def.hoist,
        mentionable: def.mentionable,
        permissions: def.permissions,
        reason:      'NosleiraOT Setup v2',
      });
      mapa[def.name] = role;
      console.log(`  ✅ Criado: ${def.name}`);
      await sleep(400);
    }
  }
  return mapa;
}

// ─────────────────────────────────────────────
//  CRIAR ESTRUTURA
// ─────────────────────────────────────────────
async function criarEstrutura(guild, roleMap) {
  console.log('\n📂 Criando categorias e canais...');
  const ev        = guild.roles.everyone.id;
  const structure = buildStructure(roleMap, ev);
  const especiais = {};

  for (const cat of structure) {
    const categoria = await guild.channels.create({
      name:                 cat.name,
      type:                 ChannelType.GuildCategory,
      permissionOverwrites: cat.permissionOverwrites || [],
      reason:               'NosleiraOT Setup v2',
    });
    console.log(`\n  📁 ${cat.name}`);
    await sleep(400);

    for (const ch of cat.channels) {
      const overwrites = ch.extraOverwrites || cat.permissionOverwrites || [];
      const canal = await guild.channels.create({
        name:                 ch.name,
        type:                 ch.type,
        topic:                ch.topic || undefined,
        parent:               categoria.id,
        permissionOverwrites: overwrites,
        reason:               'NosleiraOT Setup v2',
      });
      if (ch.key) especiais[ch.key] = canal;
      console.log(`    ✅ ${ch.name}`);
      await sleep(350);
    }
  }
  return especiais;
}

// ═══════════════════════════════════════════════════════════════════
//  EMBEDS — cada canal recebe seu conteúdo inicial
// ═══════════════════════════════════════════════════════════════════

async function enviarComoVerificar(canal) {
  const embed = new EmbedBuilder()
    .setColor('#3498DB')
    .setTitle('🔐  Como Verificar sua Conta')
    .setDescription(
      '**Bem-vindo ao NosleiraOT!**\n\n' +
      'Para ter acesso completo ao servidor, você precisa passar pela verificação rápida.\n\n' +
      '**Vá até o canal <#' + canal.id + '> e responda 2 perguntinhas:**\n' +
      '> 1️⃣  Você tem 18 anos ou mais?\n' +
      '> 2️⃣  Qual vocação você joga no Tibia?\n\n' +
      '*Após responder, você receberá o cargo de Player e terá acesso total!*'
    )
    .setFooter({ text: 'NosleiraOT • Verificação Automática' });
  await canal.send({ embeds: [embed] });
}

async function enviarPainelVerificacao(canal) {
  const embed = new EmbedBuilder()
    .setColor('#3498DB')
    .setTitle('🔐  Verificação de Entrada')
    .setDescription(
      '**Olá, aventureiro!** Bem-vindo ao **NosleiraOT**! 🎮\n\n' +
      'Antes de acessar o servidor, precisamos de algumas informações rápidas.\n\n' +
      '**Clique no botão abaixo para iniciar:**'
    )
    .setFooter({ text: 'NosleiraOT • Verificação Automática' })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('start_verification')
      .setLabel('▶️  Iniciar Verificação')
      .setStyle(ButtonStyle.Primary),
  );
  await canal.send({ embeds: [embed], components: [row] });
  console.log('  🔐 Painel de verificação enviado!');
}

async function enviarRegras(canal) {
  const embed = new EmbedBuilder()
    .setColor('#E74C3C')
    .setTitle('📜  Regras do NosleiraOT')
    .setDescription('**Leia com atenção. O desrespeito às regras acarreta punição imediata.**\n\u200B')
    .addFields(
      {
        name: '1️⃣  Respeito mútuo',
        value: 'Trate todos com respeito. Ofensas, xingamentos, bullying e discriminação de qualquer tipo resultarão em **banimento permanente**.',
        inline: false,
      },
      {
        name: '2️⃣  Spam e flood',
        value: 'Proibido enviar mensagens repetidas, letras aleatórias ou emojis em excesso. Use os canais para seus propósitos.',
        inline: false,
      },
      {
        name: '3️⃣  Propaganda',
        value: 'É estritamente proibido divulgar outros servidores de Tibia, Discord ou qualquer produto sem autorização da **staff**.',
        inline: false,
      },
      {
        name: '4️⃣  Conteúdo impróprio',
        value: 'Conteúdo adulto, ilegal, violento ou ofensivo será removido e o responsável **banido imediatamente**.',
        inline: false,
      },
      {
        name: '5️⃣  Obediência à Staff',
        value: 'Siga as orientações da equipe. Reclamações e recursos devem ser feitos via **ticket** — nunca em chat público.',
        inline: false,
      },
      {
        name: '6️⃣  Trapaça e exploits',
        value: 'Uso de bots, hacks, exploits ou qualquer vantagem indevida no jogo resulta em **banimento permanente** sem aviso.',
        inline: false,
      },
      {
        name: '7️⃣  Impersonação',
        value: 'Proibido se passar por membros da staff ou personagens do jogo para enganar outros jogadores.',
        inline: false,
      },
      {
        name: '8️⃣  Links e arquivos',
        value: 'Não envie links suspeitos, executáveis ou qualquer arquivo que possa ser malicioso.',
        inline: false,
      },
    )
    .setFooter({ text: 'Ao permanecer no servidor, você concorda com todas as regras acima. • NosleiraOT' })
    .setTimestamp();

  await canal.send({ embeds: [embed] });
  console.log('  📜 Regras enviadas!');
}

async function enviarAvisos(canal) {
  const embed = new EmbedBuilder()
    .setColor('#F39C12')
    .setTitle('📢  Central de Avisos — NosleiraOT')
    .setDescription(
      '**Este canal é reservado para avisos oficiais do servidor.**\n\n' +
      '> 🌐  Acompanhe também os avisos em: **[nosleira.com.br](' + SITE_URL + ')**\n\n' +
      '⚙️  *Integração automática com o site em breve — os avisos do site serão publicados aqui automaticamente.*'
    )
    .setFooter({ text: 'NosleiraOT • Canal Oficial de Avisos' })
    .setTimestamp();
  await canal.send({ embeds: [embed] });
  console.log('  📢 Embed de avisos enviado!');
}

async function enviarPainelTicket(canal) {
  const embed = new EmbedBuilder()
    .setColor('#E67E22')
    .setTitle('🎫  Suporte NosleiraOT')
    .setDescription(
      '**Precisa de ajuda? Abra um ticket!**\n\n' +
      '> 🔹 Dúvidas sobre o jogo\n' +
      '> 🔹 Reportar bugs ou problemas\n' +
      '> 🔹 Suporte de conta\n' +
      '> 🔹 Denúncias\n' +
      '> 🔹 Outros assuntos\n\n' +
      '**Clique no botão abaixo para abrir um ticket.**\n' +
      '*Tempo médio de resposta: até 24 horas.*'
    )
    .setFooter({ text: 'NosleiraOT • Suporte Oficial' })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('create_ticket')
      .setLabel('🎫  Abrir Ticket')
      .setStyle(ButtonStyle.Primary),
  );
  await canal.send({ embeds: [embed], components: [row] });
  console.log('  🎫 Painel de ticket enviado!');
}

async function enviarBossSpawns(canal) {
  const embed = new EmbedBuilder()
    .setColor('#8E44AD')
    .setTitle('⚔️  Monitor de Bosses — NosleiraOT')
    .setDescription(
      '**Registro automático de bosses.**\n\n' +
      '> Use o comando `!boss spawn <nome>` para registrar um spawn.\n' +
      '> Use `!boss drop <nome> <item> <jogador>` para registrar um drop.\n\n' +
      '🔗 *Integração direta com o servidor de jogo em desenvolvimento.*'
    )
    .setFooter({ text: 'NosleiraOT • Sistema de Bosses' })
    .setTimestamp();
  await canal.send({ embeds: [embed] });
  console.log('  ⚔️ Embed de bosses enviado!');
}

// ─────────────────────────────────────────────
//  EVENTO PRINCIPAL
// ─────────────────────────────────────────────
client.once(Events.ClientReady, async () => {
  console.log(`\n🤖 Bot: ${client.user.tag}`);
  console.log('⚙️  Iniciando setup NosleiraOT v2...\n');

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) { console.error('❌ Servidor não encontrado!'); process.exit(1); }

  await guild.roles.fetch();
  await guild.channels.fetch();

  try {
    const roleMap  = await criarCargos(guild);
    const especiais = await criarEstrutura(guild, roleMap);

    console.log('\n📨 Enviando conteúdo inicial...');
    if (especiais.comoVerificar) await enviarComoVerificar(especiais.comoVerificar);
    if (especiais.verificacao)   await enviarPainelVerificacao(especiais.verificacao);
    if (especiais.regras)        await enviarRegras(especiais.regras);
    if (especiais.avisos)        await enviarAvisos(especiais.avisos);
    if (especiais.ticketPanel)   await enviarPainelTicket(especiais.ticketPanel);
    if (especiais.bossSpawns)    await enviarBossSpawns(especiais.bossSpawns);

    console.log('\n════════════════════════════════════════════════');
    console.log('🎉  Setup v2 concluído com sucesso!');
    console.log('▶️   Próximo passo: node bot.js');
    console.log('════════════════════════════════════════════════\n');
  } catch (err) {
    console.error('\n❌ Erro:', err);
  }

  client.destroy();
});

client.login(TOKEN);
