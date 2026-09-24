const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

const BANNER_PATH = path.join(__dirname, 'assets', 'welcome_banner.jpg');
const SITE_URL = 'https://www.nosleiraot.com';

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

client.once('ready', async () => {
  console.log(`🤖 Logado como ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();
  await guild.members.fetch().catch(() => {});

  const botAvatar = client.user.displayAvatarURL({ dynamic: true, size: 512 });
  const guildIcon = guild.iconURL({ dynamic: true, size: 512 }) || botAvatar;

  // ─────────────────────────────────────────────
  // 1. FAXINA TOTAL DE TICKETS SOLTOS E SUBTÓPICOS
  // ─────────────────────────────────────────────
  console.log('🧹 1. Removendo todos os tickets antigos e subtópicos...');
  
  // Acha Ticket-BR
  const chTicketBR = guild.channels.cache.find(
    (c) => c.name.includes('𝗧𝗶𝗰𝗸𝗲𝘁-𝗕𝗥') || c.name.includes('Ticket-BR')
  );

  if (chTicketBR) {
    const active = await chTicketBR.threads.fetchActive().catch(() => null);
    if (active && active.threads) {
      for (const t of active.threads.values()) {
        console.log(`   🗑️ Deletando subtópico ativo: ${t.name}`);
        await t.delete('Limpeza').catch(() => {});
      }
    }
    const archived = await chTicketBR.threads.fetchArchived().catch(() => null);
    if (archived && archived.threads) {
      for (const t of archived.threads.values()) {
        console.log(`   🗑️ Deletando subtópico arquivado: ${t.name}`);
        await t.delete('Limpeza').catch(() => {});
      }
    }
  }

  // Deleta qualquer canal que comece com "ticket-"
  const canaisSoltos = guild.channels.cache.filter(
    (c) => c.name.toLowerCase().startsWith('ticket-') && c.type === ChannelType.GuildText
  );
  for (const c of canaisSoltos.values()) {
    console.log(`   🗑️ Deletando canal solto: ${c.name}`);
    await c.delete('Limpeza de canais soltos').catch(() => {});
  }

  // ─────────────────────────────────────────────
  // 2. CATEGORIA MEMBER COUNT & CANAL DE MEMBROS
  // ─────────────────────────────────────────────
  console.log('📊 2. Configurando Categoria e Canal de Membros (Bold Serif da Print)...');
  let catMC = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && c.name.toLowerCase().includes('member count')
  );
  const nomeCatMC = `➤ ${toBoldSerif('MEMBER COUNT')}`;
  if (!catMC) {
    catMC = await guild.channels.create({
      name: nomeCatMC,
      type: ChannelType.GuildCategory,
      position: 0,
    });
  } else if (catMC.name !== nomeCatMC) {
    await catMC.setName(nomeCatMC).catch(() => {});
  }

  const members = await guild.members.fetch().catch(() => null);
  const total = members ? members.filter((m) => !m.user.bot).size : guild.memberCount;
  const online = members
    ? members.filter((m) => m.presence && m.presence.status !== 'offline' && !m.user.bot).size
    : 1;

  const nomeMembrosExato = `⌈ 👥 ⌋ ${toBoldSerif('Membros')}: 🟢[${online}] 🔴[${total}]`;

  // Remove canais de membros antigos para não travar no rate limit e cria novo no topo
  const velhosMembros = guild.channels.cache.filter(
    (c) => (c.name.includes('Membros') || c.name.includes('👥')) && c.type === ChannelType.GuildVoice
  );
  for (const vm of velhosMembros.values()) {
    await vm.delete('Recriando com novo estilo sem rate limit').catch(() => {});
  }

  await guild.channels.create({
    name: nomeMembrosExato,
    type: ChannelType.GuildVoice,
    parent: catMC ? catMC.id : null,
    position: 0,
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.Connect],
        allow: [PermissionFlagsBits.ViewChannel],
      },
    ],
  });
  console.log(`✅ Canal de membros criado: "${nomeMembrosExato}"`);

  // ─────────────────────────────────────────────
  // 3. CANAL DE BOAS-VINDAS (【👋】ou ⌈👋⌋)
  // ─────────────────────────────────────────────
  console.log('👋 3. Configurando Canal de Boas-Vindas...');
  const catInfo = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && (
      c.name.includes('𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦') ||
      c.name.toLowerCase().includes('informac') ||
      c.name.includes('📢')
    )
  );

  const nomeBV = `⌈👋⌋・${toBoldSerif('Bem-Vindos')}`;

  const velhosBV = guild.channels.cache.filter(
    (c) => c.type === ChannelType.GuildText && (
      c.name.includes('Bem-Vindos') ||
      c.name.includes('Boas-Vindas') ||
      c.name.includes('welcome')
    )
  );
  for (const vb of velhosBV.values()) {
    await vb.delete('Recriando com estilo exato').catch(() => {});
  }

  const novoBV = await guild.channels.create({
    name: nomeBV,
    type: ChannelType.GuildText,
    parent: catInfo ? catInfo.id : null,
    position: 0,
    topic: '👋 Central oficial de boas-vindas do NosleiraOT 7.4!',
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

  const chLinks = guild.channels.cache.find((c) => c.name.includes('Links') || c.name.includes('𝗟𝗶𝗻𝗸𝘀'));
  const chRegras = guild.channels.cache.find((c) => c.name.includes('Regras') || c.name.includes('𝗥𝗲𝗴𝗿𝗮𝘀'));

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
      (chTicketBR ? `🎫 **Central de Suporte:** <#${chTicketBR.id}> — Abra seu ticket aqui.\n` : '') +
      (chRegras ? `📜 **Regras do Servidor:** <#${chRegras.id}>\n` : '') +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    )
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

  await novoBV.send({
    embeds: [embedBV],
    components: [rowBV],
    files: files.length > 0 ? files : undefined,
  });
  console.log(`✅ Canal de boas-vindas criado e publicado: "${novoBV.name}"`);

  // ─────────────────────────────────────────────
  // 4. RESET DO BANCO DE DADOS LOCAL DE TICKETS
  // ─────────────────────────────────────────────
  const DATA_DIR = path.join(__dirname, 'data');
  fs.writeFileSync(path.join(DATA_DIR, 'tickets_historico.json'), JSON.stringify({}, null, 2), 'utf8');
  fs.writeFileSync(path.join(DATA_DIR, 'ticket_cooldowns.json'), JSON.stringify({}, null, 2), 'utf8');
  console.log('✅ Banco de dados local de tickets resetado para recomeçar do #0001!');

  console.log('\n🎉 TUDO CONFIGURADO E ALINHADO COM SUCESSO!');
  process.exit(0);
});

client.login(process.env.TOKEN);
