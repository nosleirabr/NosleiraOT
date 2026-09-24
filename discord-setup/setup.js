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
require('dotenv').config();

const TOKEN    = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;

// URL do site (para integração futura com avisos)
const SITE_URL  = 'https://www.nosleiraot.com'; // ajuste conforme necessário
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
    name: '<:admin:298566> VIP',
    colors: '#9B59B6',
    hoist: true, mentionable: true,
    permissions: [
      PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.Connect,
      PermissionFlagsBits.Speak, PermissionFlagsBits.AddReactions,
    ],
  },
  {
    name: '🔴 Ao Vivo',
    colors: '#FF0000',
    hoist: true, mentionable: false,
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

    // ── 1. MEMBER COUNT (topo absoluto) ──────────────────────────────
    {
      name: '𝗠𝗘𝗠𝗕𝗘𝗥 𝗖𝗢𝗨𝗡𝗧',
      permissionOverwrites: [
        { id: ev, deny: [PermissionFlagsBits.Connect], allow: [PermissionFlagsBits.ViewChannel] },
        ...staffAllow([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect]),
      ],
      channels: [
        { name: '【👥】𝗠𝗲𝗺𝗯𝗿𝗼𝘀-🟢［0］-🔴［0］', type: ChannelType.GuildText, topic: 'Contador de membros em tempo real - verdes = online, vermelhos = offline' },
      ],
    },

    // ── 2. INFORMAÇÕES ─────────────────────────────────────────────
    {
      name: '𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦',
      permissionOverwrites: [
        { id: ev, deny: [PermissionFlagsBits.SendMessages] },
        ...staffAllow([PermissionFlagsBits.SendMessages]),
      ],
      channels: [
        { name: '[ 📣 ] 𝐂𝐨𝐦𝐮𝐧𝐢𝐜𝐚𝐝𝐨𝐬',  type: ChannelType.GuildText, topic: 'Comunicados oficiais.', key: 'avisos' },
        { name: '[ ✍🏻 ] 𝐀𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐜𝐨𝐞𝐬', type: ChannelType.GuildText, topic: 'Atualizações oficiais.' },
        { name: '[ 🔱 ] 𝐋𝐢𝐧𝐤𝐬',        type: ChannelType.GuildText, topic: 'Links do servidor.' },
      ],
    },

    // ── 3. SUPORTE ─────────────────────────────────────────────────
    {
      name: '𝗦𝗨𝗣𝗢𝗥𝗧𝗘',
      permissionOverwrites: [
        { id: ev, deny: [PermissionFlagsBits.SendMessages] },
        ...staffAllow([PermissionFlagsBits.SendMessages]),
      ],
      channels: [
        { name: '[ 🔴 ] 𝐓𝐢𝐜𝐤𝐞𝐭-𝐁𝐑',   type: ChannelType.GuildText, topic: 'Abra um ticket de suporte.', key: 'ticketPanel' },
        { name: '[ 🚫 ] 𝐑𝐞𝐠𝐫𝐚𝐬',      type: ChannelType.GuildText, topic: 'Regras do NosleiraOT.', key: 'regras' },
        { name: '[ 📋 ] 𝐋𝐨𝐠-𝐓𝐢𝐜𝐤𝐞𝐭𝐬', type: ChannelType.GuildText, topic: 'Log de tickets (staff).', staffOnly: true },
        { name: '【🔒】𝗟𝗼𝗴-𝗦𝗲𝗴𝘂𝗿𝗮𝗻𝗰𝗮', type: ChannelType.GuildText, topic: 'Log de segurança e automod.', staffOnly: true },
        {
          name: '🔊 | 𝐒𝐭𝐚𝐟𝐟 𝐕𝐨𝐢𝐜𝐞',
          type: ChannelType.GuildVoice,
          extraOverwrites: [
            { id: ev, deny: [PermissionFlagsBits.ViewChannel] },
            ...(['🎓 Tutor', '⭐ Sênior Tutor', '🛡️ Community Manager',
                 '🔱 Game Master', '👑 Administrador', '💠 Dono'
            ].map((n) => ({ id: rm[n].id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak] }))),
          ],
        },
],
    },

    // ── 4. TICKETS ATIVOS (categoria oculta para tickets abertos) ─────────
  {
    name: '𝗧𝗜𝗖𝗞𝗘𝗧𝗦 𝗔𝗧𝗜𝗩𝗢𝗦',
    permissionOverwrites: [
      { id: ev, deny: [PermissionFlagsBits.ViewChannel] },
      ...staffAllow([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]),
    ],
    channels: [],
  },

  // ── 5. ADVERTISING ─────────────────────────────────────────────
    {
      name: '𝗔𝗗𝗩𝗘𝗥𝗧𝗜𝗦𝗜𝗡𝗚',
      permissionOverwrites: [
        { id: ev, deny: [PermissionFlagsBits.SendMessages] },
        ...staffAllow([PermissionFlagsBits.SendMessages]),
      ],
      channels: [
        { name: '[ 🎥 ] 𝐒𝐭𝐫𝐞𝐚𝐦𝐞𝐫𝐬',   type: ChannelType.GuildText, topic: 'Alertas automáticos de live.' },
        { name: '[ 📷 ] 𝐒𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭𝐬', type: ChannelType.GuildText, topic: 'Screenshots do jogo!' },
        { name: '[ 📺 ] 𝐂𝐥𝐢𝐩𝐬',       type: ChannelType.GuildText, topic: 'Clips da comunidade!' },
      ],
},

    // ── 6. CANAIS DE VOZ ───────────────────────────────────────────
    {
      name: '𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭',
      permissionOverwrites: [],
      channels: [
        { name: '[ 🔊 ] 𝐆𝐞𝐫𝐚𝐥 𝟏', type: ChannelType.GuildVoice },
        { name: '[ 🔊 ] 𝐆𝐞𝐫𝐚𝐥 𝟐', type: ChannelType.GuildVoice },
        { name: '[ 🎮 ] 𝐉𝐨𝐠𝐚𝐧𝐝𝐨', type: ChannelType.GuildVoice },
        { name: '[ 🐲 ] 𝐁𝐨𝐬𝐬',    type: ChannelType.GuildVoice },
        { name: '[ 💤 ] 𝐀𝐅𝐊',     type: ChannelType.GuildVoice },
      ],
    },

    // ── 7. COMANDOS ───────────────────────────────────────────────────
    {
      name: '𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦',
      permissionOverwrites: [
        { id: ev, deny: [PermissionFlagsBits.SendMessages] },
        ...staffAllow([PermissionFlagsBits.SendMessages]),
      ],
      channels: [
        { name: '[ 🤖 ] 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬-𝐆𝐞𝐫𝐚𝐥', type: ChannelType.GuildText, topic: 'Como aparecer ao vivo.' },
      ],
    },

  // ── 8. BOSSES (só Dono + GM veem) ─────────────────────────────
    {
      name: '⚔️ BOSSES',
      permissionOverwrites: [
        { id: ev, deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['🆕 Novato'].id,           deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['🎮 Player'].id,            deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['<:admin:298566> VIP'].id,               deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['🎓 Tutor'].id,             deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['⭐ Sênior Tutor'].id,       deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['🛡️ Community Manager'].id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: rm['🔱 Game Master'].id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { id: rm['👑 Administrador'].id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { id: rm['💠 Dono'].id,         allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      ],
      channels: [
        { name: '[ 📊 ] boss-spawns',    type: ChannelType.GuildText, topic: 'Registro de quando os bosses nascem.', key: 'bossSpawns' },
        { name: '[ 💀 ] boss-drops',     type: ChannelType.GuildText, topic: 'Itens dropados pelos bosses.' },
        { name: '[ 📜 ] boss-historico', type: ChannelType.GuildText, topic: 'Histórico completo dos bosses.' },
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
        color:       def.colors,
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
          '> 👑 **Falar com o Dono** — Assuntos sigilosos e exclusivos diretamente com a Direção.',
          '> 🎁 **Itens & Donate** — Suporte para entrega ou dúvidas sobre itens adquiridos.',
          '> 💳 **Financeiro & Pagamento** — Confirmações de PIX, doações e transações.',
          '> 🐛 **Bug no Jogo** — Falhas técnicas, bugs de mapa, magias ou monstros.',
          '> 🚨 **Denúncias** — Reporte de trapaças, ofensas ou violações de regras.',
          '> 👤 **Problemas com Conta** — Acesso, bloqueios e dados cadastrais.',
          '> 🔑 **Recover Key** — Recuperação ou solicitação de chave de recuperação.',
          '> 🔓 **Remover 2FA** — Desativação de autenticação de dois fatores.',
          '> ❓ **Dúvidas Gerais** — Informações sobre gameplay, rates e sistemas.',
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
      '> 🌐  Acompanhe também os avisos em: **[www.nosleiraot.com](' + SITE_URL + ')**\n\n' +
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
    .setThumbnail('https://img.icons8.com/color/96/scales.png')
    .setImage('https://img.icons8.com/color/480/scales.png')
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
