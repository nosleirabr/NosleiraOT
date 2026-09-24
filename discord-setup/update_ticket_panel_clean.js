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

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

async function limparCanal(canal) {
  try {
    const msgs = await canal.messages.fetch({ limit: 50 }).catch(() => null);
    if (!msgs || msgs.size === 0) return;
    for (const m of msgs.values()) {
      await m.delete().catch(() => {});
    }
  } catch (err) {
    console.warn(`Erro ao limpar #${canal.name}:`, err.message);
  }
}

client.once('ready', async () => {
  console.log(`🤖 Atualizando painel de tickets limpo e conciso com ${client.user.tag}...`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) {
    console.error('❌ Servidor não encontrado!');
    process.exit(1);
  }

  await guild.channels.fetch();

  const botAvatar = client.user.displayAvatarURL({ dynamic: true, size: 512 });
  const guildIcon = guild.iconURL({ dynamic: true, size: 512 }) || botAvatar;

  const chTicket = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildText && (
      c.name.toLowerCase().includes('ticket') ||
      c.name.normalize('NFKD').toLowerCase().includes('ticket')
    )
  );

  if (!chTicket) {
    console.error('Canais disponíveis:');
    guild.channels.cache.forEach(c => console.log(`- ${c.name} (${c.type})`));
    process.exit(1);
  }

  console.log(`Limpando e recriando painel em #${chTicket.name}...`);
  await limparCanal(chTicket);

  const embedTicket = new EmbedBuilder()
    .setColor('#E67E22')
    .setAuthor({
      name: 'NosleiraOT 7.4 • Central de Suporte & Atendimento',
      iconURL: guildIcon,
    })
    .setTitle('🛡️  Central de Atendimento Oficial')
    .setDescription(
      'Bem-vindo ao suporte oficial do **NosleiraOT**!\n' +
      'Nosso atendimento é individual, seguro e feito diretamente pela nossa equipe.'
    )
    .addFields(
      {
        name: '📂  Departamentos de Atendimento (P1 a P9)',
        value: [
          '> 👑 `P1` **Falar com o Dono** — Direção e sigilo',
          '> 🐛 `P2` **Bug no Jogo** — Erros técnicos e mapa',
          '> 🚨 `P3` **Denúncias** — Trapaças e conduta',
          '> 💳 `P4` **Pagamentos** — PIX e comprovantes',
          '> 🎁 `P5` **Item Donate** — Entrega de pacotes',
          '> 👤 `P6` **Conta** — Acesso e dados cadastrais',
          '> 🔑 `P7` **Recover Key** — Chave de segurança',
          '> 🔓 `P8` **Remover 2FA** — Desativar dois fatores',
          '> ❓ `P9` **Dúvidas Gerais** — Informações e gameplay',
        ].join('\n'),
        inline: false,
      },
      {
        name: '📋  Como abrir o seu Atendimento?',
        value: [
          '1️⃣ Clique no botão verde **🎫 Abrir Ticket de Suporte** abaixo.',
          '2️⃣ Escolha o departamento correspondente ao seu caso.',
          '3️⃣ Um **subtópico privado e seguro** será criado para você.',
          '4️⃣ Envie os dados solicitados para que nossa equipe lhe ajude.',
        ].join('\n'),
        inline: false,
      },
      {
        name: '🕒  Informações & Diretrizes',
        value:
          '> 🔒 **Privacidade:** Seu atendimento é 100% privado e visível apenas à equipe.\n' +
          '> ⚡ **Agilidade:** Atendemos cada chamado com rapidez e dedicação.\n' +
          '> 📌 **Dica:** Descreva seu caso com detalhes no subtópico aberto.',
        inline: false,
      }
    )
    .setFooter({ text: 'NosleiraOT 7.4 • Suporte Oficial 24/7', iconURL: botAvatar })
    .setTimestamp();

  const rowTicket = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('create_ticket')
      .setLabel('🎫  Abrir Ticket de Suporte')
      .setStyle(ButtonStyle.Success)
  );

  await chTicket.send({
    embeds: [embedTicket],
    components: [rowTicket],
  });

  console.log('✅ Painel de tickets atualizado com sucesso e layout 100% limpo!');
  process.exit(0);
});

client.login(process.env.TOKEN);
