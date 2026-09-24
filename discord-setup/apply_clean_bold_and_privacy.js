const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionFlagsBits,
} = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

const S = '\u00A0';

function toBoldSans(text) {
  const map = {
    A:'𝗔',B:'𝗕',C:'𝗖',D:'𝗗',E:'𝗘',F:'𝗙',G:'𝗚',H:'𝗛',I:'𝗜',J:'𝗝',
    K:'𝗞',L:'𝗟',M:'𝗠',N:'𝗡',O:'𝗢',P:'𝗣',Q:'𝗤',R:'𝗥',S:'𝗦',T:'𝗧',
    U:'𝗨',V:'𝗩',W:'𝗪',X:'𝗫',Y:'𝗬',Z:'𝗭',
    a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',
    k:'𝗸',l:'𝗹',m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',
    u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',y:'𝘆',z:'𝘇',
    '0':'𝟬','1':'𝟭','2':'𝟮','3':'𝟯','4':'𝟰','5':'𝟱','6':'𝟲','7':'𝟳','8':'𝟴','9':'𝟵',
    '-':'-'
  };
  return text.split('').map(c => map[c] ?? c).join('');
}

function formatarCanal(emoji, texto) {
  return `【${emoji}】${toBoldSans(texto)}`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CARGOS_STAFF = [
  '💠 Dono',
  '👑 Administrador',
  '🔱 Game Master',
  '🛡️ Community Manager',
  '⭐ Sênior Tutor',
  '🎓 Tutor',
];

client.once('ready', async () => {
  console.log(`🤖 Aplicando novo padrão visual e permissões: ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.roles.fetch().catch(() => {});
  await guild.channels.fetch().catch(() => {});

  const staffRoles = guild.roles.cache.filter((r) =>
    CARGOS_STAFF.some((s) => r.name.includes(s))
  );

  // Mapeamento dos canais com letras maiúsculas e bold Unicode sem hífens
  const canaisParaRenomear = [
    // Informações
    { match: 'comandos', novoNome: formatarCanal('🤖', 'Comandos-Geral') },
    { match: 'comunicados', novoNome: formatarCanal('📢', 'Comunicados') },
    { match: 'atualiza', novoNome: formatarCanal('✍🏻', 'Atualizações') },
    { match: 'links', novoNome: formatarCanal('🔱', 'Links') },
    { match: 'ranks', novoNome: formatarCanal('🏆', 'Ranks') },
    { match: 'regras', novoNome: formatarCanal('⛔', 'Regras') },

    // Atendimento e Suporte
    { match: 'ticket-br', novoNome: formatarCanal('🔴', 'Ticket-BR'), publico: true },
    { match: 'log-tickets', novoNome: formatarCanal('📋', 'Log-Tickets'), staffOnly: true },
    { match: 'staff-voice', novoNome: '【🔊】Staff-Voice', staffOnly: true },

    // Comunidade e Mídia
    { match: 'streamers', novoNome: formatarCanal('🎥', 'Streamers') },
    { match: 'screenshots', novoNome: formatarCanal('📸', 'Screenshots') },
    { match: 'clips', novoNome: formatarCanal('📺', 'Clips') },

    // Voz
    { match: 'geral 1', novoNome: '【🔊】Geral 1' },
    { match: 'geral 2', novoNome: '【🔊】Geral 2' },
    { match: 'jogando', novoNome: '【🎮】Jogando' },
    { match: 'boss', novoNome: '【🐉】Boss' },
    { match: 'afk', novoNome: '【💤】AFK' },
  ];

  for (const item of canaisParaRenomear) {
    const ch = guild.channels.cache.find(
      (c) => c.name.toLowerCase().includes(item.match)
    );
    if (ch) {
      console.log(`✏️ Renomeando "${ch.name}" -> "${item.novoNome}"`);
      await ch.setName(item.novoNome).catch((e) => console.log(`   ${e.message}`));

      // Se for staffOnly (Log-Tickets e Staff-Voice), esconde para membros comuns
      if (item.staffOnly) {
        const overwrites = [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
        ];
        staffRoles.forEach((r) => {
          overwrites.push({
            id: r.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.Connect,
              PermissionFlagsBits.Speak,
            ],
          });
        });
        await ch.permissionOverwrites.set(overwrites).catch(() => {});
        console.log(`   🔒 Canal "${item.novoNome}" ocultado para jogadores comuns (visível apenas para Staff)`);
      }

      await sleep(350);
    }
  }

  // Canal de contagem de membros no topo
  const chMembros = guild.channels.cache.find(
    (c) => (c.name.includes('Membros') || c.name.includes('👥')) && c.type === ChannelType.GuildVoice
  );
  if (chMembros) {
    const members = await guild.members.fetch().catch(() => null);
    const total = members ? members.filter((m) => !m.user.bot).size : guild.memberCount;
    const online = members
      ? members.filter((m) => m.presence && m.presence.status !== 'offline' && !m.user.bot).size
      : 1;
    const nomeMembros = `⌈ 👥 ⌋ Membros: 🟢[${online}] 🔴[${total}]`;
    await chMembros.setName(nomeMembros).catch(() => {});
  }

  console.log('\n🎉 Padrão visual e permissões atualizados com sucesso!');
  process.exit(0);
});

client.login(process.env.TOKEN);
