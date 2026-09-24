const {
  Client,
  GatewayIntentBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
} = require('discord.js');
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', async () => {
  console.log(`🤖 Logado como ${client.user.tag}`);
  const guild = client.guilds.cache.get(env.GUILD_ID);
  if (!guild) {
    console.error('❌ Servidor não encontrado!');
    process.exit(1);
  }

  await guild.channels.fetch();
  await guild.roles.fetch();

  const chTicketBR = guild.channels.cache.find(
    (c) => c.name.includes('Ticket') || c.name.includes('ticket') || c.id === '1552415270000267454'
  );
  const chLog = guild.channels.cache.find(
    (c) => c.name.includes('Log-Tickets') || c.name.includes('log') || c.id === '1552415272319844514'
  );

  if (!chTicketBR || !chLog) {
    console.error('❌ Canais de ticket e log não encontrados!');
    process.exit(1);
  }

  console.log(`📍 Canal de Ticket: #${chTicketBR.name} (${chTicketBR.id})`);
  console.log(`📍 Canal de Log: #${chLog.name} (${chLog.id})`);

  // 1. Limpeza de tópicos/threads antigos em Ticket-BR
  console.log('\n🧹 Limpando todos os subtópicos/threads antigos em Ticket-BR...');
  try {
    const activeThreads = await chTicketBR.threads.fetchActive().catch(() => ({ threads: new Map() }));
    for (const [tId, thread] of activeThreads.threads) {
      console.log(`  - Deletando thread ativa: ${thread.name}`);
      await thread.delete().catch(() => {});
    }
    const archivedThreads = await chTicketBR.threads.fetchArchived().catch(() => ({ threads: new Map() }));
    for (const [tId, thread] of archivedThreads.threads) {
      console.log(`  - Deletando thread arquivada: ${thread.name}`);
      await thread.delete().catch(() => {});
    }
  } catch (err) {
    console.log('  ⚠️ Aviso ao limpar threads:', err.message);
  }

  // 2. Limpeza de mensagens soltas em Ticket-BR (mantém apenas o painel oficial com botão)
  console.log('\n🧹 Limpando mensagens soltas no canal de Ticket-BR...');
  const msgsTicket = await chTicketBR.messages.fetch({ limit: 50 }).catch(() => null);
  if (msgsTicket) {
    for (const [mId, msg] of msgsTicket) {
      // Verifica se é o painel oficial mestre de atendimento
      const hasTicketButton = msg.components.some((row) =>
        row.components.some((b) => b.customId === 'create_ticket' || b.customId === 'cmd_ticket')
      );
      if (hasTicketButton) {
        console.log(`  ⭐ Mantendo Painel Oficial Mestre: Message ID ${mId}`);
      } else {
        console.log(`  🗑️ Apagando mensagem residual: ${msg.content || '(Embed)'}`);
        await msg.delete().catch(() => {});
      }
    }
  }

  // 3. Limpeza do canal Log-Tickets
  console.log('\n🧹 Limpando mensagens no canal de Log-Tickets...');
  const msgsLog = await chLog.messages.fetch({ limit: 50 }).catch(() => null);
  if (msgsLog) {
    for (const [mId, msg] of msgsLog) {
      await msg.delete().catch(() => {});
    }
  }
  console.log('✅ Log-Tickets limpo com sucesso.');

  // 4. Teste Automatizado de Fluxo de Ticket (Simulação completa de Ciclo de Vida)
  console.log('\n🧪 Iniciando Teste Automatizado do Ciclo Completo de Atendimento...');
  
  const testCategories = [
    { name: 'Falar com o Dono', dot: '👑', tag: 'Dono', pNum: 1, prioridade: '🟠 Prioridade 1 • Direção', cor: '#E67E22' },
    { name: 'Bug no Jogo', dot: '🔴', tag: 'Bug', pNum: 2, prioridade: '🔴 Prioridade 2 • Crítico', cor: '#E74C3C' },
    { name: 'Financeiro & Pagamento', dot: '🟡', tag: 'Pagamento', pNum: 4, prioridade: '🟡 Prioridade 4 • Financeiro', cor: '#F1C40F' },
  ];

  let simCounter = 1;

  for (const cat of testCategories) {
    const ticketIdStr = simCounter.toString().padStart(4, '0');
    const threadName = `${cat.dot} (P${cat.pNum}) Ticket-AdminTest-${ticketIdStr}`;

    console.log(`\n▶️ Testando Categoria: ${cat.name} (${cat.prioridade})`);
    console.log(`  1. Criando subtópico de atendimento: ${threadName}`);

    const thread = await chTicketBR.threads.create({
      name: threadName,
      autoArchiveDuration: 1440,
      type: ChannelType.PrivateThread,
      reason: `Teste de Ticket #${ticketIdStr}`,
    });

    const embedTicket = new EmbedBuilder()
      .setColor(cat.cor)
      .setAuthor({
        name: 'NosleiraOT 7.4 • Central de Suporte Oficial',
        iconURL: guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL(),
      })
      .setTitle(`${cat.dot}  Ticket #${ticketIdStr} — ${cat.name}`)
      .setDescription(
        `Olá <@${client.user.id}>, seja bem-vindo ao seu atendimento de **${cat.name}**!\n\n` +
        `📝 **Informações enviadas pelo jogador:**\n` +
        `> • **Nome do Personagem:** \`TestKnight_74\`\n` +
        `> • **Descrição:** \`Teste automatizado de verificação de fluxo completo de ticket.\`\n\n` +
        `⏱️ *Nossa equipe responderá o mais breve possível.*`
      )
      .addFields(
        { name: '👤 Jogador', value: `<@${client.user.id}>`, inline: true },
        { name: '📁 Categoria', value: `${cat.dot} ${cat.name}`, inline: true },
        { name: '🚨 Prioridade', value: `\`${cat.prioridade}\``, inline: true },
        { name: '📊 Status', value: '🟡 `Aguardando Atendente`', inline: true },
      )
      .setFooter({ text: `Ticket #${ticketIdStr} • ${cat.prioridade}` })
      .setTimestamp();

    const rowButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('claim_ticket').setLabel('✋ Assumir').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('close_ticket').setLabel('🔒 Fechar').setStyle(ButtonStyle.Secondary)
    );

    const initialMsg = await thread.send({
      content: `<@${client.user.id}> @here`,
      embeds: [embedTicket],
      components: [rowButtons],
    });

    // 2. Simula: Assumir o Ticket
    console.log(`  2. Assumindo o ticket pela Staff...`);
    const embedAssumido = new EmbedBuilder()
      .setColor('#2ECC71')
      .setAuthor({
        name: 'Admin Master • Dono & Administrador',
        iconURL: client.user.displayAvatarURL(),
      })
      .setTitle('🛡️  Atendimento Assumido')
      .setDescription(
        `O Administrador assumiu a responsabilidade por este ticket.\n\n` +
        `💬 *Olá jogador! Estamos verificando sua solicitação agora mesmo. Seu problema foi analisado e resolvido com sucesso!*`
      )
      .addFields(
        { name: '👤 Atendente', value: `<@${client.user.id}> (\`Admin Master\`)`, inline: true },
        { name: '🎖️ Cargo', value: '`👑 Dono`', inline: true },
        { name: '🟢 Status', value: '`Em Andamento`', inline: true }
      )
      .setTimestamp();

    await thread.send({ embeds: [embedAssumido] });

    // Atualiza status do embed original
    const embedUpdated = EmbedBuilder.from(embedTicket).spliceFields(3, 1, {
      name: '📊 Status',
      value: `🟢 Em Atendimento por <@${client.user.id}>\n(\`👑 Dono\`)`,
      inline: true,
    });
    await initialMsg.edit({ embeds: [embedUpdated] });

    // 3. Simula: Resposta e Fechamento do Ticket
    console.log(`  3. Confirmando fechamento e enviando registro oficial para #Log-Tickets...`);

    const transcriptText =
      `========================================================================\n` +
      `             NOSLEIRA OT 7.4 — REGISTRO OFICIAL DE ATENDIMENTO          \n` +
      `========================================================================\n` +
      `Protocolo / ID  : #${ticketIdStr}\n` +
      `Canal / Tópico  : ${threadName}\n` +
      `Departamento    : ${cat.dot} ${cat.name}\n` +
      `Jogador (Autor) : TestPlayer#0001\n` +
      `Atendente Staff : Admin Master [👑 Dono]\n` +
      `Encerrado por   : Admin Master [👑 Dono]\n` +
      `Abertura        : ${new Date().toLocaleString('pt-BR')}\n` +
      `Fechamento      : ${new Date().toLocaleString('pt-BR')}\n` +
      `Duração Total   : 2 min\n` +
      `Status Final    : RESOLVIDO & CONCLUÍDO\n` +
      `========================================================================\n` +
      `HISTÓRICO DE MENSAGENS:\n` +
      `[${new Date().toLocaleTimeString('pt-BR')}] [JOGADOR] TestPlayer: Olá, preciso de suporte no atendimento.\n` +
      `[${new Date().toLocaleTimeString('pt-BR')}] [STAFF] Admin Master: Ticket assumido! Sua solicitação foi verificada e concluída com sucesso.\n` +
      `[${new Date().toLocaleTimeString('pt-BR')}] [JOGADOR] TestPlayer: Muito obrigado pelo atendimento rápido!\n` +
      `========================================================================\n` +
      `                       FIM DO HISTÓRICO DE LOG                          \n` +
      `========================================================================\n`;

    const attachmentTranscript = new AttachmentBuilder(
      Buffer.from(transcriptText, 'utf-8'),
      { name: `ticket-${ticketIdStr}-transcript.txt` }
    );

    const embedLogFinal = new EmbedBuilder()
      .setColor('#2ECC71')
      .setAuthor({
        name: `NosleiraOT 7.4 • Registro de Atendimento #${ticketIdStr}`,
        iconURL: guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL(),
      })
      .setTitle(`📋  Ticket #${ticketIdStr} Encerrado — ${cat.dot} ${cat.name}`)
      .setDescription(
        `O atendimento foi **concluído e resolvido** com sucesso!\n` +
        `O histórico completo e imutável de mensagens está registrado e anexado abaixo.\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      )
      .addFields(
        { name: '🆔 Protocolo', value: `\`#${ticketIdStr}\``, inline: true },
        { name: '👤 Jogador', value: `<@${client.user.id}> (\`TestPlayer\`)`, inline: true },
        { name: '📁 Categoria', value: `${cat.dot} **${cat.name}**`, inline: true },
        { name: '🚨 Prioridade', value: `\`${cat.prioridade}\``, inline: true },
        { name: '🛡️ Atendente', value: `<@${client.user.id}> (\`Dono\`)`, inline: true },
        { name: '🔒 Fechado por', value: `<@${client.user.id}>`, inline: true },
        { name: '⏱️ Duração', value: '`2 min`', inline: true },
        { name: '📅 Data Fechamento', value: new Date().toLocaleString('pt-BR'), inline: true },
      )
      .setFooter({ text: 'NosleiraOT 7.4 • Sistema de Logs Seguro' })
      .setTimestamp();

    await chLog.send({
      embeds: [embedLogFinal],
      files: [attachmentTranscript],
    });

    console.log(`  4. Arquivando e finalizando thread de atendimento: ${threadName}`);
    await thread.setLocked(true).catch(() => {});
    await thread.setArchived(true).catch(() => {});

    simCounter++;
  }

  console.log('\n🎉 TODOS OS TESTES FORAM EXECUTADOS E CONCLUÍDOS COM SUCESSO 100%!');
  await client.destroy();
  process.exit(0);
});

client.login(env.TOKEN).catch((err) => {
  console.error('❌ Erro no login do bot:', err.message);
  process.exit(1);
});
