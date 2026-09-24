/**
 * ═══════════════════════════════════════════════════════════════════
 *   NosleiraOT — Bot Principal  v5.0 (Resiliente e 100% Funcional)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  FUNCIONALIDADES:
 *   ✅ Sistema de Tickets Anti-Timeout (Instant Defer + 9 Categorias)
 *   ✅ Sistema de Anúncio de Promoção/Up de Cargos em #ranks
 *   ✅ Comandos de Mídia (!stream, !live, !screenshot, !print, !clip)
 *   ✅ Sistema de Gamificação (10 Níveis de Atividade por Voz + Chat)
 *   ✅ Detecção Automática de Streamers via Presence
 *   ✅ Monitor de Bosses (!boss spawn / drop)
 *   ✅ Auto-Moderação (Palavras adultas, links de apostas e phishing)
 *   ✅ AFK Auto-Mute no canal de voz 💤
 *   ✅ Contador de Membros com cadeadinho em canal de voz 🔒
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
  StringSelectMenuBuilder,
  AttachmentBuilder,
} = require('discord.js');

const fs   = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// ─────────────────────────────────────────────
//  CONFIGURAÇÃO
// ─────────────────────────────────────────────
const TOKEN    = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const SITE_URL = 'https://www.nosleiraot.com';
const PREFIX   = '!';

// Cargos de staff que NÃO são anunciados no up de ranks e que administram tickets
const CARGOS_STAFF = [
  '💠 Dono',
  '👑 Administrador',
  '🔱 Game Master',
  '🛡️ Community Manager',
  '⭐ Sênior Tutor',
  '🎓 Tutor',
];

const VOCACOES = {
  vocation_ek: { nome: '⚔️ Knight | EK', label: 'Elite Knight (EK)', emoji: '⚔️', cor: '#E74C3C' },
  vocation_rp: { nome: '🏹 Paladin | RP', label: 'Royal Paladin (RP)', emoji: '🏹', cor: '#27AE60' },
  vocation_ms: { nome: '🔮 Sorcerer | MS', label: 'Master Sorcerer (MS)', emoji: '🔮', cor: '#8E44AD' },
  vocation_ed: { nome: '🌿 Druid | ED', label: 'Elder Druid (ED)', emoji: '🌿', cor: '#16A085' },
};

const CATEGORIAS_TICKET = {
  ticket_cat_dono: {
    prioridade: '🟠 Prioridade 1 • Direção',
    pNum: 1,
    tag: 'Dono',
    dot: '🟠',
    emoji: '👑',
    nome: 'Falar com o Dono',
    cor: '#E67E22',
    donoOnly: true,
    campos: [
      'Nome do Personagem (Char):',
      'Motivo do Contato Direto:',
      'Detalhes / Provas:',
    ],
  },
  ticket_cat_bug: {
    prioridade: '🔴 Prioridade 2 • Crítico',
    pNum: 2,
    tag: 'Bug',
    dot: '🔴',
    emoji: '🐛',
    nome: 'Bug no Jogo',
    cor: '#E74C3C',
    campos: [
      'Nome do Personagem:',
      'Local / Coordenadas / Magia do Bug:',
      'Descrição detalhada do Bug:',
      'Como reproduzir o erro:',
    ],
  },
  ticket_cat_denuncia: {
    prioridade: '🔴 Prioridade 3 • Alta',
    pNum: 3,
    tag: 'Denuncia',
    dot: '🔴',
    emoji: '🚨',
    nome: 'Denúncia de Jogador',
    cor: '#E74C3C',
    campos: [
      'Seu Personagem:',
      'Nome do Jogador Denunciado:',
      'Motivo da Denúncia (Cheat, Ofensa, etc):',
      'Links ou Anexos de Provas:',
    ],
  },
  ticket_cat_pagamento: {
    prioridade: '🟡 Prioridade 4 • Financeiro',
    pNum: 4,
    tag: 'Pagamento',
    dot: '🟡',
    emoji: '💳',
    nome: 'Financeiro & Pagamento',
    cor: '#F1C40F',
    campos: [
      'Conta / Email / Chave PIX:',
      'Data e Horário do Pagamento:',
      'ID da Transação / Comprovante:',
      'Problema Ocorrido:',
    ],
  },
  ticket_cat_item: {
    prioridade: '🟡 Prioridade 5 • Entrega',
    pNum: 5,
    tag: 'Donate',
    dot: '🟡',
    emoji: '🎁',
    nome: 'Item de Donate',
    cor: '#F1C40F',
    campos: [
      'Nome do Personagem:',
      'Item / Pacote Adquirido:',
      'Código do Pedido ou Transação:',
      'Descrição do Problema na Entrega:',
    ],
  },
  ticket_cat_conta: {
    prioridade: '🟢 Prioridade 6 • Conta',
    pNum: 6,
    tag: 'Conta',
    dot: '🟢',
    emoji: '👤',
    nome: 'Problema com Conta',
    cor: '#2ECC71',
    campos: [
      'Número da Conta / Login:',
      'Email Cadastrado:',
      'Personagem Principal:',
      'Descrição do Problema:',
    ],
  },
  ticket_cat_recover: {
    prioridade: '🟢 Prioridade 7 • Cadastral',
    pNum: 7,
    tag: 'Recover',
    dot: '🟢',
    emoji: '🔑',
    nome: 'Recover Key',
    cor: '#2ECC71',
    campos: [
      'Número da Conta:',
      'Email da Conta:',
      'Personagem:',
      'Motivo da Solicitação de Recover Key:',
    ],
  },
  ticket_cat_2f: {
    prioridade: '🟢 Prioridade 8 • Segurança',
    pNum: 8,
    tag: '2FA',
    dot: '🟢',
    emoji: '🔓',
    nome: 'Remover 2FA',
    cor: '#2ECC71',
    campos: [
      'Número da Conta:',
      'Email de Cadastro:',
      'Personagem:',
      'Motivo da Remoção do 2FA:',
    ],
  },
  ticket_cat_duvida: {
    prioridade: '🔵 Prioridade 9 • Geral',
    pNum: 9,
    tag: 'Duvida',
    dot: '🔵',
    emoji: '❓',
    nome: 'Dúvidas Gerais',
    cor: '#3498DB',
    campos: [
      'Seu Personagem / Dúvida:',
      'Área da Dúvida (Gameplay, Quests, Site):',
      'Descreva sua Dúvida:',
    ],
  },
};

const CARGOS_IGNORAR_RANK = [
  ...CARGOS_STAFF,
  '🤖 Bots',
  '🎮 Player',
  '🆕 Novato',
  '✅ 18+',
  '🔞 -18',
  '🔴 Ao Vivo',
  '⚔️ Knight | EK',
  '🏹 Paladin | RP',
  '🔮 Sorcerer | MS',
  '🌿 Druid | ED',
  '🔀 Movedor',
  'Emoji.gg Bot',
  'NosleiraOT-BOT',
  '@everyone',
];

// ─────────────────────────────────────────────
//  PERSISTÊNCIA (JSON)
// ─────────────────────────────────────────────
const DATA_DIR       = path.join(__dirname, 'data');
const ASSETS_DIR     = path.join(__dirname, 'assets');
const BANNER_PATH    = path.join(ASSETS_DIR, 'welcome_banner.jpg');
const PUNICOES_FILE   = path.join(DATA_DIR, 'punicoes.json');
const ATIVIDADE_FILE  = path.join(DATA_DIR, 'atividade.json');
const VOCATION_FILE   = path.join(DATA_DIR, 'vocation_cooldowns.json');
const RANK_CD_FILE    = path.join(DATA_DIR, 'rank_cooldowns.json');
const TICKET_CD_FILE  = path.join(DATA_DIR, 'ticket_cooldowns.json');
const STREAM_CD_FILE  = path.join(DATA_DIR, 'stream_cooldowns.json');
const TICKETS_HIST_FILE = path.join(DATA_DIR, 'tickets_historico.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

function carregarJSON(filepath) {
  try {
    if (fs.existsSync(filepath)) return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (e) {
    console.error(`[JSON] Erro ao carregar ${filepath}:`, e.message);
  }
  return {};
}

function salvarJSON(filepath, data) {
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error(`[JSON] Erro ao salvar ${filepath}:`, e.message);
  }
}

let punicoes          = carregarJSON(PUNICOES_FILE);
let atividade         = carregarJSON(ATIVIDADE_FILE);
let vocationCooldowns = carregarJSON(VOCATION_FILE);
let rankCooldowns     = carregarJSON(RANK_CD_FILE);
let ticketCooldowns   = carregarJSON(TICKET_CD_FILE);
let streamCooldowns   = carregarJSON(STREAM_CD_FILE);
let ticketsHistorico  = carregarJSON(TICKETS_HIST_FILE);
let atividadeDirty    = false;
const spamTimestamps  = new Map();

// ─────────────────────────────────────────────
//  SISTEMA DE NÍVEIS POR ATIVIDADE
// ─────────────────────────────────────────────
const NIVEIS = [
  { h: 100,  nome: 'Recruta de Rookgaard',  emoji: '◆ 01 ·', cor: '#7F8C8D' },
  { h: 200,  nome: 'Aventureiro de Thais',  emoji: '◆ 02 ·', cor: '#2ECC71' },
  { h: 400,  nome: 'Guardião de Carlin',    emoji: '◆ 03 ·', cor: '#3498DB' },
  { h: 700,  nome: 'Caçador de Venore',     emoji: '◆ 04 ·', cor: '#16A085' },
  { h: 1000, nome: 'Mago de Edron',         emoji: '◆ 05 ·', cor: '#9B59B6' },
  { h: 1300, nome: 'Lorde de Darashia',     emoji: '◆ 06 ·', cor: '#E67E22' },
  { h: 1600, nome: 'Caçador de Demônios',   emoji: '◆ 07 ·', cor: '#E74C3C' },
  { h: 1900, nome: 'Slayer Ancestral',      emoji: '◆ 08 ·', cor: '#F1C40F' },
  { h: 2200, nome: 'Lenda de Tibia',        emoji: '◆ 09 ·', cor: '#00D2FF' },
  { h: 2500, nome: 'Imortal de Nosleira',   emoji: '◆ 10 ·', cor: '#FFD700' },
];

const horasAtividade = (id) => {
  const a = atividade[id] || { voiceMin: 0, msgs: 0 };
  return (a.voiceMin || 0) / 60 + (a.msgs || 0) / 30;
};

const nivelDe = (h) => {
  let nv = -1;
  NIVEIS.forEach((n, i) => { if (h >= n.h) nv = i; });
  return nv;
};

// ─────────────────────────────────────────────
//  AUTO-MODERAÇÃO
// ─────────────────────────────────────────────
const PALAVRAS_ADULTAS = [
  'porn', 'xxx', 'xvideos', 'pornhub', 'xnxx', 'redtube', 'youporn',
  'hentai', 'onlyfans', 'cam4', 'chaturbate', 'brazzers', 'sexo',
  'nudes', 'nude', 'putaria', 'safada', 'gozada',
];

const LINKS_BET = [
  'bet365', 'betano', 'sportingbet', 'betfair', 'pixbet', 'blaze',
  'stake.com', 'estrelabet', 'galera.bet', 'novibet', 'betsson',
  'pinnacle', 'betnacional', 'superbet', 'f12.bet', 'cassino',
  'roleta', 'tigrinho', 'fortune tiger', 'fortune ox', 'fortune rabbit',
  'mines', 'crash', 'aviator',
];

const LINKS_FRAUDE = [
  'bit.ly', 'tinyurl', 'shorturl', 'adf.ly', 'free-nitro',
  'discord-nitro', 'steam-gift', 'free-robux', 'gifting',
  'claim-reward', 'verify-account',
];

const ESCALAS_PUNICAO = [30, 60, 90, 365, 0];

// ─────────────────────────────────────────────
//  CLIENT DISCORD
// ─────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

let ticketCounter = 1;
const voiceDesde    = new Map();
const msgCooldown   = new Map();
const activeStreams = new Map();

/// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
const ehStaff = (member) =>
  member?.roles?.cache?.some((r) => CARGOS_STAFF.includes(r.name)) ||
  member?.permissions?.has(PermissionFlagsBits.Administrator) ||
  member?.id === '494190671310356490';

function toScript(text) {
  const map = {
    'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗', 'I': '𝓘',
    'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡',
    'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩',
    'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲',
    'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺', 'r': '𝓻',
    's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃'
  };
  return (text || '').split('').map((char) => map[char] || char).join('');
}

function toBoldSans(text) {
  const map = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜',
    'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥',
    'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶',
    'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿',
    's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵',
  };
  return (text || '').split('').map((char) => map[char] || char).join('');
}

function toBoldSerif(text) {
  const map = {
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈',
    'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑',
    'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
    'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢',
    'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫',
    's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
  };
  return (text || '').split('').map((char) => map[char] || char).join('');
}

function formatarNomeTicket(dot, pNum, displayName, username, ticketNumStr) {
  const raw = (displayName || username || 'Jogador')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s_-]/g, '')
    .trim();

  const partes = raw.split(/[\s_-]+/).filter(Boolean);
  const nomeCapitalizado = partes
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join('') || 'Jogador';

  const prioridadeTexto = pNum ? `(P${pNum})` : '(P9)';
  const icone = dot || '🔵';
  return `${icone} ${prioridadeTexto} Ticket-${nomeCapitalizado}-${ticketNumStr}`;
}

const getRole = (guild, name) =>
  guild.roles.cache.find((r) => r.name === name);

const getChannel = (guild, keyword) => {
  const kw = keyword.toLowerCase();
  return guild.channels.cache.find((c) => {
    const raw = c.name.toLowerCase();
    const normalized = c.name.normalize('NFKD').toLowerCase();
    return raw.includes(kw) || normalized.includes(kw);
  });
};

const agora = () => `<t:${Math.floor(Date.now() / 1000)}:F>`;

// ─────────────────────────────────────────────
//  CONTADOR DE MEMBROS (Canal de Voz com Cadeado)
// ─────────────────────────────────────────────
async function atualizarContadorMembros(guild) {
  try {
    if (!guild) return;
    await guild.channels.fetch().catch(() => {});
    const ch = guild.channels.cache.find(
      (c) => (c.name.includes('Membros') || c.name.includes('👥') || c.name.normalize('NFKD').includes('Membros')) && c.type === ChannelType.GuildVoice
    );
    if (!ch) return;

    const members = await guild.members.fetch().catch(() => null);
    const total = members ? members.filter((m) => !m.user.bot).size : guild.memberCount;
    const online = members
      ? members.filter((m) => m.presence && m.presence.status !== 'offline' && !m.user.bot).size
      : 1;
    const novoNome = `[ 👥 ] ${toBoldSerif('Membros')}: 🟢[${online}] 🔴[${total}]`;
    if (ch.name !== novoNome) {
      await ch.setName(novoNome, 'Atualização de contador').catch(() => {});
    }
  } catch (err) {
    console.error('[Contador] Erro ao atualizar:', err.message);
  }
}

// ─────────────────────────────────────────────
//  CHECA NÍVEL DE ATIVIDADE
// ─────────────────────────────────────────────
async function checkNivel(member) {
  try {
    if (!member || member.user.bot) return;
    const guild = member.guild;
    const h = horasAtividade(member.id);
    const idx = nivelDe(h);
    if (idx < 0) return;

    const nomeAlvo = `${NIVEIS[idx].emoji} ${NIVEIS[idx].nome}`;
    if (member.roles.cache.some((r) => r.name === nomeAlvo)) return;

    let role = guild.roles.cache.find((r) => r.name === nomeAlvo);
    if (!role) {
      role = await guild.roles.create({
        name: nomeAlvo,
        color: NIVEIS[idx].cor,
        mentionable: false,
        reason: 'Nível de atividade do NosleiraOT',
      }).catch(() => null);
    }

    const nomes = NIVEIS.map((n) => `${n.emoji} ${n.nome}`);
    for (const r of member.roles.cache.values()) {
      if (r.name !== nomeAlvo && nomes.includes(r.name)) {
        await member.roles.remove(r).catch(() => {});
      }
    }

    if (role) await member.roles.add(role).catch(() => {});
  } catch (err) {
    console.error('[checkNivel] Erro:', err.message);
  }
}

// ═══════════════════════════════════════════════════════════════════
//  SISTEMA DE ANÚNCIO DE PROMOÇÃO DE CARGOS (#ranks)
// ═══════════════════════════════════════════════════════════════════
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  try {
    if (newMember.user.bot) return;

    // Detecta novos cargos adicionados ao membro
    const addedRoles = newMember.roles.cache.filter(
      (r) => !oldMember.roles.cache.has(r.id)
    );

    if (addedRoles.size === 0) return;

    const guild = newMember.guild;
    const canalRanks = getChannel(guild, 'ranks');
    if (!canalRanks) return;

    for (const role of addedRoles.values()) {
      // Ignora cargos administrativos, automáticos, vocações ou tags de idade
      if (CARGOS_IGNORAR_RANK.includes(role.name)) continue;

      // ── Anúncio de VIP ──────────────────────────────────────────────
      if (role.name.toLowerCase().includes('vip')) {
        const embedVip = new EmbedBuilder()
          .setColor('#9B59B6')
          .setAuthor({
            name: 'NosleiraOT 7.4 • Sistema de VIP Oficial',
            iconURL: guild.iconURL() || undefined,
          })
          .setTitle('💎  Novo Membro VIP Promovido!')
          .setDescription(
            `O jogador ${newMember} acabou de ser promovido / receber o cargo **VIP** no **NosleiraOT**!\n\n` +
            `✨ **Benefícios Ativos:**\n` +
            `> ⚡ Acesso exclusivo a áreas VIP do servidor\n` +
            `> 📦 Suporte e atendimento prioritário\n` +
            `> 👑 Tag e destaque no Discord e no Jogo\n\n` +
            `*Agradecemos pelo apoio à nossa comunidade! Bom jogo e bons loots!* ⚔️🏹🔮🌿`
          )
          .setThumbnail(newMember.user.displayAvatarURL({ size: 256 }))
          .addFields(
            { name: '👤 Jogador', value: `${newMember} (${newMember.user.tag})`, inline: true },
            { name: '💎 Status', value: '🟢 VIP Ativo', inline: true },
            { name: '📅 Data', value: agora(), inline: true },
          )
          .setFooter({ text: 'NosleiraOT 7.4 • VIP Oficial' })
          .setTimestamp();

        await canalRanks.send({
          content: `🎉 Parabéns ${newMember}! Seja muito bem-vindo ao grupo de membros VIP! 💎`,
          embeds: [embedVip],
        }).catch(console.error);
        continue;
      }

      // ── Anúncio de Promoção / Ranks de Atividade ────────────────────
      const embedPromocao = new EmbedBuilder()
        .setColor(role.hexColor !== '#000000' ? role.hexColor : '#FFD700')
        .setAuthor({
          name: 'NosleiraOT 7.4 • Conquistas & Promoções',
          iconURL: guild.iconURL() || undefined,
        })
        .setTitle('🎉  Promoção de Cargo Conquistada!')
        .setDescription(
          `O jogador ${newMember} acabou de ser promovido / conquistou o cargo:\n\n` +
          `👑 **${role.name}**\n\n` +
          `> Parabéns pela dedicação e conquista no **NosleiraOT**! ⚔️🏹🔮🌿`
        )
        .setThumbnail(newMember.user.displayAvatarURL({ size: 256 }))
        .addFields(
          { name: '👤 Jogador', value: `${newMember} (${newMember.user.tag})`, inline: true },
          { name: '🎖️ Cargo', value: `${role}`, inline: true },
          { name: '📅 Data', value: agora(), inline: true },
        )
        .setFooter({ text: 'NosleiraOT 7.4 • Sistema de Ranks Oficial' })
        .setTimestamp();

      await canalRanks.send({
        content: `🎊 Parabéns ${newMember}!`,
        embeds: [embedPromocao],
      }).catch(console.error);
    }
  } catch (err) {
    console.error('[GuildMemberUpdate] Erro:', err.message);
  }
});

// ─────────────────────────────────────────────
//  GARANTIR CANAL DE BOAS-VINDAS NOVO
// ─────────────────────────────────────────────
async function garantirCanalBoasVindas(guild) {
  try {
    if (!guild) return null;
    await guild.channels.fetch().catch(() => {});

    // Procura categoria de Informações & Comandos
    const catInfo = guild.channels.cache.find(
      (c) => c.type === ChannelType.GuildCategory && (
        c.name.toLowerCase().includes('informac') ||
        c.name.normalize('NFKD').toLowerCase().includes('informac') ||
        c.name.includes('📢')
      )
    );

    // Procura canal existente de boas-vindas
    let canalBV = guild.channels.cache.find(
      (c) => c.type === ChannelType.GuildText && (
        c.name.toLowerCase().includes('bem-vindo') ||
        c.name.toLowerCase().includes('welcome') ||
        c.name.normalize('NFKD').toLowerCase().includes('bem-vindo')
      )
    );

    const nomeFormatado = `⌈👋⌋・${toBoldSerif('Bem-Vindos')}`;

    if (!canalBV) {
      console.log(`[Boas-Vindas] Criando canal ${nomeFormatado}...`);
      canalBV = await guild.channels.create({
        name: nomeFormatado,
        type: ChannelType.GuildText,
        parent: catInfo ? catInfo.id : null,
        position: 0,
        topic: '👋 Boas-vindas aos novos aventureiros do NosleiraOT 7.4!',
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.AddReactions,
            ],
            deny: [
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.CreatePublicThreads,
              PermissionFlagsBits.CreatePrivateThreads,
              PermissionFlagsBits.SendMessagesInThreads,
            ],
          },
        ],
      });
      console.log(`[Boas-Vindas] ✅ Canal criado com sucesso: ${canalBV.name}`);
    } else {
      if (catInfo && canalBV.parentId !== catInfo.id) {
        await canalBV.setParent(catInfo.id, { lockPermissions: false }).catch(() => {});
      }
      await canalBV.setPosition(0).catch(() => {});
      if (canalBV.name !== nomeFormatado) {
        await canalBV.setName(nomeFormatado).catch(() => {});
      }
    }

    return canalBV;
  } catch (err) {
    console.error('[garantirCanalBoasVindas] Erro:', err.message);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════
//  BOAS-VINDAS + ENTRADA DE MEMBRO
// ═══════════════════════════════════════════════════════════════════
client.on(Events.GuildMemberAdd, async (member) => {
  if (member.user.bot) return; // Ignora bots

  try {
    const playerRole = getRole(member.guild, '🎮 Player');
    if (playerRole) await member.roles.add(playerRole).catch(() => {});

    // Busca canal oficial de boas-vindas
    const canalBV = (await garantirCanalBoasVindas(member.guild)) || getChannel(member.guild, 'bem-vindo') || getChannel(member.guild, 'comunicados');
    if (canalBV) {
      const chRegras = getChannel(member.guild, 'regras');
      const chLinks = getChannel(member.guild, 'links');

      const embed = new EmbedBuilder()
        .setColor('#E67E22')
        .setAuthor({
          name: 'NosleiraOT 7.4 • Comunidade Oficial',
          iconURL: member.guild.iconURL({ dynamic: true }) || undefined,
        })
        .setTitle('⚔️  BEM-VINDO(A) AO NOSLEIRA OT 7.4! ⚔️')
        .setDescription(
          `Olá ${member}! Seja muito bem-vindo(a) à nossa comunidade de **Tibia 7.4 Old School**! 🎮\n\n` +
          `Você é o aventureiro(a) **#${member.guild.memberCount}** a se juntar à nossa jornada! 🛡️\n\n` +
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
          '📜 **PRIMEIROS PASSOS:**\n' +
          `> 🌐 **Criação de Contas (Site):** [www.nosleiraot.com](${SITE_URL})\n` +
          `> ⛔ **Regras do Servidor:** ${chRegras ? `<#${chRegras.id}>` : 'Canal de Regras'}\n` +
          `> 🔱 **Links Úteis:** ${chLinks ? `<#${chLinks.id}>` : 'Canal de Links'}\n` +
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
          '⚔️ *Desejamos um excelente jogo, ótimas batalhas e bons loots!* 🏹🔮🌿'
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .setFooter({ text: `NosleiraOT 7.4 • Membro #${member.guild.memberCount}`, iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

      const files = [];
      if (fs.existsSync(BANNER_PATH)) {
        files.push(new AttachmentBuilder(BANNER_PATH, { name: 'welcome_banner.jpg' }));
        embed.setImage('attachment://welcome_banner.jpg');
      }

      await canalBV.send({
        content: `🎉 Boas-vindas ${member}!`,
        embeds: [embed],
        files: files.length > 0 ? files : undefined,
      }).catch(console.error);
    }

    await atualizarContadorMembros(member.guild);
  } catch (err) {
    console.error('[GuildMemberAdd] Erro:', err.message);
  }
});

client.on(Events.GuildMemberRemove, async (member) => {
  try {
    await atualizarContadorMembros(member.guild);
  } catch (err) {
    console.error('[GuildMemberRemove] Erro:', err.message);
  }
});

// ═══════════════════════════════════════════════════════════════════
//  DETECÇÃO AUTOMÁTICA DE STREAMERS (APENAS PLAYERS REAIS - BOTS IGNORADOS)
// ═══════════════════════════════════════════════════════════════════
client.on(Events.PresenceUpdate, async (oldPresence, newPresence) => {
  try {
    const guild  = newPresence?.guild;
    const member = newPresence?.member;
    // BOTS SÃO 100% BLOQUEADOS DE NOTIFICAÇÃO DE STREAM
    if (!guild || !member || member.user.bot) return;

    const canalLives = getChannel(guild, 'streamers');
    if (!canalLives) return;

    const streaming = newPresence?.activities?.find((a) => a.type === ActivityType.Streaming);
    const eraStreaming = oldPresence?.activities?.find((a) => a.type === ActivityType.Streaming);

    const temTag = streaming?.name?.toLowerCase().includes('nosleira') ||
                   streaming?.details?.toLowerCase().includes('nosleira') ||
                   streaming?.state?.toLowerCase().includes('nosleira');

    if (streaming && temTag && !activeStreams.has(member.id)) {
      // Cooldown rigoroso de 12 horas por streamer (ignorado para Staff/Dono)
      const STREAM_COOLDOWN_MS = 12 * 60 * 60 * 1000;
      const lastStream = streamCooldowns[member.id] || 0;
      if (!ehStaff(member) && lastStream > 0 && (Date.now() - lastStream) < STREAM_COOLDOWN_MS) {
        return;
      }

      const url = streaming.url || '';
      const plat = url.includes('twitch') ? 'Twitch' :
                   url.includes('youtube') || url.includes('youtu.be') ? 'YouTube' :
                   url.includes('facebook') || url.includes('fb.gg') ? 'Facebook Gaming' :
                   url.includes('kick') ? 'Kick' :
                   url.includes('tiktok') ? 'TikTok' : 'Transmissão';

      const embed = new EmbedBuilder()
        .setColor('#9146FF')
        .setTitle(`🔴  ${member.displayName} está ao vivo!`)
        .setDescription(
          `**${streaming.name || 'Ao vivo agora!'}**\n\n` +
          `> 🎮  **Jogo:** NosleiraOT 7.4\n` +
          (url ? `> 🔗  [Assistir na ${plat}](${url})\n` : '') +
          '\n*Vincule sua conta em Configurações → Conexões para ser detectado automaticamente!*'
        )
        .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
        .setFooter({ text: `NosleiraOT • ${plat} • Notificação 12h` })
        .setTimestamp();

      const msg = await canalLives.send({ content: '@here 📢 Alguém está ao vivo no NosleiraOT!', embeds: [embed] }).catch(() => null);
      if (msg) activeStreams.set(member.id, msg.id);

      streamCooldowns[member.id] = Date.now();
      salvarJSON(STREAM_CD_FILE, streamCooldowns);

      const cargoAoVivo = getRole(guild, '🔴 Ao Vivo');
      if (cargoAoVivo && !member.roles.cache.has(cargoAoVivo.id)) {
        await member.roles.add(cargoAoVivo).catch(() => {});
      }
    }

    if (!streaming && eraStreaming && activeStreams.has(member.id)) {
      activeStreams.delete(member.id);
      const cargoAoVivo = getRole(guild, '🔴 Ao Vivo');
      if (cargoAoVivo && member.roles.cache.has(cargoAoVivo.id)) {
        await member.roles.remove(cargoAoVivo).catch(() => {});
      }
    }
  } catch (err) {
    console.error('[PresenceUpdate] Erro:', err.message);
  }
});

// ═══════════════════════════════════════════════════════════════════
//  COMANDOS DE TEXTO E MENSAGENS
// ═══════════════════════════════════════════════════════════════════
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  const guild  = message.guild;
  const member = message.member;

  // ── AUTO-MODERAÇÃO & ANTI-SPAM / FLOOD ─────────────────────────
  if (guild && member && !ehStaff(member)) {
    const now = Date.now();
    const userTimestamps = spamTimestamps.get(member.id) || [];
    const recent = userTimestamps.filter((ts) => now - ts < 5000);
    recent.push(now);
    spamTimestamps.set(member.id, recent);

    // 1. Detecção de Raid/Flood Massivo (5+ msgs em 4s) -> AUTO-BAN IMEDIATO
    if (recent.length >= 5) {
      await message.delete().catch(() => {});
      try {
        await member.send('🚫 Você foi **banido permanentemente** do **NosleiraOT** por flood/spam massivo de mensagens.');
      } catch {}
      await member.ban({ reason: 'Automod: Spam massivo / Flood raid detectado', deleteMessageSeconds: 86400 }).catch(() => {});
      
      const canalLogs = getChannel(guild, 'log-tickets');
      if (canalLogs) {
        canalLogs.send(`🚨 **Auto-Ban Aplicado:** ${member} (${member.user.tag}) foi banido por spam massivo (${recent.length} msgs em curto intervalo).`).catch(() => {});
      }
      return;
    }

    // 2. Tolerância Zero: Conteúdo Adulto, Casas de Apostas (Bets) e Links de Fraude/Phishing -> AUTO-BAN IMEDIATO
    const txt = (message.content || '').toLowerCase();
    const motivoAchado = 
      PALAVRAS_ADULTAS.find((w) => txt.includes(w)) ? 'Conteúdo Adulto / Proibido' :
      LINKS_BET.find((w) => txt.includes(w)) ? 'Links de Casas de Apostas / Jogos de Azar' :
      LINKS_FRAUDE.find((w) => txt.includes(w)) ? 'Links Maliciosos / Golpe / Phishing' : null;

    if (motivoAchado) {
      await message.delete().catch(() => {});
      
      const reg = punicoes[member.id] || { infractions: 0 };
      reg.infractions += 1;
      reg.lastReason = `Automod: ${motivoAchado}`;
      reg.lastDate = new Date().toISOString();
      punicoes[member.id] = reg;
      salvarJSON(PUNICOES_FILE, punicoes);

      try {
        await member.send(`🚫 **Você foi banido permanentemente do NosleiraOT!**\nMotivo: Infração grave de diretrizes (${motivoAchado}).`);
      } catch {}

      await member.ban({
        reason: `Automod (Tolerância Zero): ${motivoAchado}`,
        deleteMessageSeconds: 86400,
      }).catch((e) => console.error('[AutoBan] Erro ao banir:', e.message));

      const canalLogs = getChannel(guild, 'log-tickets');
      if (canalLogs) {
        const embedBan = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('🛡️  Auto-Ban por Violação de Regras')
          .addFields(
            { name: '👤 Infrator', value: `${member} (${member.user.tag})`, inline: true },
            { name: '🚫 Motivo', value: `\`${motivoAchado}\``, inline: true },
            { name: '⚖️ Punição', value: '`Banimento Permanente`', inline: true },
            { name: '📍 Canal', value: `${message.channel}`, inline: true },
            { name: '📅 Data', value: agora(), inline: true }
          )
          .setFooter({ text: 'NosleiraOT 7.4 • Sistema de Segurança & Auto-Moderação' })
          .setTimestamp();

        canalLogs.send({ embeds: [embedBan] }).catch(() => {});
      }
      return;
    }

    // 4. Regras de Permissão de Links por Canal
    const URL_REGEX = /https?:\/\/[^\s]+/gi;
    const linksNoTexto = (message.content || '').match(URL_REGEX) || [];

    if (linksNoTexto.length > 0) {
      const chName = (message.channel.name || '').toLowerCase().normalize('NFKD');
      const isStreamers   = chName.includes('streamers');
      const isClips       = chName.includes('clips');
      const isScreenshots = chName.includes('screenshots');
      const isTicket      = (message.channel.name || '').toLowerCase().includes('ticket');

      // 4.1 Canal #screenshots: Apenas links diretos de imagem/vídeo ou hosts autorizados (Imgur, Lightshot, Postimg, Gyazo, etc.)
      if (isScreenshots) {
        const DOMINIOS_IMAGEM_PERMITIDOS = [
          'imgur.com', 'i.imgur.com',
          'prnt.sc', 'prntscr.com', 'lightshot.com',
          'postimg.cc', 'postimages.org', 'i.postimg.cc',
          'gyazo.com', 'i.gyazo.com',
          'streamable.com',
          'medal.tv',
          'discordapp.com', 'discordapp.net', 'discord.com',
          'ibb.co', 'i.ibb.co', 'imgbb.com',
          'tenor.com', 'c.tenor.com', 'giphy.com', 'media.giphy.com',
        ];

        const linkInvalido = linksNoTexto.find((url) => {
          try {
            const parsed = new URL(url);
            const host = parsed.hostname.toLowerCase();
            return !DOMINIOS_IMAGEM_PERMITIDOS.some((permitido) => host === permitido || host.endsWith('.' + permitido));
          } catch {
            return true;
          }
        });

        if (linkInvalido) {
          await message.delete().catch(() => {});
          try {
            const aviso = await message.channel.send({
              content: `⚠️ ${member}, no canal **【📸】𝗦𝗰𝗿𝗲𝗲𝗻𝘀𝗵𝗼𝘁𝘀** só é permitido enviar **imagens/vídeos** ou links de provedores de imagem autorizados (ex: **Imgur**, **Lightshot**, **Postimg**, **Gyazo**, **ImgBB**). Links de outros sites são proibidos!`,
            });
            setTimeout(() => aviso.delete().catch(() => {}), 10000);
          } catch {}
          return;
        }
      }
      // 4.2 Outros canais públicos: links só são liberados em #streamers e #clips (e tickets de suporte)
      else if (!isStreamers && !isClips && !isTicket) {
        await message.delete().catch(() => {});
        try {
          const aviso = await message.channel.send({
            content: `⚠️ ${member}, o envio de links só é permitido nos canais **【🎥】𝗦𝘁𝗿𝗲𝗮𝗺𝗲𝗿𝘀** e **【📺】𝗖𝗹𝗶𝗽𝘀**!`,
          });
          setTimeout(() => aviso.delete().catch(() => {}), 10000);
        } catch {}
        return;
      }
    }
  }

  // ── GAMIFICAÇÃO: CONTA MENSAGENS ────────────────────────────────
  if (guild && member && !member.user.bot) {
    const t = Date.now();
    if (t - (msgCooldown.get(member.id) || 0) >= 60000) {
      msgCooldown.set(member.id, t);
      const a = atividade[member.id] || { voiceMin: 0, msgs: 0 };
      a.msgs = (a.msgs || 0) + 1;
      atividade[member.id] = a;
      atividadeDirty = true;
      if (a.msgs % 10 === 0) await checkNivel(member).catch(() => {});
    }
  }

  if (!message.content.startsWith(PREFIX)) return;

  const args    = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  // ── !stream ou !live ou !nosleiraot ──────────────────────────────
  if (['stream', 'live', 'nosleiraot'].includes(command)) {
    const link = args[0];
    if (!link || !/^https?:\/\/.+\..+/.test(link)) {
      return message.reply('❌ **Uso:** `!stream <link da live>`\nExemplo: `!stream https://twitch.tv/seucanal` ou `!stream https://facebook.com/seulive`');
    }
    const canalLives = getChannel(guild, 'streamers');
    if (!canalLives) return message.reply('❌ Canal de streamers não encontrado.');

    // Limite rigoroso de 1 notificação a cada 12 horas por streamer (ignorado para Staff/Dono)
    const STREAM_COOLDOWN_MS = 12 * 60 * 60 * 1000;
    const lastStream = streamCooldowns[member.id] || 0;
    if (!ehStaff(member) && lastStream > 0 && (Date.now() - lastStream) < STREAM_COOLDOWN_MS) {
      const remMs = STREAM_COOLDOWN_MS - (Date.now() - lastStream);
      const h = Math.floor(remMs / (1000 * 60 * 60));
      const m = Math.floor((remMs % (1000 * 60 * 60)) / (1000 * 60));
      return message.reply(`⏳ **Limite de Divulgação:** Você só pode divulgar sua live uma vez a cada **12 horas**.\n⏱️ **Tempo restante para próxima divulgação:** \`${h} horas e ${m} minutos\`.`);
    }

    const plat = link.includes('twitch') ? 'Twitch' :
                 link.includes('youtube') || link.includes('youtu.be') ? 'YouTube' :
                 link.includes('facebook') || link.includes('fb.gg') ? 'Facebook Gaming' :
                 link.includes('tiktok') ? 'TikTok' :
                 link.includes('kick') ? 'Kick' :
                 link.includes('trovo') ? 'Trovo' : 'Transmissão';

    const embed = new EmbedBuilder()
      .setColor('#9146FF')
      .setTitle(`🔴  ${member.displayName} está ao vivo!`)
      .setDescription(
        `**${member.displayName} está transmitindo NosleiraOT ao vivo!**\n\n` +
        `> 🎮  **Jogo:** NosleiraOT 7.4\n` +
        `> 🔗  [Clique aqui para Assistir na ${plat}](${link})\n\n` +
        '*Venha torcer, assistir e jogar junto!* ⚔️'
      )
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .setFooter({ text: `NosleiraOT • ${plat} • Notificação 12h` })
      .setTimestamp();

    await canalLives.send({ content: '📢 @here Nova live iniciada!', embeds: [embed] });
    await message.react('✅');

    streamCooldowns[member.id] = Date.now();
    salvarJSON(STREAM_CD_FILE, streamCooldowns);
    return;
  }

  // ── !screenshot ou !print ou !ss ─────────────────────────────────
  if (['screenshot', 'print', 'ss'].includes(command)) {
    const anexo = message.attachments.first()?.url || (args[0]?.startsWith('http') ? args[0] : null);
    const desc = anexo === args[0] ? args.slice(1).join(' ') : args.join(' ');

    if (!anexo) {
      return message.reply('❌ Anexe uma imagem ou forneça o link da imagem após o comando.\nExemplo: `!print Meu primeiro Demon solo!`');
    }

    const canalScreens = getChannel(guild, 'screenshots');
    if (!canalScreens) return message.reply('❌ Canal de screenshots não encontrado.');

    const embedSS = new EmbedBuilder()
      .setColor('#2ECC71')
      .setTitle(`📸  Print de ${member.displayName}`)
      .setDescription(desc || 'Nova screenshot compartilhada!')
      .setImage(anexo)
      .setFooter({ text: `NosleiraOT • Enviado por ${member.user.tag}` })
      .setTimestamp();

    await canalScreens.send({ embeds: [embedSS] });
    await message.react('✅');
    return;
  }

  // ── !clip ────────────────────────────────────────────────────────
  if (command === 'clip') {
    const link = args[0];
    const desc = args.slice(1).join(' ') || 'Novo clipe da comunidade!';

    if (!link || !/^https?:\/\/.+\..+/.test(link)) {
      return message.reply('❌ Uso: `!clip <link do video/clipe> [descrição]`\nExemplo: `!clip https://clips.twitch.tv/... Trap insana em Venore`');
    }

    const canalClips = getChannel(guild, 'clips');
    if (!canalClips) return message.reply('❌ Canal de clips não encontrado.');

    const embedClip = new EmbedBuilder()
      .setColor('#E1306C')
      .setTitle(`🎬  Clipe de ${member.displayName}`)
      .setDescription(`${desc}\n\n> 🔗  [Assistir ao Clipe](${link})`)
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .setFooter({ text: `NosleiraOT • Clipe por ${member.user.tag}` })
      .setTimestamp();

    await canalClips.send({ embeds: [embedClip] });
    await message.react('✅');
    return;
  }

  // ── !rank ────────────────────────────────────────────────────────
  if (command === 'rank') {
    const alvo = message.mentions.members.first() || member;
    const h = horasAtividade(alvo.id);
    const idx = nivelDe(h);
    const atual = idx >= 0 ? NIVEIS[idx] : null;
    const prox = NIVEIS[idx + 1] || null;
    const a = atividade[alvo.id] || { voiceMin: 0, msgs: 0 };

    let linha = atual ? `**${atual.emoji} ${atual.nome}**` : 'Sem nível de atividade ainda.';
    if (prox) {
      const base = atual ? atual.h : 0;
      const pct = Math.min(1, Math.max(0, (h - base) / (prox.h - base)));
      const cheios = Math.round(pct * 10);
      linha += `\n\nPróximo Nível: **${prox.emoji} ${prox.nome}** (${prox.h}h)\n${'🟩'.repeat(cheios)}${'⬛'.repeat(10 - cheios)} ${(pct * 100).toFixed(0)}%`;
    } else if (atual) {
      linha += '\n\n🏆 **NÍVEL MÁXIMO ALCANÇADO! Imortal de Nosleira!**';
    }

    const embedRank = new EmbedBuilder()
      .setColor(atual ? atual.cor : '#7F8C8D')
      .setTitle(`🏆  Rank & Atividade — ${alvo.displayName}`)
      .setDescription(
        `⏱️ **${h.toFixed(1)} horas** acumuladas\n` +
        `🎙️ ${Math.floor((a.voiceMin || 0) / 60)}h em call de voz | 💬 ${a.msgs || 0} mensagens\n\n` +
        `${linha}`
      )
      .setThumbnail(alvo.user.displayAvatarURL({ size: 256 }))
      .setFooter({ text: 'NosleiraOT • Sistema de Gamificação' })
      .setTimestamp();

    await message.reply({ embeds: [embedRank] });
    return;
  }

  // ── !comandos ou !ajuda ──────────────────────────────────────────
  if (['comandos', 'ajuda', 'help'].includes(command)) {
    const embedHelp = new EmbedBuilder()
      .setColor('#3498DB')
      .setTitle('🤖  Comandos Disponíveis — NosleiraOT')
      .setDescription(
        '**Mídia & Conteúdo:**\n' +
        '> `!stream <link>` — Divulga sua live em Streamers\n' +
        '> `!screenshot [descrição]` — Posta print em Screenshots\n' +
        '> `!clip <link> [descrição]` — Posta clipe em Clips\n\n' +
        '**Ranks & Atividade:**\n' +
        '> `!rank` — Consulta suas horas e nível de atividade\n' +
        '> `!radio` — Abre o painel interativo da Rádio Nosleira 98 FM'
      )
      .setFooter({ text: 'NosleiraOT • Central de Ajuda' })
      .setTimestamp();

    await message.reply({ embeds: [embedHelp] });
    return;
  }

  // ── !boss spawn / drop (Staff) ───────────────────────────────────
  if (command === 'boss') {
    if (!ehStaff(member)) return message.reply('❌ Apenas membros da Staff podem usar este comando.');
    const sub = args[0]?.toLowerCase();
    const canalBoss = getChannel(guild, 'boss');

    if (sub === 'spawn') {
      const nomeBoss = args.slice(1).join(' ') || 'Desconhecido';
      const embed = new EmbedBuilder()
        .setColor('#E67E22')
        .setTitle('⚔️  Alerta de Boss — Spawn Detectado!')
        .addFields(
          { name: '👹 Boss', value: nomeBoss, inline: true },
          { name: '📅 Horário', value: agora(), inline: true },
          { name: '👤 Notificado por', value: `${member}`, inline: true },
        )
        .setFooter({ text: 'NosleiraOT • Monitor de Bosses' })
        .setTimestamp();

      if (canalBoss) await canalBoss.send({ content: '🚨 @here Boss nasceu no jogo!', embeds: [embed] });
      await message.react('✅');
      return;
    }

    if (sub === 'drop') {
      const resto = args.slice(1).join(' ');
      const partes = resto.split('|').map((s) => s.trim());
      const nomeBoss = partes[0] || 'Desconhecido';
      const item     = partes[1] || 'Item não informado';
      const jogador  = partes[2] || 'Não informado';

      const embed = new EmbedBuilder()
        .setColor('#9B59B6')
        .setTitle('💀  Drop de Boss Confirmado!')
        .addFields(
          { name: '👹 Boss', value: nomeBoss, inline: true },
          { name: '🎁 Item Raro', value: item, inline: true },
          { name: '🏆 Jogador', value: jogador, inline: true },
          { name: '📅 Data', value: agora(), inline: false },
        )
        .setFooter({ text: 'NosleiraOT • Monitor de Drops' })
        .setTimestamp();

      if (canalBoss) await canalBoss.send({ embeds: [embed] });
      await message.react('✅');
      return;
    }

    return message.reply('**Uso:** `!boss spawn <nome>` ou `!boss drop <boss> | <item> | <jogador>`');
  }

  // ── Moderação: !mute, !unmute, !kick, !ban ───────────────────────
  if (command === 'mute' && ehStaff(member)) {
    const alvo = message.mentions.members.first();
    const motivo = args.slice(1).join(' ') || 'Sem motivo';
    if (!alvo) return message.reply('❌ Mencione um usuário.');
    await alvo.timeout(15 * 60 * 1000, motivo).catch(() => {});
    await message.reply(`✅ **${alvo.displayName}** foi silenciado por 15 minutos.`);
    return;
  }

  if (command === 'unmute' && ehStaff(member)) {
    const alvo = message.mentions.members.first();
    if (!alvo) return message.reply('❌ Mencione um usuário.');
    await alvo.timeout(null).catch(() => {});
    await message.reply(`✅ **${alvo.displayName}** foi desmutado.`);
    return;
  }
});

// ═══════════════════════════════════════════════════════════════════
//  INTERAÇÕES — BOTÕES E TICKETS (COM RESPOSTA IMEDIATA ANTI-TIMEOUT)
// ═══════════════════════════════════════════════════════════════════
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;

  const { customId, guild, member, channel } = interaction;
  if (interaction.isButton() && customId.startsWith('music_')) {
    return interaction.reply({
      content: '🎵 **Opa!** Para controlar o DJ, por favor, utilize os comandos de texto no chat (ex: `!play`, `!pause`, `!skip`). Esses botões são atalhos ilustrativos das funções!',
      ephemeral: true
    });
  }


  // ── 0. Seleção de Vocação com Cooldown de 24 Horas ───────────
  if (interaction.isButton() && VOCACOES[customId]) {
    try {
      await interaction.deferReply({ ephemeral: true });
      const voc = VOCACOES[customId];
      const roleAlvo = guild.roles.cache.find((r) => r.name === voc.nome);

      if (!roleAlvo) {
        return interaction.editReply({
          content: `❌ O cargo **${voc.label}** não foi encontrado.`,
        });
      }

      // Se o usuário já possui a vocação que clicou
      if (member.roles.cache.has(roleAlvo.id)) {
        return interaction.editReply({
          content: `ℹ️ Você já possui a vocação **${voc.label}** ativa no seu perfil.`,
        });
      }

      // Cooldown rigoroso de 24 Horas para troca de classe (ignorado para Dono / Staff)
      if (!ehStaff(member)) {
        const VOCATION_COOLDOWN_MS = 24 * 60 * 60 * 1000;
        const lastChange = vocationCooldowns[member.id] || 0;
        const now = Date.now();
        const timePassed = now - lastChange;

        if (lastChange > 0 && timePassed < VOCATION_COOLDOWN_MS) {
          const remainingMs = VOCATION_COOLDOWN_MS - timePassed;
          const h = Math.floor(remainingMs / (1000 * 60 * 60));
          const m = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
          return interaction.editReply({
            content: `⏳ **Troca de Vocação Bloqueada!**\n\nPor equilíbrio e organização das classes no servidor, a escolha ou troca de vocação só é permitida a cada **24 horas**.\n⏱️ **Tempo restante para poder alterar:** \`${h} horas e ${m} minutos\`.`,
          });
        }
      }

      // Remove as outras vocações para ficar apenas com a escolhida
      const todasVocs = Object.values(VOCACOES).map((v) => v.nome);
      for (const r of member.roles.cache.values()) {
        if (todasVocs.includes(r.name) && r.id !== roleAlvo.id) {
          await member.roles.remove(r).catch(() => {});
        }
      }

      // Adiciona a vocação selecionada
      await member.roles.add(roleAlvo).catch(() => {});

      // Salva o novo cooldown de 24 horas
      vocationCooldowns[member.id] = Date.now();
      salvarJSON(VOCATION_FILE, vocationCooldowns);

      await interaction.editReply({
        content: `✅ Você escolheu a vocação **${voc.label}**! A subtag **${voc.nome}** foi atribuída ao seu perfil no Discord com sucesso.\n*Lembre-se: uma nova troca só poderá ser realizada após 24 horas.* ⚔️🏹🔮🌿`,
      });
    } catch (err) {
      console.error('[vocation_select] Erro:', err.message);
      await interaction.editReply({ content: '❌ Erro ao atribuir a vocação.' }).catch(() => {});
    }
    return;
  }

  // ── Botão Atalho: Escolher Vocação ─────────────────────────────
  if (customId === 'cmd_vocacao_menu') {
    try {
      await interaction.deferReply({ ephemeral: true });
      const embedVoc = new EmbedBuilder()
        .setColor('#E67E22')
        .setTitle('🛡️  Escolha a sua Vocação Principal')
        .setDescription(
          'Clique no botão da sua classe abaixo para receber a subtag correspondente no seu perfil:\n\n' +
          '⚔️ **Elite Knight (EK)** — Tanker e combate corpo-a-corpo\n' +
          '🏹 **Royal Paladin (RP)** — Mestre do combate à distância\n' +
          '🔮 **Master Sorcerer (MS)** — Mago ofensivo e dano massivo\n' +
          '🌿 **Elder Druid (ED)** — Conjurador dos elementos e curandeiro\n\n' +
          '⏱️ *Regra: Após escolher, uma nova troca só é permitida após 24 horas.*'
        );

      const rowVoc = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('vocation_ek').setLabel('⚔️ Knight (EK)').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('vocation_rp').setLabel('🏹 Paladin (RP)').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('vocation_ms').setLabel('🔮 Sorcerer (MS)').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('vocation_ed').setLabel('🌿 Druid (ED)').setStyle(ButtonStyle.Secondary)
      );

      await interaction.editReply({ embeds: [embedVoc], components: [rowVoc] });
    } catch (err) {
      console.error('[cmd_vocacao_menu] Erro:', err.message);
    }
    return;
  }

  // ── Botão Atalho: Meu Rank ─────────────────────────────────────
  if (customId === 'cmd_rank_self') {
    try {
      await interaction.deferReply({ ephemeral: true });

      // Cooldown de 24 Horas para consulta de Ranking (ignorado para Dono / Staff)
      if (!ehStaff(member)) {
        const RANK_COOLDOWN_MS = 24 * 60 * 60 * 1000;
        const lastRank = rankCooldowns[member.id] || 0;
        const now = Date.now();
        const timePassed = now - lastRank;

        if (lastRank > 0 && timePassed < RANK_COOLDOWN_MS) {
          const remainingMs = RANK_COOLDOWN_MS - timePassed;
          const h = Math.floor(remainingMs / (1000 * 60 * 60));
          const m = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
          return interaction.editReply({
            content: `⏳ **Limite de consulta:** Você só pode consultar seu ranking uma vez a cada **24 horas**.\n⏱️ **Tempo restante para poder consultar novamente:** \`${h} horas e ${m} minutos\`.`,
          });
        }
      }

      rankCooldowns[member.id] = Date.now();
      salvarJSON(RANK_CD_FILE, rankCooldowns);

      const h = horasAtividade(member.id);
      const idx = nivelDe(h);
      const atual = idx >= 0 ? NIVEIS[idx] : null;
      const prox = NIVEIS[idx + 1] || null;
      const a = atividade[member.id] || { voiceMin: 0, msgs: 0 };

      let linha = atual ? `**${atual.emoji} ${atual.nome}**` : 'Sem nível de atividade ainda.';
      if (prox) {
        const base = atual ? atual.h : 0;
        const pct = Math.min(1, Math.max(0, (h - base) / (prox.h - base)));
        const cheios = Math.round(pct * 10);
        linha += `\n\nPróximo Nível: **${prox.emoji} ${prox.nome}** (${prox.h}h)\n${'🟩'.repeat(cheios)}${'⬛'.repeat(10 - cheios)} ${(pct * 100).toFixed(0)}%`;
      } else if (atual) {
        linha += '\n\n🏆 **NÍVEL MÁXIMO ALCANÇADO! Imortal de Nosleira!**';
      }

      const embedRank = new EmbedBuilder()
        .setColor(atual ? atual.cor : '#7F8C8D')
        .setTitle(`🏆  Seu Rank & Atividade — ${member.displayName}`)
        .setDescription(
          `⏱️ **${h.toFixed(1)} horas** acumuladas\n` +
          `🎙️ ${Math.floor((a.voiceMin || 0) / 60)}h em call de voz | 💬 ${a.msgs || 0} mensagens\n\n` +
          `${linha}`
        )
        .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
        .setFooter({ text: 'NosleiraOT • Sistema de Gamificação' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embedRank] });
    } catch (err) {
      console.error('[cmd_rank_self] Erro:', err.message);
    }
    return;
  }

  // ── Botão Atalho: Regras Rápidas ───────────────────────────────
  if (customId === 'cmd_regras_popup' || customId === 'cmd_regras') {
    try {
      await interaction.deferReply({ ephemeral: true });
      const chRegras = getChannel(guild, 'regras');
      const embedRegrasMini = new EmbedBuilder()
        .setColor('#E74C3C')
        .setTitle('📜  Regras Principais — NosleiraOT')
        .setDescription(
          '**Principais Proibições (Ban Imediato):**\n' +
          '> 🔞 Proibido conteúdo adulto/pornografia\n' +
          '> 🎰 Proibido links de casas de apostas/bets/cassinos\n' +
          '> ⚖️ Proibido racismo, ofensas graves ou preconceito\n' +
          '> 🤖 Proibido uso de bots, hacks ou trapaças\n\n' +
          (chRegras ? `Consulte o canal completo em ${chRegras}.` : '')
        )
        .setFooter({ text: 'NosleiraOT 7.4 • Diretrizes' });

      await interaction.editReply({ embeds: [embedRegrasMini] });
    } catch (err) {
      console.error('[cmd_regras_popup] Erro:', err.message);
    }
    return;
  }

  // ── 1. Clique em "Abrir Ticket" (Menu com Cores Repaginadas e Select) ───
  if (customId === 'create_ticket' || customId === 'cmd_ticket') {
    try {
      // Defer imediato garante resposta < 50ms (nunca timeout!)
      await interaction.deferReply({ ephemeral: true });

      await guild.channels.fetch().catch(() => {});

      const chTicketBR =
        getChannel(guild, 'ticket-br') ||
        getChannel(guild, 'ticket') ||
        guild.channels.cache.get('1552415270000267454');

      if (!chTicketBR) {
        return interaction.editReply({
          content: '❌ O canal oficial de tickets não foi encontrado no servidor. Contate a administração.',
          embeds: [],
          components: [],
        });
      }

      // ── VERIFICAÇÃO PRÉVIA: SE JÁ POSSUI TICKETS ATIVOS (Apenas para Players, Dono/Admin é livre) ──
      if (!ehStaff(member)) {
        const activeUserThreads = [];
        if (chTicketBR.threads) {
          const threadsAtivas = await chTicketBR.threads.fetchActive().catch(() => null);
          if (threadsAtivas && threadsAtivas.threads) {
            for (const t of threadsAtivas.threads.values()) {
              if (!t.archived) {
                const membersInThread = await t.members.fetch().catch(() => null);
                if (membersInThread && membersInThread.has(member.id)) {
                  activeUserThreads.push(t);
                }
              }
            }
          }
        }

        // Limite rigoroso de 1 ticket ativo por usuário
        if (activeUserThreads.length >= 1) {
          return interaction.editReply({
            content: `⚠️ **Você já possui um atendimento ativo em andamento:** ${activeUserThreads[0]}.\nPor favor, aguarde a conclusão ou utilize o seu subtópico em andamento antes de solicitar outro chamado.`,
            embeds: [],
            components: [],
          });
        }
      }

      const embedMenu = new EmbedBuilder()
        .setColor('#E67E22')
        .setTitle('📂  Central de Atendimento — Escolha o Departamento')
        .setDescription(
          '**Selecione o departamento correto para o seu caso abaixo:**\n' +
          'Escolha pelo menu suspenso ou pelos botões coloridos para iniciar o atendimento:'
        )
        .setFooter({ text: 'NosleiraOT • Atendimento Rápido e Seguro' });

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('ticket_select_cat')
        .setPlaceholder('📂 Clique aqui para selecionar o assunto...')
        .addOptions(
          { label: 'Falar com o Dono (P1)', description: 'Assunto exclusivo e sigiloso com a Direção', value: 'ticket_cat_dono', emoji: '👑' },
          { label: 'Bug no Jogo (P2)', description: 'Bugs de mapa, magias, monstros ou client', value: 'ticket_cat_bug', emoji: '🐛' },
          { label: 'Denúncia de Jogador (P3)', description: 'Reportar trapaça, ofensas ou violações', value: 'ticket_cat_denuncia', emoji: '🚨' },
          { label: 'Financeiro & Pagamento (P4)', description: 'Problemas com PIX, transações ou doações', value: 'ticket_cat_pagamento', emoji: '💳' },
          { label: 'Item de Donate (P5)', description: 'Dúvidas ou entrega de itens adquiridos', value: 'ticket_cat_item', emoji: '🎁' },
          { label: 'Problema com Conta (P6)', description: 'Acesso, bloqueios ou dados da conta', value: 'ticket_cat_conta', emoji: '👤' },
          { label: 'Recover Key (P7)', description: 'Solicitação ou recuperação de chave', value: 'ticket_cat_recover', emoji: '🔑' },
          { label: 'Remover 2FA (P8)', description: 'Desativar autenticação de dois fatores', value: 'ticket_cat_2f', emoji: '🔓' },
          { label: 'Dúvidas Gerais (P9)', description: 'Informações gerais sobre o servidor 7.4', value: 'ticket_cat_duvida', emoji: '❓' },
        );

      const rowSelect = new ActionRowBuilder().addComponents(selectMenu);

      // Botões organizados por ordem de prioridade P1 a P9 e cores:
      // Linha 1: P1 Dono (Vermelho/Destaque), P2 Bug (Vermelho), P3 Denúncia (Vermelho)
      const rowBtn1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('ticket_cat_dono').setLabel('👑 Falar com o Dono (P1)').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('ticket_cat_bug').setLabel('🐛 Bug no Jogo (P2)').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('ticket_cat_denuncia').setLabel('🚨 Denúncia (P3)').setStyle(ButtonStyle.Danger)
      );

      // Linha 2: P4 Pagamento (Amarelo/Verde), P5 Item Donate (Amarelo/Verde), P6 Conta (Azul)
      const rowBtn2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('ticket_cat_pagamento').setLabel('💳 Pagamento (P4)').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('ticket_cat_item').setLabel('🎁 Item Donate (P5)').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('ticket_cat_conta').setLabel('👤 Conta (P6)').setStyle(ButtonStyle.Primary)
      );

      // Linha 3: P7 Recover Key (Grafite), P8 Remover 2FA (Grafite), P9 Dúvida Geral (Azul)
      const rowBtn3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('ticket_cat_recover').setLabel('🔑 Recover Key (P7)').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('ticket_cat_2f').setLabel('🔓 Remover 2FA (P8)').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('ticket_cat_duvida').setLabel('❓ Dúvida Geral (P9)').setStyle(ButtonStyle.Primary)
      );

      await interaction.editReply({
        embeds: [embedMenu],
        components: [rowSelect, rowBtn1, rowBtn2, rowBtn3],
      });

      // Auto-limpeza após 5 minutos para não deixar menu aberto/congestionado
      setTimeout(() => {
        interaction.deleteReply().catch(() => {});
      }, 5 * 60 * 1000);
    } catch (err) {
      console.error('[create_ticket] Erro:', err.message);
    }
    return;
  }

  // ── 2. Seleção de categoria (via Select Menu ou Botão) ───────────
  let selectedCategory = null;
  if (interaction.isStringSelectMenu() && customId === 'ticket_select_cat') {
    selectedCategory = interaction.values[0];
  } else if (interaction.isButton() && CATEGORIAS_TICKET[customId]) {
    selectedCategory = customId;
  }

  if (selectedCategory && CATEGORIAS_TICKET[selectedCategory]) {
    try {
      await interaction.deferUpdate();
      const cat = CATEGORIAS_TICKET[selectedCategory];

      // Proteção de Cooldown entre Criação de Tickets (ignorado para Staff/Admin)
      if (!ehStaff(member)) {
        const TICKET_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutos
        const lastTicket = ticketCooldowns[member.id] || 0;
        if (lastTicket > 0 && (Date.now() - lastTicket) < TICKET_COOLDOWN_MS) {
          const remSec = Math.ceil((TICKET_COOLDOWN_MS - (Date.now() - lastTicket)) / 1000);
          return interaction.editReply({
            content: `⏳ **Limite de criação de tickets:** Você já abriu um ticket recentemente. Aguarde \`${remSec}s\` antes de solicitar outro atendimento.`,
            embeds: [],
            components: [],
          });
        }
      }

      await guild.channels.fetch().catch(() => {});

      // Busca estritamente o canal oficial de texto Ticket-BR
      const chTicketBR =
        getChannel(guild, 'ticket-br') ||
        getChannel(guild, 'ticket') ||
        guild.channels.cache.get('1552415270000267454');

      if (!chTicketBR) {
        return interaction.editReply({
          content: '❌ O canal oficial de tickets não foi encontrado no servidor. Contate a administração.',
          embeds: [],
          components: [],
        });
      }

      // ── VERIFICAÇÃO DE TICKETS ATIVOS DO USUÁRIO DENTRO DE TICKET-BR (ignorado para Staff/Admin) ──
      if (!ehStaff(member)) {
        const activeUserThreads = [];
        if (chTicketBR.threads) {
          const threadsAtivas = await chTicketBR.threads.fetchActive().catch(() => null);
          if (threadsAtivas && threadsAtivas.threads) {
            for (const t of threadsAtivas.threads.values()) {
              if (!t.archived) {
                const membersInThread = await t.members.fetch().catch(() => null);
                if (membersInThread && membersInThread.has(member.id)) {
                  activeUserThreads.push(t);
                }
              }
            }
          }
        }

        // Limite de 1 ticket ativo por usuário
        if (activeUserThreads.length >= 1) {
          return interaction.editReply({
            content: `❌ **Limite de Atendimento:** Você já possui um ticket ativo em andamento (${activeUserThreads[0]}). Por favor, encerre o atendimento anterior antes de abrir outro.`,
            embeds: [],
            components: [],
          });
        }
      }

      const ehTicketDono = cat.donoOnly === true || cat.tag === 'Dono';
      const roleDono = guild.roles.cache.find((r) => r.name.includes('Dono'));

      const ticketNumStr = ticketCounter.toString().padStart(4, '0');
      // Padrão rigoroso: 🔴 (P2) Ticket-Nome-0001
      const nomeThreadTicket = formatarNomeTicket(cat.dot, cat.pNum, member.displayName, member.user.username, ticketNumStr);

      // Cria subtópico privado estritamente dentro de Ticket-BR
      const threadCriada = await chTicketBR.threads.create({
        name: nomeThreadTicket,
        autoArchiveDuration: 1440,
        type: ChannelType.PrivateThread,
        reason: `Ticket #${ticketNumStr} de ${member.user.tag} (${cat.nome})`,
      });

      // Adiciona o jogador ao subtópico privado
      await threadCriada.members.add(member.id).catch(() => {});

      const perguntas = cat.campos.map((c) => `> • **${c}**`).join('\n');
      const modeloTexto = cat.campos.map((c) => `• ${c} `).join('\n');

      const embedTicket = new EmbedBuilder()
        .setColor(cat.cor)
        .setAuthor({
          name: 'NosleiraOT 7.4 • Central de Suporte Oficial',
          iconURL: guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL(),
        })
        .setTitle(`${cat.emoji}  Ticket #${ticketNumStr} — ${cat.nome}`)
        .setDescription(
          `Olá ${member}, seja bem-vindo ao seu atendimento de **${cat.nome}**!\n\n` +
          `📝 **Por favor, envie as informações abaixo para agilizar:**\n` +
          `${perguntas}\n\n` +
          `📋 **Copie o modelo abaixo, preencha seus dados e envie aqui:**\n` +
          `\`\`\`text\n${modeloTexto}\n\`\`\`\n` +
          `*(💡 Você também pode clicar no botão **📋 Copiar Modelo** abaixo para receber o texto pronto para copiar)*\n\n` +
          `⏱️ *Nossa equipe responderá o mais breve possível. Aguarde no canal.*`
        )
        .addFields(
          { name: '👤 Jogador', value: `${member}`, inline: true },
          { name: '📁 Categoria', value: `${cat.emoji} ${cat.nome}`, inline: true },
          { name: '🚨 Prioridade', value: `\`${cat.prioridade}\``, inline: true },
          { name: '📊 Status', value: '🟡 `Aguardando Atendente`', inline: true },
          { name: '📍 Canal Base', value: `${chTicketBR}`, inline: true },
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `Ticket #${ticketNumStr} • ${cat.prioridade}`, iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

      const botoesTicket = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`copy_model_${selectedCategory}`).setLabel('📋 Copiar Modelo').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('claim_ticket').setLabel('✋ Assumir').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('escalate_dono').setLabel('👑 Direcionar ao Dono').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('close_ticket').setLabel('🔒 Fechar').setStyle(ButtonStyle.Secondary),
      );

      const mencao = ehTicketDono && roleDono ? `${member} <@&${roleDono.id}>` : `${member} @here`;
      await threadCriada.send({
        content: mencao,
        embeds: [embedTicket],
        components: [botoesTicket],
      });

      // Log no canal de logs de ticket (Abertura)
      const canalLogAbertura = getChannel(guild, 'log-tickets');
      if (canalLogAbertura) {
        const embedLogAbertura = new EmbedBuilder()
          .setColor('#2ECC71')
          .setTitle('📋  Novo Ticket Aberto')
          .addFields(
            { name: '👤 Jogador', value: `${member} (${member.user.tag})`, inline: true },
            { name: '📁 Categoria', value: `${cat.emoji} ${cat.nome}`, inline: true },
            { name: '🚨 Prioridade', value: `\`${cat.prioridade}\``, inline: true },
            { name: '💬 Subtópico', value: `${threadCriada}`, inline: true },
          )
          .setFooter({ text: `Ticket #${ticketNumStr} • ${cat.prioridade}` })
          .setTimestamp();

        await canalLogAbertura.send({ embeds: [embedLogAbertura] }).catch(() => {});
      }

      // Salva dados estruturados do ticket para o log definitivo
      ticketsHistorico[threadCriada.id] = {
        id: ticketNumStr,
        canalId: threadCriada.id,
        canalNome: nomeThreadTicket,
        autorId: member.id,
        autorTag: member.user.tag,
        autorNome: member.displayName,
        categoria: cat.nome,
        categoriaTag: cat.tag,
        categoriaEmoji: cat.emoji,
        prioridade: cat.prioridade,
        criadaEm: Date.now(),
        atendenteId: null,
        atendenteNome: null,
        atendenteTag: null,
        atendenteCargo: null,
      };
      salvarJSON(TICKETS_HIST_FILE, ticketsHistorico);

      ticketCounter++;
      ticketCooldowns[member.id] = Date.now();
      salvarJSON(TICKET_CD_FILE, ticketCooldowns);

      // Resposta visual elegante e organizada na confirmação de abertura
      const embedConfirmacao = new EmbedBuilder()
        .setColor('#2ECC71')
        .setTitle('🎫  Atendimento Aberto com Sucesso!')
        .setDescription(
          `Olá **${member.displayName}**, seu atendimento foi aberto com sucesso!\n\n` +
          `🔒 **Subtópico Privado em Ticket-BR:** \`${nomeThreadTicket}\`\n\n` +
          `👉 **Clique no botão verde abaixo para entrar diretamente no seu atendimento:**`
        )
        .addFields(
          { name: '🆔 Protocolo', value: `\`#${ticketNumStr}\``, inline: true },
          { name: '📋 Departamento', value: `${cat.emoji} **${cat.nome}**`, inline: true },
          { name: '🚨 Prioridade', value: `\`${cat.prioridade}\``, inline: true },
          { name: '📊 Status', value: '🟡 `Aguardando Atendente`', inline: true },
          { name: '📍 Canal Base', value: `Subtópico dentro de <#${chTicketBR.id}>`, inline: true },
        )
        .setThumbnail(guild.iconURL({ dynamic: true }) || member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: 'NosleiraOT • Atendimento Rápido e Seguro', iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

      const rowIrAoTicket = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel(`🚀 Entrar no Ticket (#${ticketNumStr})`)
          .setStyle(ButtonStyle.Link)
          .setURL(`https://discord.com/channels/${guild.id}/${threadCriada.id}`)
      );

      await interaction.editReply({
        embeds: [embedConfirmacao],
        components: [rowIrAoTicket],
      });
    } catch (err) {
      console.error('[criar_canal_ticket] Erro:', err.message);
      await interaction.editReply({
        content: '❌ Erro ao criar o ticket. Por favor, tente novamente.',
        embeds: [],
        components: [],
      }).catch(() => {});
    }
    return;
  }

  // ── 2.1 Botão Copiar Modelo ──────────────────────────────────────
  if (interaction.isButton() && customId.startsWith('copy_model')) {
    try {
      const catKey = customId.replace('copy_model_', '');
      const cat = CATEGORIAS_TICKET[catKey] || {
        nome: 'Atendimento',
        campos: ['Nome da conta ou e-mail:', 'Personagem principal:', 'Descreva o ocorrido:'],
      };

      const textoParaCopiar = cat.campos.map((c) => `• ${c} `).join('\n');

      return interaction.reply({
        content:
          `📋 **Modelo de informações para \`${cat.nome}\`:**\n` +
          `Copie o texto do bloco abaixo (no PC ou celular, basta clicar no ícone de cópia do bloco ou selecionar o texto), preencha com suas informações e envie na conversa do ticket:\n\n` +
          `\`\`\`text\n${textoParaCopiar}\n\`\`\``,
        ephemeral: true,
      });
    } catch (err) {
      console.error('[copy_model] Erro:', err.message);
    }
    return;
  }

  // ── 3. Assumir Ticket ───────────────────────────────────────────
  if (customId === 'claim_ticket') {
    try {
      if (!ehStaff(member)) {
        return interaction.reply({ content: '❌ Apenas membros da Staff podem assumir tickets.', ephemeral: true });
      }
      await interaction.deferUpdate();

      // Puxa a cor do cargo mais alto do atendente (ex: Vermelho se for Dono, etc.)
      let corAtendente = member.displayHexColor;
      if (!corAtendente || corAtendente === '#000000') {
        corAtendente = '#2ECC71';
      }

      // Identifica o cargo de suporte/staff do membro
      const cargoPrincipal = (member.roles.highest && member.roles.highest.name !== '@everyone')
        ? member.roles.highest.name
        : 'Equipe de Suporte';

      // Atualiza histórico em memória/disco
      if (ticketsHistorico[channel.id]) {
        ticketsHistorico[channel.id].atendenteId = member.id;
        ticketsHistorico[channel.id].atendenteNome = member.displayName;
        ticketsHistorico[channel.id].atendenteTag = member.user.tag;
        ticketsHistorico[channel.id].atendenteCargo = cargoPrincipal;
        salvarJSON(TICKETS_HIST_FILE, ticketsHistorico);
      }

      const embedOrig = interaction.message.embeds[0];
      if (embedOrig) {
        const embedEdit = EmbedBuilder.from(embedOrig)
          .setColor(corAtendente)
          .spliceFields(3, 1, {
            name: '📊 Status',
            value: `🟢 Em Atendimento por ${member}\n(\`${cargoPrincipal}\`)`,
            inline: true,
          });

        await interaction.message.edit({ embeds: [embedEdit] }).catch(() => {});
      }

      const embedAssumido = new EmbedBuilder()
        .setColor(corAtendente)
        .setAuthor({
          name: `${member.displayName} • ${cargoPrincipal}`,
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle('🛡️  Atendimento Assumido')
        .setDescription(
          `O membro da equipe ${member} assumiu a responsabilidade por este ticket.\n\n` +
          `💬 **Aguarde um momento**, o atendente responderá a sua solicitação em instantes!\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        )
        .addFields(
          { name: '👤 Atendente', value: `${member}`, inline: true },
          { name: '🎖️ Cargo', value: `\`${cargoPrincipal}\``, inline: true },
          { name: '🟢 Status', value: '`Em Andamento`', inline: true }
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({
          text: `NosleiraOT • Atendimento por ${cargoPrincipal}`,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

      await channel.send({ embeds: [embedAssumido] });
    } catch (err) {
      console.error('[claim_ticket] Erro:', err.message);
    }
    return;
  }

  // ── 3.1 Direcionar Ticket ao Dono (Escalonamento para P1) ───────────
  if (customId === 'escalate_dono') {
    try {
      if (!ehStaff(member)) {
        return interaction.reply({ content: '❌ Apenas membros da Staff podem direcionar tickets ao Dono.', ephemeral: true });
      }
      await interaction.deferUpdate();

      const roleDono = guild.roles.cache.find((r) => r.name.includes('Dono'));
      const mencaoDono = roleDono ? `<@&${roleDono.id}>` : '@Dono';

      const embedOrig = interaction.message.embeds[0];
      if (embedOrig) {
        const embedEdit = EmbedBuilder.from(embedOrig)
          .setColor('#FF0000')
          .spliceFields(2, 1, {
            name: '🚨 Prioridade',
            value: '`🔴 Prioridade 1 • Urgente (Direção)`',
            inline: true,
          })
          .spliceFields(3, 1, {
            name: '📊 Status',
            value: `🔴 **Direcionado à Direção por ${member}**`,
            inline: true,
          });

        await interaction.message.edit({ embeds: [embedEdit] }).catch(() => {});
      }

      const embedEscalonado = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('👑  Ticket Direcionado para o Dono (Prioridade 1)')
        .setDescription(
          `O membro da equipe ${member} elevou este atendimento para a **Direção / Dono**.\n\n` +
          `📌 **Classificação:** \`🔴 Prioridade 1 • Urgente (Direção)\`\n` +
          `👑 ${mencaoDono}, este chamado foi encaminhado para a sua atenção exclusiva.\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        )
        .setFooter({ text: 'NosleiraOT • Atendimento da Direção' })
        .setTimestamp();

      await channel.send({ content: mencaoDono, embeds: [embedEscalonado] });
    } catch (err) {
      console.error('[escalate_dono] Erro:', err.message);
    }
    return;
  }

  // ── 4. Fechar Ticket (Confirmação) ──────────────────────────────
  if (customId === 'close_ticket') {
    try {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#E74C3C')
            .setTitle('🔒  Fechar Ticket')
            .setDescription('Tem certeza que deseja encerrar este atendimento?\n*O canal será finalizado e o registro completo arquivado em Log-Tickets.*'),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('confirm_close').setLabel('✅ Confirmar Fechamento').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('cancel_close').setLabel('❌ Cancelar').setStyle(ButtonStyle.Secondary),
          ),
        ],
      });
    } catch (err) {
      console.error('[close_ticket] Erro:', err.message);
    }
    return;
  }

  if (customId === 'cancel_close') {
    await interaction.update({ content: '✅ Fechamento cancelado.', embeds: [], components: [] }).catch(() => {});
    return;
  }

  if (customId === 'confirm_close') {
    try {
      await interaction.deferUpdate();

      // Recupera dados salvos ou sintetiza
      const tInfo = ticketsHistorico[channel.id] || {
        id: channel.name.replace(/[^0-9]/g, '') || '0000',
        canalNome: channel.name,
        autorId: null,
        autorNome: 'Jogador',
        autorTag: 'Desconhecido',
        categoria: 'Suporte Geral',
        categoriaEmoji: '🎫',
        criadaEm: channel.createdTimestamp || Date.now(),
        atendenteId: null,
        atendenteNome: null,
        atendenteCargo: null,
      };

      // Busca mensagens completas do canal para gerar transcrição limpa e detalhada
      const rawMsgs = await channel.messages.fetch({ limit: 100 }).catch(() => null);
      const msgsList = rawMsgs ? Array.from(rawMsgs.values()).reverse() : [];

      const tempoTotalMs = Date.now() - tInfo.criadaEm;
      const durMin = Math.max(1, Math.round(tempoTotalMs / 60000));
      const durFormatada = durMin >= 60 ? `${Math.floor(durMin / 60)}h ${durMin % 60}m` : `${durMin} min`;

      // Monta texto do histórico/transcript
      let transcriptText = `========================================================================\n` +
        `             NOSLEIRA OT 7.4 — REGISTRO OFICIAL DE ATENDIMENTO          \n` +
        `========================================================================\n` +
        `Protocolo / ID  : #${tInfo.id}\n` +
        `Canal / Tópico  : ${channel.name}\n` +
        `Departamento    : ${tInfo.categoriaEmoji} ${tInfo.categoria}\n` +
        `Jogador (Autor) : ${tInfo.autorNome} (${tInfo.autorTag})\n` +
        `Atendente Staff : ${tInfo.atendenteNome ? `${tInfo.atendenteNome} [${tInfo.atendenteCargo}]` : 'Não registrado / Atendimento direto'}\n` +
        `Encerrado por   : ${member.displayName} (${member.user.tag})\n` +
        `Abertura        : ${new Date(tInfo.criadaEm).toLocaleString('pt-BR')}\n` +
        `Fechamento      : ${new Date().toLocaleString('pt-BR')}\n` +
        `Duração Total   : ${durFormatada}\n` +
        `Total Mensagens : ${msgsList.length}\n` +
        `========================================================================\n` +
        `HISTÓRICO COMPLETO DE MENSAGENS / TRANSCRIÇÃO:\n` +
        `========================================================================\n\n`;

      for (const m of msgsList) {
        if (m.system) continue;
        const dataStr = new Date(m.createdTimestamp).toLocaleString('pt-BR');
        const autorTag = m.author.tag;
        const ehAutor = m.author.id === tInfo.autorId;
        const tagTipo = m.author.bot ? '[BOT]' : ehAutor ? '[JOGADOR]' : '[STAFF]';
        const texto = m.cleanContent || m.content || '(Mensagem interativa / painel)';

        transcriptText += `[${dataStr}] ${tagTipo} ${autorTag}:\n${texto}\n`;

        if (m.attachments && m.attachments.size > 0) {
          for (const att of m.attachments.values()) {
            transcriptText += `   [Anexo: ${att.url}]\n`;
          }
        }
        transcriptText += '\n';
      }

      transcriptText += `========================================================================\n` +
        `                       FIM DO HISTÓRICO DE LOG                          \n` +
        `========================================================================\n`;

      const canalLog = getChannel(guild, 'log-tickets');
      if (canalLog) {
        // Assegura permissões do canal de log (somente leitura para membros, bloqueado contra edições e envio)
        await canalLog.permissionOverwrites.edit(guild.roles.everyone.id, {
          ViewChannel: true,
          ReadMessageHistory: true,
          SendMessages: false,
          SendMessagesInThreads: false,
          CreatePublicThreads: false,
          CreatePrivateThreads: false,
          AddReactions: false,
        }).catch(() => {});

        const embedLog = new EmbedBuilder()
          .setColor('#2ECC71')
          .setAuthor({
            name: `NosleiraOT 7.4 • Registro de Atendimento #${tInfo.id}`,
            iconURL: guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL(),
          })
          .setTitle(`📋  Ticket #${tInfo.id} Encerrado — ${tInfo.categoriaEmoji} ${tInfo.categoria}`)
          .setDescription(
            `O atendimento foi **concluído e resolvido** com sucesso!\n` +
            `O histórico completo e imutável de mensagens está registrado e anexado abaixo.\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
          )
          .addFields(
            { name: '🆔 Protocolo', value: `\`#${tInfo.id}\``, inline: true },
            { name: '👤 Jogador', value: tInfo.autorId ? `<@${tInfo.autorId}> (\`${tInfo.autorNome}\`)` : `\`${tInfo.autorNome}\``, inline: true },
            { name: '📁 Categoria', value: `${tInfo.categoriaEmoji} **${tInfo.categoria}**`, inline: true },
            { name: '🛡️ Atendente / Staff', value: tInfo.atendenteId ? `<@${tInfo.atendenteId}> (\`${tInfo.atendenteCargo || 'Staff'}\`)` : '`Equipe de Atendimento`', inline: true },
            { name: '🔒 Encerrado por', value: `${member} (\`${member.displayName}\`)`, inline: true },
            { name: '⏱️ Duração', value: `\`${durFormatada}\``, inline: true },
            { name: '📅 Abertura', value: `<t:${Math.floor(tInfo.criadaEm / 1000)}:f>`, inline: true },
            { name: '📅 Fechamento', value: agora(), inline: true },
            { name: '💬 Mensagens', value: `\`${msgsList.length} registradas\``, inline: true },
          )
          .setFooter({ text: `NosleiraOT • Histórico Oficial de Atendimento • #${tInfo.id}`, iconURL: client.user.displayAvatarURL() })
          .setTimestamp();

        const transcriptAttachment = new AttachmentBuilder(Buffer.from(transcriptText, 'utf-8'), {
          name: `transcript-ticket-${tInfo.id}.txt`,
        });

        await canalLog.send({
          embeds: [embedLog],
          files: [transcriptAttachment],
        }).catch((err) => console.error('[LogTickets] Erro ao enviar log:', err.message));
      }

      await channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#2ECC71')
            .setDescription(`🔒 Ticket finalizado por **${member.displayName}**.\nO histórico completo foi arquivado em **Log-Tickets**. Excluindo canal em 5 segundos...`),
        ],
      });

      setTimeout(() => channel.delete('Ticket finalizado com histórico salvo em log').catch(() => {}), 5000);
    } catch (err) {
      console.error('[confirm_close] Erro:', err.message);
    }
    return;
  }
});

// ═══════════════════════════════════════════════════════════════════
//  AFK AUTO-MUTE + GAMIFICAÇÃO EM CALL DE VOZ
// ═══════════════════════════════════════════════════════════════════
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  try {
    const member = newState.member || oldState.member;
    if (!member || member.user.bot) return;
    const id = member.id;

    // Desmuta e torna audível automaticamente em canais normais de voz
    if (newState.channel && !newState.channel.name.includes('💤') && !newState.channel.name.toLowerCase().includes('afk')) {
      if (newState.serverMute) await newState.setMute(false, 'Canal Normal de Voz').catch(() => {});
      if (newState.serverDeaf) await newState.setDeaf(false, 'Canal Normal de Voz').catch(() => {});
    }

    // Tempo de Atividade em Call
    const mudou = !oldState.channel || !newState.channel || oldState.channel.id !== newState.channel.id;
    if (mudou && oldState.channel && voiceDesde.has(id)) {
      const ini = voiceDesde.get(id);
      voiceDesde.delete(id);
      if (!oldState.channel.name.includes('💤')) {
        const min = Math.floor((Date.now() - ini) / 60000);
        if (min > 0) {
          const a = atividade[id] || { voiceMin: 0, msgs: 0 };
          a.voiceMin = (a.voiceMin || 0) + min;
          atividade[id] = a;
          atividadeDirty = true;
          await checkNivel(member);
        }
      }
    }
    if (mudou && newState.channel && !newState.channel.name.includes('💤')) {
      voiceDesde.set(id, Date.now());
    }
  } catch (err) {
    console.error('[VoiceStateUpdate] Erro:', err.message);
  }
});

// ═══════════════════════════════════════════════════════════════════
//  READY
// ═══════════════════════════════════════════════════════════════════
client.once(Events.ClientReady, async () => {
  console.log('═══════════════════════════════════════════════');
  console.log(`🤖  Bot Online e 100% Ativo: ${client.user.tag}`);
  console.log('🎫  Tickets Anti-Timeout:      ATIVO');
  console.log('🏆  Anúncios de Up em Ranks:   ATIVO');
  console.log('🎥  Comandos de Mídia & Lives: ATIVO');
  console.log('👥  Contador de Membros:       ATIVO');
  console.log('═══════════════════════════════════════════════');

  client.user.setActivity('NosleiraOT 7.4', { type: ActivityType.Playing });

  const guild = client.guilds.cache.get(GUILD_ID);
  if (guild) {
    // Desconecta o bot principal de qualquer canal de voz (função exclusiva do NosleiraOT-DJ)
    const me = guild.members.me;
    if (me && me.voice && me.voice.channel) {
      await me.voice.disconnect().catch(() => {});
    }

    await atualizarContadorMembros(guild);
    setInterval(() => atualizarContadorMembros(guild), 10 * 60 * 1000);

    setInterval(() => {
      if (atividadeDirty) {
        salvarJSON(ATIVIDADE_FILE, atividade);
        atividadeDirty = false;
      }
    }, 5 * 60 * 1000);
  }
});

// ─────────────────────────────────────────────
//  PREVENÇÃO GLOBAL DE CRASHES
// ─────────────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection]:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]:', err);
});

client.login(TOKEN);
