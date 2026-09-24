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

async function limparCanal(canal) {
  try {
    const msgs = await canal.messages.fetch({ limit: 50 }).catch(() => null);
    if (!msgs || msgs.size === 0) return;
    for (const m of msgs.values()) {
      await m.delete().catch(() => {});
      await sleep(100);
    }
  } catch (err) {}
}

client.once('ready', async () => {
  console.log(`🤖 Aplicando ícones exatos 〔 emoji 〕: ${client.user.tag}`);
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch().catch(() => {});

  // 1. Categorias exatas originais
  const catDefs = [
    { name: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', pos: 0 },
    { name: '[ 🎫 ] 𝗔𝗧𝗘𝗡𝗗𝗜𝗠𝗘𝗡𝗧𝗢 𝗘 𝗦𝗨𝗣𝗢𝗥𝗧𝗘', pos: 1 },
    { name: '[ 🎮 ] 𝗖𝗢𝗠𝗨𝗡𝗜𝗗𝗔𝗗𝗘 𝗘 𝗠𝗜𝗗𝗜𝗔', pos: 2 },
    { name: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', pos: 3 },
  ];

  const catMap = {};
  for (const c of catDefs) {
    let cat = guild.channels.cache.find(
      (ch) => ch.name.includes(c.name.slice(6, 15)) && ch.type === ChannelType.GuildCategory
    );
    if (!cat) {
      cat = await guild.channels.create({
        name: c.name,
        type: ChannelType.GuildCategory,
        position: c.pos,
      });
    } else {
      await cat.setName(c.name).catch(() => {});
      await cat.setPosition(c.pos).catch(() => {});
    }
    catMap[c.name] = cat;
    await sleep(200);
  }

  // 2. Canais com o formato 〔 emoji 〕 Nome
  const canaisOriginais = [
    // Informações e Comandos
    { match: 'comandos', nome: '〔 🤖 〕 Comandos-Geral', cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', tipo: ChannelType.GuildText, pos: 0 },
    { match: 'comunicados', nome: '〔 📢 〕 Comunicados', cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', tipo: ChannelType.GuildText, pos: 1 },
    { match: 'atualiza', nome: '〔 ✍🏻 〕 Atualizacoes', cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', tipo: ChannelType.GuildText, pos: 2 },
    { match: 'links', nome: '〔 🔱 〕 Links', cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', tipo: ChannelType.GuildText, pos: 3 },
    { match: 'ranks', nome: '〔 🏆 〕 Ranks', cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', tipo: ChannelType.GuildText, pos: 4 },
    { match: 'regras', nome: '〔 ⛔ 〕 Regras', cat: '[ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦', tipo: ChannelType.GuildText, pos: 5 },

    // Atendimento e Suporte
    { match: 'ticket-br', nome: '〔 🔴 〕 Ticket-BR', cat: '[ 🎫 ] 𝗔𝗧𝗘𝗡𝗗𝗜𝗠𝗘𝗡𝗧𝗢 𝗘 𝗦𝗨𝗣𝗢𝗥𝗧𝗘', tipo: ChannelType.GuildText, pos: 0 },
    { match: 'log-tickets', nome: '〔 📋 〕 Log-Tickets', cat: '[ 🎫 ] 𝗔𝗧𝗘𝗡𝗗𝗜𝗠𝗘𝗡𝗧𝗢 𝗘 𝗦𝗨𝗣𝗢𝗥𝗧𝗘', tipo: ChannelType.GuildText, pos: 1 },
    { match: 'staff-voice', nome: '〔 🔊 〕 Staff-Voice', cat: '[ 🎫 ] 𝗔𝗧𝗘𝗡𝗗𝗜𝗠𝗘𝗡𝗧𝗢 𝗘 𝗦𝗨𝗣𝗢𝗥𝗧𝗘', tipo: ChannelType.GuildVoice, pos: 2 },

    // Comunidade e Mídia
    { match: 'streamers', nome: '〔 🎥 〕 Streamers', cat: '[ 🎮 ] 𝗖𝗢𝗠𝗨𝗡𝗜𝗗𝗔𝗗𝗘 𝗘 𝗠𝗜𝗗𝗜𝗔', tipo: ChannelType.GuildText, pos: 0 },
    { match: 'screenshots', nome: '〔 📸 〕 Screenshots', cat: '[ 🎮 ] 𝗖𝗢𝗠𝗨𝗡𝗜𝗗𝗔𝗗𝗘 𝗘 𝗠𝗜𝗗𝗜𝗔', tipo: ChannelType.GuildText, pos: 1 },
    { match: 'clips', nome: '〔 📺 〕 Clips', cat: '[ 🎮 ] 𝗖𝗢𝗠𝗨𝗡𝗜𝗗𝗔𝗗𝗘 𝗘 𝗠𝗜𝗗𝗜𝗔', tipo: ChannelType.GuildText, pos: 2 },

    // Voz
    { match: 'geral 1', nome: '〔 🔊 〕 Geral 1', cat: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', tipo: ChannelType.GuildVoice, pos: 0 },
    { match: 'geral 2', nome: '〔 🔊 〕 Geral 2', cat: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', tipo: ChannelType.GuildVoice, pos: 1 },
    { match: 'jogando', nome: '〔 🎮 〕 Jogando', cat: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', tipo: ChannelType.GuildVoice, pos: 2 },
    { match: 'boss', nome: '〔 🐉 〕 Boss', cat: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', tipo: ChannelType.GuildVoice, pos: 3 },
    { match: 'afk', nome: '〔 💤 〕 AFK', cat: '[ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭', tipo: ChannelType.GuildVoice, pos: 4 },
  ];

  for (const cfg of canaisOriginais) {
    const parentCat = catMap[cfg.cat];
    let ch = guild.channels.cache.find(
      (c) => (c.name.toLowerCase().includes(cfg.match) || c.name.includes(cfg.nome.slice(4, 8))) && c.type === cfg.tipo
    );

    if (ch) {
      console.log(`✏️ Ajustando "${ch.name}" -> "${cfg.nome}"`);
      await ch.setName(cfg.nome).catch((e) => console.log(`   ${e.message}`));
      if (parentCat) await ch.setParent(parentCat.id).catch(() => {});
      await ch.setPosition(cfg.pos).catch(() => {});
    } else {
      ch = await guild.channels.create({
        name: cfg.nome,
        type: cfg.tipo,
        parent: parentCat?.id,
        position: cfg.pos,
      });
      console.log(`➕ Canal criado: ${cfg.nome}`);
    }
    await sleep(400);
  }

  // 3. Canal Membros
  let chMembros = guild.channels.cache.find(
    (c) => (c.name.includes('Membros') || c.name.includes('👥'))
  );
  if (chMembros) {
    await chMembros.setName('【👥】𝗠𝗲𝗺𝗯𝗿𝗼𝘀🟢1🔴0').catch(() => {});
  }

  console.log('\n🎉 Todos os canais foram renomeados com os ícones exatos 〔 emoji 〕!');
  process.exit(0);
});

client.login(TOKEN);
