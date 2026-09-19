/**
 * Discord Server Setup Bot
 * Monta automaticamente toda a estrutura do servidor:
 * categorias, canais, cargos e permissões.
 *
 * Como usar:
 * 1. npm install discord.js
 * 2. Coloque o token do bot e o ID do servidor abaixo
 * 3. node setup.js
 */

const { Client, GatewayIntentBits, PermissionFlagsBits, ChannelType } = require('discord.js');

// ─────────────────────────────────────────────
//  CONFIGURAÇÃO — preencha aqui
// ─────────────────────────────────────────────
const TOKEN    = 'SEU_TOKEN_AQUI';   // Token do bot
const GUILD_ID = 'ID_DO_SERVIDOR';   // ID do servidor Discord
// ─────────────────────────────────────────────

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// ─────────────────────────────────────────────
//  DEFINIÇÃO DOS CARGOS
// ─────────────────────────────────────────────
const ROLES = [
  // Staff interna (mais alto → mais baixo)
  { name: '👑 Game Master',    color: '#FF0000', hoist: true, permissions: [PermissionFlagsBits.Administrator] },
  { name: '🛡️ Community Manager', color: '#FF6600', hoist: true, permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.MuteMembers] },
  { name: '⭐ Sênior Tutor',   color: '#FFAA00', hoist: true, permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.KickMembers, PermissionFlagsBits.MuteMembers] },
  { name: '🎓 Tutor',          color: '#FFD700', hoist: true, permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.MuteMembers] },

  // Jogadores
  { name: '💎 VIP',            color: '#9B59B6', hoist: true, permissions: [] },
  { name: '🎮 Player',         color: '#3498DB', hoist: true, permissions: [] },

  // Utilidade
  { name: '🤖 Bots',          color: '#95A5A6', hoist: false, permissions: [] },
];

// ─────────────────────────────────────────────
//  ESTRUTURA DE CATEGORIAS E CANAIS
//  allow/deny aplicados por cargo (key = nome do cargo)
// ─────────────────────────────────────────────
const STRUCTURE = [

  // ── INFORMAÇÕES ──────────────────────────────
  {
    name: '📌 INFORMAÇÕES',
    channels: [
      { name: '📜┃regras',           type: ChannelType.GuildText },
      { name: '📢┃avisos',           type: ChannelType.GuildText },
      { name: '🌐┃links-oficiais',   type: ChannelType.GuildText },
      { name: '🗓️┃eventos',          type: ChannelType.GuildText },
    ],
    // Apenas leitura para todos; staff pode escrever
    permissions: {
      everyone:  { deny: [PermissionFlagsBits.SendMessages] },
      '🎮 Player': { deny: [PermissionFlagsBits.SendMessages] },
      '🎓 Tutor':  { allow: [PermissionFlagsBits.SendMessages] },
    },
  },

  // ── REDES SOCIAIS ────────────────────────────
  {
    name: '🌐 REDES SOCIAIS',
    channels: [
      { name: '📸┃instagram',    type: ChannelType.GuildText, topic: 'Siga nosso Instagram e acompanhe as novidades!' },
      { name: '📘┃facebook',     type: ChannelType.GuildText, topic: 'Curta nossa página no Facebook!' },
      { name: '💬┃whatsapp',     type: ChannelType.GuildText, topic: 'Entre no nosso grupo do WhatsApp!' },
      { name: '✈️┃telegram',     type: ChannelType.GuildText, topic: 'Acesse nosso canal no Telegram!' },
      { name: '▶️┃youtube',      type: ChannelType.GuildText, topic: 'Inscreva-se no nosso canal do YouTube!' },
      { name: '🎵┃tiktok',       type: ChannelType.GuildText, topic: 'Nos siga no TikTok!' },
    ],
    // Somente leitura para todos; staff pode postar links
    permissions: {
      everyone:  { deny: [PermissionFlagsBits.SendMessages] },
      '🎓 Tutor': { allow: [PermissionFlagsBits.SendMessages] },
    },
  },

  // ── COMUNIDADE ───────────────────────────────
  {
    name: '💬 COMUNIDADE',
    channels: [
      { name: '💬┃chat-geral',      type: ChannelType.GuildText },
      { name: '📸┃imagens-e-videos', type: ChannelType.GuildText },
      { name: '🤖┃comandos-bot',    type: ChannelType.GuildText },
      { name: '🎉┃giveaways',       type: ChannelType.GuildText },
    ],
  },

  // ── SUPORTE ──────────────────────────────────
  {
    name: '🛠️ SUPORTE',
    channels: [
      { name: '🎫┃abrir-ticket',    type: ChannelType.GuildText },
      { name: '🐛┃reportar-bugs',   type: ChannelType.GuildText },
      { name: '❓┃duvidas',         type: ChannelType.GuildText },
    ],
  },

  // ── ÁREA VIP ─────────────────────────────────
  {
    name: '💎 ÁREA VIP',
    channels: [
      { name: '💎┃chat-vip',        type: ChannelType.GuildText },
      { name: '🎁┃beneficios-vip',  type: ChannelType.GuildText },
    ],
    // Visível só para VIP e staff
    permissions: {
      everyone:    { deny: [PermissionFlagsBits.ViewChannel] },
      '💎 VIP':    { allow: [PermissionFlagsBits.ViewChannel] },
      '🎓 Tutor':  { allow: [PermissionFlagsBits.ViewChannel] },
    },
  },

  // ── STAFF ────────────────────────────────────
  {
    name: '🔒 STAFF',
    channels: [
      { name: '📋┃staff-chat',       type: ChannelType.GuildText },
      { name: '📝┃anotacoes',        type: ChannelType.GuildText },
      { name: '⚠️┃punicoes',         type: ChannelType.GuildText },
      { name: '📊┃relatorios',       type: ChannelType.GuildText },
      { name: '🔊┃voz-staff',        type: ChannelType.GuildVoice },
    ],
    // Visível APENAS para staff (Tutor para cima)
    permissions: {
      everyone:         { deny: [PermissionFlagsBits.ViewChannel] },
      '🎮 Player':      { deny: [PermissionFlagsBits.ViewChannel] },
      '💎 VIP':         { deny: [PermissionFlagsBits.ViewChannel] },
      '🎓 Tutor':       { allow: [PermissionFlagsBits.ViewChannel] },
    },
  },

  // ── CANAIS DE VOZ ────────────────────────────
  {
    name: '🔊 CANAIS DE VOZ',
    channels: [
      { name: '🔊 Bate-Papo 1',   type: ChannelType.GuildVoice },
      { name: '🔊 Bate-Papo 2',   type: ChannelType.GuildVoice },
      { name: '🎮 Jogando',        type: ChannelType.GuildVoice },
      { name: '🤫 AFK',            type: ChannelType.GuildVoice },
    ],
  },
];

// ─────────────────────────────────────────────
//  FUNÇÕES AUXILIARES
// ─────────────────────────────────────────────

/** Aguarda N milissegundos (evita rate-limit da API) */
const sleep = (ms) => new Promise(res => setTimeout(res, ms));

/** Cria todos os cargos e devolve um mapa nome→role */
async function criarCargos(guild) {
  const mapa = {};
  console.log('\n🎭 Criando cargos...');

  for (const def of ROLES) {
    // Evita duplicar se já existir
    const existe = guild.roles.cache.find(r => r.name === def.name);
    if (existe) {
      mapa[def.name] = existe;
      console.log(`  ⏭️  Cargo já existe: ${def.name}`);
      continue;
    }

    const role = await guild.roles.create({
      name:        def.name,
      color:       def.color,
      hoist:       def.hoist,
      permissions: def.permissions,
      reason:      'Setup automático',
    });
    mapa[def.name] = role;
    console.log(`  ✅ Cargo criado: ${def.name}`);
    await sleep(300);
  }
  return mapa;
}

/** Resolve overwrites de permissão para uma categoria/canal */
function resolverPermissoes(guild, permsDef, roleMap) {
  if (!permsDef) return [];

  return Object.entries(permsDef).map(([key, val]) => {
    const id = key === 'everyone'
      ? guild.roles.everyone.id
      : roleMap[key]?.id;

    if (!id) return null;
    return { id, allow: val.allow || [], deny: val.deny || [] };
  }).filter(Boolean);
}

/** Cria a estrutura de categorias + canais */
async function criarEstrutura(guild, roleMap) {
  console.log('\n📂 Criando categorias e canais...');

  for (const cat of STRUCTURE) {
    const permOverwrites = resolverPermissoes(guild, cat.permissions, roleMap);

    // Cria categoria
    const categoria = await guild.channels.create({
      name:                 cat.name,
      type:                 ChannelType.GuildCategory,
      permissionOverwrites: permOverwrites,
      reason:               'Setup automático',
    });
    console.log(`\n  📁 Categoria: ${cat.name}`);
    await sleep(400);

    // Cria canais dentro da categoria
    for (const ch of cat.channels) {
      await guild.channels.create({
        name:   ch.name,
        type:   ch.type,
        topic:  ch.topic || undefined,
        parent: categoria.id,
        // Herda permissões da categoria (sync)
        reason: 'Setup automático',
      });
      console.log(`    ✅ Canal: ${ch.name}`);
      await sleep(300);
    }
  }
}

// ─────────────────────────────────────────────
//  EVENTO PRINCIPAL
// ─────────────────────────────────────────────
client.once('ready', async () => {
  console.log(`\n🤖 Bot conectado como ${client.user.tag}`);
  console.log('⚙️  Iniciando setup do servidor...\n');

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) {
    console.error('❌ Servidor não encontrado! Verifique o GUILD_ID.');
    process.exit(1);
  }

  // Garante que o cache de cargos está completo
  await guild.roles.fetch();
  await guild.channels.fetch();

  try {
    const roleMap = await criarCargos(guild);
    await criarEstrutura(guild, roleMap);

    console.log('\n🎉 Setup concluído com sucesso!');
    console.log('   Todos os cargos, categorias e canais foram criados.');
  } catch (err) {
    console.error('\n❌ Erro durante o setup:', err);
  }

  client.destroy();
});

client.login(TOKEN);
