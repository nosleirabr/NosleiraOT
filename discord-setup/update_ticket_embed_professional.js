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
  } catch (err) {}
}

client.once('ready', async () => {
  console.log(`🤖 Atualizando canal de tickets: ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  const chTicket = guild.channels.cache.find(
    (c) => c.name.includes('🔴') && c.type === ChannelType.GuildText
  );

  if (!chTicket) {
    console.error('❌ Canal de tickets não encontrado!');
    process.exit(1);
  }

  await limparCanal(chTicket);

  const embedTicket = new EmbedBuilder()
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

  const rowTicket = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('create_ticket')
      .setLabel('🎫  Abrir Ticket de Suporte')
      .setStyle(ButtonStyle.Success)
  );

  await chTicket.send({ embeds: [embedTicket], components: [rowTicket] });
  console.log('✅ Embed de tickets ultra profissional publicado com sucesso!');
  process.exit(0);
});

client.login(process.env.TOKEN);
