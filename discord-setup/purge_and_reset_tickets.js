const {
  Client,
  GatewayIntentBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

async function limparMensagens(canal) {
  try {
    let msgs = await canal.messages.fetch({ limit: 100 }).catch(() => null);
    while (msgs && msgs.size > 0) {
      for (const m of msgs.values()) {
        await m.delete().catch(() => {});
      }
      msgs = await canal.messages.fetch({ limit: 100 }).catch(() => null);
    }
  } catch (err) {
    console.error(`Erro ao limpar mensagens de ${canal.name}:`, err.message);
  }
}

client.once('ready', async () => {
  console.log(`🤖 Iniciando faxina completa de tickets e logs: ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  const botAvatar = client.user.displayAvatarURL({ dynamic: true, size: 512 });
  const guildIcon = guild.iconURL({ dynamic: true, size: 512 }) || botAvatar;

  // 1. Deletar todos os subtópicos / threads de tickets abertos
  const chTicketBR = guild.channels.cache.find((c) => c.name.includes('𝗧𝗶𝗰𝗸𝗲𝘁-𝗕𝗥') || c.name.includes('Ticket-BR'));
  if (chTicketBR) {
    const threads = await chTicketBR.threads.fetchActive().catch(() => null);
    if (threads && threads.threads) {
      for (const t of threads.threads.values()) {
        console.log(`🗑️ Deletando subtópico ativo: ${t.name}`);
        await t.delete('Limpeza geral de tickets');
      }
    }
    const archivedThreads = await chTicketBR.threads.fetchArchived().catch(() => null);
    if (archivedThreads && archivedThreads.threads) {
      for (const t of archivedThreads.threads.values()) {
        console.log(`🗑️ Deletando subtópico arquivado: ${t.name}`);
        await t.delete('Limpeza geral de tickets');
      }
    }
  }

  // 2. Deletar canais de texto soltos que começam com "ticket-"
  const canaisSoltos = guild.channels.cache.filter(
    (c) => c.name.toLowerCase().startsWith('ticket-') && c.type === ChannelType.GuildText
  );
  for (const c of canaisSoltos.values()) {
    console.log(`🗑️ Deletando canal de ticket solto: ${c.name}`);
    await c.delete('Limpeza de tickets soltos');
  }

  // 3. Limpar histórico do canal 【📋】𝗟𝗼𝗴-𝗧𝗶𝗰𝗸𝗲𝘁𝘀
  const chLog = guild.channels.cache.find((c) => c.name.includes('𝗟𝗼𝗴-𝗧𝗶𝗰𝗸𝗲𝘁𝘀') || c.name.includes('Log-Tickets'));
  if (chLog) {
    console.log(`🧹 Limpando todas as mensagens de ${chLog.name}...`);
    await limparMensagens(chLog);
    console.log(`✅ Canal de Logs limpo e 100% zerado!`);
  }

  // 4. Limpar e repostar o painel oficial em 【🔴】𝗧𝗶𝗰𝗸𝗲𝘁-𝗕𝗥
  if (chTicketBR) {
    console.log(`🧹 Limpando chat de ${chTicketBR.name}...`);
    await limparMensagens(chTicketBR);

    const embedTicket = new EmbedBuilder()
      .setColor('#E67E22')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Central de Suporte & Atendimento',
        iconURL: guildIcon,
      })
      .setTitle('🎫  Precisa de Ajuda? Abra um Atendimento!')
      .setDescription(
        'Nossa equipe de suporte está pronta para te atender com agilidade e total segurança!\n\n' +
        '**Departamentos Disponíveis:**\n' +
        '> 👑 **Falar com o Dono** (Assuntos exclusivos)\n' +
        '> 🎁 **Item de Donate** & 💳 **Problemas com Pagamento**\n' +
        '> 🐛 **Bug no Jogo** & 🚨 **Denúncias**\n' +
        '> 👤 **Problema com Conta**, 🔑 **Recover Key** & 🔓 **Remover 2FA**\n' +
        '> ❓ **Dúvidas Gerais**\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        '👉 **Clique no botão verde abaixo para iniciar seu atendimento:**'
      )
      .setThumbnail(guildIcon)
      .setFooter({ text: 'NosleiraOT 7.4 • Atendimento 24/7', iconURL: botAvatar })
      .setTimestamp();

    const rowTicket = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('🎫 Abrir Atendimento')
        .setStyle(ButtonStyle.Success)
    );

    await chTicketBR.send({ embeds: [embedTicket], components: [rowTicket] });
    console.log(`✅ Painel de Ticket repostado com sucesso em ${chTicketBR.name}!`);
  }

  // 5. Resetar arquivos JSON locais de tickets para reiniciar contagem em #0001
  const DATA_DIR = path.join(__dirname, 'data');
  fs.writeFileSync(path.join(DATA_DIR, 'tickets_historico.json'), JSON.stringify({}, null, 2), 'utf8');
  fs.writeFileSync(path.join(DATA_DIR, 'ticket_cooldowns.json'), JSON.stringify({}, null, 2), 'utf8');
  console.log(`✅ Arquivos de histórico e cooldowns zerados localmente!`);

  console.log('\n🎉 LIMPEZA DE TICKETS E LOGS CONCLUÍDA COM SUCESSO!');
  process.exit(0);
});

client.login(process.env.TOKEN);
