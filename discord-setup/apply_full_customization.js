const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_RATELIMIT')), ms)),
  ]);

// Mapeamento para Sans-Serif Bold (padrão do Screenshots: 𝗦𝗰𝗿𝗲𝗲𝗻𝘀𝗵𝗼𝘁𝘀)
function toBoldSans(text) {
  const map = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜',
    'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥',
    'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶',
    'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿',
    's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵',
    'ç': 'ç', 'õ': 'õ', 'ã': 'ã', 'é': 'é', 'ê': 'ê', 'í': 'í', 'ó': 'ó', 'ú': 'ú'
  };
  return (text || '').split('').map((char) => map[char] || char).join('');
}

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
  TWITCH:       'https://www.twitch.tv/nosleiraot',
};

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
  console.log(`🤖 Aplicando padronização total, cores de botões e permissões: ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.roles.fetch();
  await guild.channels.fetch();

  // ─────────────────────────────────────────────
  // 1. PADRONIZAÇÃO DE NOMES DE CANAIS
  // ─────────────────────────────────────────────
  const canaisTexto = [
    { match: 'comandos', nome: `【🤖】 ${toBoldSans('Comandos-Geral')}` },
    { match: 'comunicados', nome: `【📢】 ${toBoldSans('Comunicados')}` },
    { match: 'atualizac', nome: `【✍🏻】 ${toBoldSans('Atualizacoes')}` },
    { match: 'links', nome: `【🔱】 ${toBoldSans('Links')}` },
    { match: 'ranks', nome: `【🏆】 ${toBoldSans('Ranks')}` },
    { match: 'regras', nome: `【⛔】 ${toBoldSans('Regras')}` },
    { match: 'ticket-br', nome: `【🔴】 ${toBoldSans('Ticket-BR')}` },
    { match: 'log-tickets', nome: `【📋】 ${toBoldSans('Log-Tickets')}` },
    { match: 'streamers', nome: `【🎥】 ${toBoldSans('Streamers')}` },
    { match: 'screenshots', nome: `【📸】 ${toBoldSans('Screenshots')}` },
    { match: 'clips', nome: `【📺】 ${toBoldSans('Clips')}` },
  ];

  for (const item of canaisTexto) {
    const ch = guild.channels.cache.find(
      (c) => c.type === ChannelType.GuildText && (
        c.name.toLowerCase().includes(item.match) ||
        c.name.normalize('NFKD').toLowerCase().includes(item.match)
      )
    );
    if (ch && ch.name !== item.nome) {
      console.log(`💬 Renomeando Texto: "${ch.name}" -> "${item.nome}"`);
      try {
        await withTimeout(ch.setName(item.nome), 3000);
        console.log(`   ✅ "${item.nome}" atualizado!`);
      } catch (e) {
        console.log(`   ⚠️ Pulando "${item.nome}": ${e.message}`);
      }
      await sleep(200);
    }
  }

  const canaisVoz = [
    { match: 'staff-voice', nome: `【🔊】 ${toBoldSans('Staff-Voice')}` },
    { match: 'geral 1', nome: `【🔊】 ${toBoldSans('Geral 1')}` },
    { match: 'geral 2', nome: `【🔊】 ${toBoldSans('Geral 2')}` },
    { match: 'jogando', nome: `【🎮】 ${toBoldSans('Jogando')}` },
    { match: 'boss', nome: `【🐉】 ${toBoldSans('Boss')}` },
    { match: 'afk', nome: `【💤】 ${toBoldSans('AFK')}` },
  ];

  for (const item of canaisVoz) {
    const ch = guild.channels.cache.find(
      (c) => c.type === ChannelType.GuildVoice && !c.name.includes('Membros') && !c.name.includes('👥') && (
        c.name.toLowerCase().includes(item.match) ||
        c.name.normalize('NFKD').toLowerCase().includes(item.match)
      )
    );
    if (ch && ch.name !== item.nome) {
      console.log(`🎙️ Renomeando Voz: "${ch.name}" -> "${item.nome}"`);
      try {
        await withTimeout(ch.setName(item.nome), 3000);
        console.log(`   ✅ "${item.nome}" atualizado!`);
      } catch (e) {
        console.log(`   ⚠️ Pulando "${item.nome}": ${e.message}`);
      }
      await sleep(200);
    }
  }

  // ─────────────────────────────────────────────
  // 2. CADEADINHO (PERMISSÕES DOS CANAIS INFORMATIVOS)
  // ─────────────────────────────────────────────
  const canaisBloqueados = ['comandos', 'comunicados', 'atualizac', 'links', 'ranks', 'regras'];
  const roleDono = guild.roles.cache.find((r) => r.name.includes('Dono'));
  const roleAdmin = guild.roles.cache.find((r) => r.name.includes('Administrador'));

  for (const key of canaisBloqueados) {
    const ch = guild.channels.cache.find(
      (c) => c.type === ChannelType.GuildText && (
        c.name.toLowerCase().includes(key) ||
        c.name.normalize('NFKD').toLowerCase().includes(key)
      )
    );
    if (ch) {
      // Bloqueia @everyone de digitar
      await ch.permissionOverwrites.edit(guild.roles.everyone, {
        SendMessages: false,
        AddReactions: false,
        CreatePublicThreads: false,
        CreatePrivateThreads: false,
        SendMessagesInThreads: false,
      });

      // Libera Dono e Administrador para postar
      if (roleDono) {
        await ch.permissionOverwrites.edit(roleDono, {
          SendMessages: true,
          ManageMessages: true,
          AttachFiles: true,
        });
      }
      if (roleAdmin) {
        await ch.permissionOverwrites.edit(roleAdmin, {
          SendMessages: true,
          ManageMessages: true,
          AttachFiles: true,
        });
      }
      console.log(`🔒 Cadeadinho aplicado no canal: ${ch.name}`);
    }
  }

  // ─────────────────────────────────────────────
  // 3. PERMISSÕES RESTRITAS EM STAFF-VOICE
  // ─────────────────────────────────────────────
  const chStaffVoice = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildVoice && (
      c.name.toLowerCase().includes('staff') ||
      c.name.normalize('NFKD').toLowerCase().includes('staff')
    )
  );

  if (chStaffVoice) {
    const rolesStaffPermitidos = [
      '💠 Dono',
      '👑 Administrador',
      '🔱 Game Master',
      '🛡️ Community Manager',
      '⭐ Sênior Tutor',
    ];

    // Bloqueia @everyone e Movedor de entrar
    await chStaffVoice.permissionOverwrites.edit(guild.roles.everyone, {
      ViewChannel: false,
      Connect: false,
      Speak: false,
      MoveMembers: false,
    });

    const roleMovedor = guild.roles.cache.find((r) => r.name.includes('Movedor'));
    if (roleMovedor) {
      await chStaffVoice.permissionOverwrites.edit(roleMovedor, {
        ViewChannel: false,
        Connect: false,
        MoveMembers: false,
      });
    }

    // Libera expressamente as patentes autorizadas da Staff
    for (const rName of rolesStaffPermitidos) {
      const r = guild.roles.cache.find((role) => role.name === rName);
      if (r) {
        await chStaffVoice.permissionOverwrites.edit(r, {
          ViewChannel: true,
          Connect: true,
          Speak: true,
          MoveMembers: true,
        });
        console.log(`   👑 Passe livre concedido para ${r.name} em Staff-Voice.`);
      }
    }
    console.log(`🔒 Permissões restritas de Staff-Voice 100% configuradas!`);
  }

  // ─────────────────────────────────────────────
  // 4. REPAGINAR CANAL #LINKS COM BOTÕES COLORIDOS
  // ─────────────────────────────────────────────
  const chLinks = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildText && (
      c.name.toLowerCase().includes('links') ||
      c.name.normalize('NFKD').toLowerCase().includes(key = 'links')
    )
  );

  if (chLinks) {
    await limparCanal(chLinks);

    const embedLinks = new EmbedBuilder()
      .setColor('#E67E22')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Central Oficial de Links & Redes',
        iconURL: guild.iconURL() || 'https://img.icons8.com/fluency/96/link.png',
      })
      .setTitle('🌐  Redes Sociais & Canais Oficiais')
      .setDescription(
        'Acesse todas as plataformas oficiais do **NosleiraOT** com total segurança pelos botões abaixo!\n\n' +
        '⚠️ **Atenção:** Nunca acesse links suspeitos enviados por terceiros no privado. Use apenas os canais oficiais.\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '📱  Lista de Redes Oficiais',
          value: [
            `🌐 **Site Oficial:** [www.nosleiraot.com](${LINKS.SITE})`,
            `🔹 **Discord Oficial:** [Entrar no Discord](${LINKS.DISCORD})`,
            `🟢 **WhatsApp Oficial:** [Grupo da Comunidade](${LINKS.WHATSAPP})`,
            `📸 **Instagram Oficial:** [@nosleiraot](${LINKS.INSTAGRAM})`,
            `🔵 **Facebook Grupo:** [Comunidade no Facebook](${LINKS.FACEBOOK_GRP})`,
            `📄 **Facebook Página:** [Página Oficial](${LINKS.FACEBOOK_PAG})`,
            `✖️ **X / Twitter:** [@NosleiraOT](${LINKS.X})`,
            `⚫ **TikTok Oficial:** [@nosleiraot](${LINKS.TIKTOK})`,
            `🟠 **Kwai Oficial:** [Canal no Kwai](${LINKS.KWAI})`,
            `🔴 **YouTube Oficial:** [@NosleiraOT](${LINKS.YOUTUBE})`,
            `🟣 **Twitch Oficial:** [Canal da Twitch](${LINKS.TWITCH})`,
          ].join('\n'),
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT 7.4 • Central de Links Segura' })
      .setTimestamp();

    // Linha 1: Site, Discord (Azul), WhatsApp (Verde), Instagram (Rosa/Roxo), Facebook Grupo (Azul)
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🌐 Site Oficial').setStyle(ButtonStyle.Link).setURL(LINKS.SITE),
      new ButtonBuilder().setLabel('🔹 Discord').setStyle(ButtonStyle.Link).setURL(LINKS.DISCORD),
      new ButtonBuilder().setLabel('🟢 WhatsApp').setStyle(ButtonStyle.Link).setURL(LINKS.WHATSAPP),
      new ButtonBuilder().setLabel('📸 Instagram').setStyle(ButtonStyle.Link).setURL(LINKS.INSTAGRAM),
      new ButtonBuilder().setLabel('🔵 Facebook Grupo').setStyle(ButtonStyle.Link).setURL(LINKS.FACEBOOK_GRP)
    );

    // Linha 2: Facebook Página (Azul), X (Preto), TikTok (Preto), Kwai (Laranja), YouTube (Vermelho)
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('📄 Facebook Página').setStyle(ButtonStyle.Link).setURL(LINKS.FACEBOOK_PAG),
      new ButtonBuilder().setLabel('✖️ X (Twitter)').setStyle(ButtonStyle.Link).setURL(LINKS.X),
      new ButtonBuilder().setLabel('⚫ TikTok').setStyle(ButtonStyle.Link).setURL(LINKS.TIKTOK),
      new ButtonBuilder().setLabel('🟠 Kwai').setStyle(ButtonStyle.Link).setURL(LINKS.KWAI),
      new ButtonBuilder().setLabel('🔴 YouTube').setStyle(ButtonStyle.Link).setURL(LINKS.YOUTUBE)
    );

    // Linha 3: Twitch (Roxo)
    const row3 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🟣 Twitch Oficial').setStyle(ButtonStyle.Link).setURL(LINKS.TWITCH)
    );

    await chLinks.send({ embeds: [embedLinks], components: [row1, row2, row3] });
    console.log('✅ Canal Links 100% atualizado com os ícones coloridos!');
  }

  console.log('🎉 Todas as solicitações foram aplicadas com sucesso!');
  process.exit(0);
});

client.login(process.env.TOKEN);
