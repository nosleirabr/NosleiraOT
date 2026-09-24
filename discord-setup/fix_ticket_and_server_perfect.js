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

async function limparCanal(canal) {
  try {
    const msgs = await canal.messages.fetch({ limit: 50 }).catch(() => null);
    if (!msgs || msgs.size === 0) return;
    for (const m of msgs.values()) {
      await m.delete().catch(() => {});
    }
  } catch (err) {}
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
  // 1. CANAL DE MEMBROS (【👥】 𝐌𝐞𝐦𝐛𝐫𝐨𝐬:)
  // ─────────────────────────────────────────────
  const catMC = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && c.name.includes('𝐌𝐄𝐌𝐁𝐄𝐑 𝐂𝐎𝐔𝐍𝐓')
  );

  const members = await guild.members.fetch().catch(() => null);
  const total = members ? members.filter((m) => !m.user.bot).size : guild.memberCount;
  const online = members
    ? members.filter((m) => m.presence && m.presence.status !== 'offline' && !m.user.bot).size
    : 1;

  const nomeMembrosUnificado = `【👥】 ${toBoldSerif('Membros')}: 🟢[${online}] 🔴[${total}]`;

  const chMembros = guild.channels.cache.find(
    (c) => (c.name.includes('Membros') || c.name.includes('👥')) && c.type === ChannelType.GuildVoice
  );

  if (chMembros) {
    const parentId = chMembros.parentId || (catMC ? catMC.id : null);
    await chMembros.delete('Recriando com novo padrão 【👥】').catch(() => {});
    await guild.channels.create({
      name: nomeMembrosUnificado,
      type: ChannelType.GuildVoice,
      parent: parentId,
      position: 0,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionFlagsBits.Connect],
          allow: [PermissionFlagsBits.ViewChannel],
        },
      ],
    });
    console.log(`✅ Canal de Membros atualizado: "${nomeMembrosUnificado}"`);
  }

  // ─────────────────────────────────────────────
  // 2. CANAL DE BOAS-VINDAS (【👋】𝐁𝐞𝐦-𝐕𝐢𝐧𝐝𝐨𝐬)
  // ─────────────────────────────────────────────
  const chBV = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildText && (
      c.name.includes('Bem-Vindos') ||
      c.name.includes('𝐁𝐞𝐦-𝐕𝐢𝐧𝐝𝐨𝐬') ||
      c.name.includes('welcome')
    )
  );

  const chLinks = guild.channels.cache.find((c) => c.name.includes('Links') || c.name.includes('𝗟𝗶𝗻𝗸𝘀'));
  const chTicketBR = guild.channels.cache.find((c) => c.name.includes('Ticket-BR') || c.name.includes('𝗧𝗶𝗰𝗸𝗲𝘁-𝗕𝗥'));
  const chRegras = guild.channels.cache.find((c) => c.name.includes('Regras') || c.name.includes('𝗥𝗲𝗴𝗿𝗮𝘀'));

  if (chBV) {
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
        (chTicketBR ? `🎫 **Central de Suporte:** <#${chTicketBR.id}>\n` : '') +
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

    await chBV.send({
      embeds: [embedBV],
      components: [rowBV],
      files: files.length > 0 ? files : undefined,
    });
    console.log(`✅ Canal de Boas-Vindas atualizado sem texto extra!`);
  }

  // ─────────────────────────────────────────────
  // 3. CANAL DE TICKET (【🔴】Ticket-BR - FORMATO PERFEITO)
  // ─────────────────────────────────────────────
  if (chTicketBR) {
    await limparCanal(chTicketBR);

    const embedTicket = new EmbedBuilder()
      .setColor('#E67E22')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Central de Suporte & Atendimento',
        iconURL: guildIcon,
      })
      .setTitle('🛡️  Central de Suporte Oficial')
      .setDescription(
        'Bem-vindo ao suporte do **NosleiraOT**! Nosso sistema garante um atendimento individual, rápido e seguro diretamente com a nossa equipe.\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '📂  Departamentos & Escala de Prioridade (P1 a P9)',
          value: [
            '> 👑 `[P1]` **Falar com o Dono** — Assuntos sigilosos e exclusivos diretamente com a Direção.',
            '> 🐛 `[P2]` **Bug no Jogo** — Falhas críticas, bugs de dupe, mapa, magias ou monstros.',
            '> 🚨 `[P3]` **Denúncias** — Reporte de trapaças, botters, ofensas ou violações de regras.',
            '> 💳 `[P4]` **Problemas com Pagamento** — Confirmações de PIX, doações e transações.',
            '> 🎁 `[P5]` **Item de Donate** — Suporte para entrega ou dúvidas sobre itens adquiridos.',
            '> 👤 `[P6]` **Problemas com Conta** — Acesso, bloqueios e dados cadastrais.',
            '> 🔑 `[P7]` **Recover Key** — Recuperação ou solicitação de chave de segurança.',
            '> 🔓 `[P8]` **Remover 2FA** — Desativação de autenticação de dois fatores.',
            '> ❓ `[P9]` **Dúvidas Gerais** — Informações sobre gameplay, rates e sistemas.',
          ].join('\n'),
          inline: false,
        },
        {
          name: '⚖️  Ordem de Atendimento por Prioridade',
          value: [
            '📌 **Atenção:** Os chamados são atendidos estritamente por **Ordem de Prioridade (P1 a P9)**, e **NÃO** apenas pela ordem de chegada.',
            '⚡ Chamados de emergência (`Bugs Críticos` e `Denúncias`) são priorizados pela equipe antes de solicitações cadastrais ou dúvidas gerais.',
          ].join('\n'),
          inline: false,
        },
        {
          name: '📋  Como funciona o Atendimento?',
          value: [
            '1️⃣ Clique no botão verde **`🎫 Abrir Ticket`** abaixo.',
            '2️⃣ Escolha o departamento correspondente à sua solicitação.',
            '3️⃣ Um **subtópico privado e seguro** será aberto exclusivamente para você.',
            '4️⃣ Nossa equipe responderá conforme a classificação de prioridade.',
          ].join('\n'),
          inline: false,
        }
      )
      .setThumbnail(guildIcon)
      .setFooter({ text: 'NosleiraOT 7.4 • Suporte Oficial 24/7', iconURL: botAvatar })
      .setTimestamp();

    const rowTicket = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('🎫 Abrir Ticket de Suporte')
        .setStyle(ButtonStyle.Success)
    );

    await chTicketBR.send({ embeds: [embedTicket], components: [rowTicket] });
    console.log(`✅ Painel de Ticket reestruturado perfeitamente em ${chTicketBR.name}!`);
  }

  console.log('\n🎉 TUDO CORRIGIDO E ATUALIZADO COM SUCESSO!');
  process.exit(0);
});

client.login(process.env.TOKEN);
