const { Client, GatewayIntentBits, ChannelType, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

async function limparCanal(canal) {
  try {
    let continuar = true;
    while (continuar) {
      const msgs = await canal.messages.fetch({ limit: 100 }).catch(() => null);
      if (!msgs || msgs.size === 0) {
        continuar = false;
        break;
      }
      for (const m of msgs.values()) {
        await m.delete().catch(() => {});
      }
      if (msgs.size < 100) continuar = false;
    }
  } catch (err) {
    console.warn(`Erro ao limpar canal ${canal.name}:`, err.message);
  }
}

client.once('ready', async () => {
  console.log(`🤖 Iniciando limpeza geral de testes com ${client.user.tag}...`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) {
    console.error('❌ Guild não encontrada!');
    process.exit(1);
  }

  await guild.channels.fetch();

  // 1. Apaga apenas canais soltos de tickets de teste (protege os canais base oficiais)
  const CANAIS_BASE_OFICIAIS = ['ticket-br', 'ticket-dono', 'log-tickets', 'atendimento'];
  let ticketsApagados = 0;

  for (const c of guild.channels.cache.values()) {
    const nome = c.name.toLowerCase();
    // Pula canais base do servidor
    if (CANAIS_BASE_OFICIAIS.some((p) => nome.includes(p))) continue;

    if (
      (nome.startsWith('ticket-') || nome.startsWith('ticket_') || nome.includes('ticket-nosleira')) &&
      (c.type === ChannelType.GuildText || c.isThread?.())
    ) {
      console.log(`🗑️ Apagando canal de ticket de teste: ${c.name} (${c.id})`);
      await c.delete('Limpeza de tickets de teste').catch(() => {});
      ticketsApagados++;
    }
  }

  // 2. Busca também threads ativas ou arquivadas dentro de todos os canais
  for (const c of guild.channels.cache.values()) {
    if (c.threads) {
      const threadsAtivas = await c.threads.fetchActive().catch(() => null);
      if (threadsAtivas && threadsAtivas.threads) {
        for (const t of threadsAtivas.threads.values()) {
          if (t.name.toLowerCase().includes('ticket-')) {
            console.log(`🗑️ Apagando subtópico ativo: ${t.name}`);
            await t.delete('Limpeza de teste').catch(() => {});
            ticketsApagados++;
          }
        }
      }
      const threadsArq = await c.threads.fetchArchived().catch(() => null);
      if (threadsArq && threadsArq.threads) {
        for (const t of threadsArq.threads.values()) {
          if (t.name.toLowerCase().includes('ticket-')) {
            console.log(`🗑️ Apagando subtópico arquivado: ${t.name}`);
            await t.delete('Limpeza de teste').catch(() => {});
            ticketsApagados++;
          }
        }
      }
    }
  }

  console.log(`✅ Total de tickets de teste removidos: ${ticketsApagados}`);

  // 3. Limpa o canal de Ranks
  const chRanks = guild.channels.cache.find(
    (c) => (c.name.includes('rank') || c.name.includes('🏆')) && c.type === ChannelType.GuildText
  );

  if (chRanks) {
    console.log(`🧹 Limpando mensagens do canal de Ranks: #${chRanks.name}...`);
    await limparCanal(chRanks);

    const embedRanks = new EmbedBuilder()
      .setColor('#F1C40F')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Sistema de Ranks & Atividade',
        iconURL: guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL(),
      })
      .setTitle('🏆  Hall da Fama & Promoções de Cargo')
      .setDescription(
        'Seja bem-vindo ao canal de **Ranks e Atividade** da comunidade!\n\n' +
        'Aqui são anunciadas automaticamente todas as **promoções de cargos**, conquistas de horas em chamadas de voz e atividade no chat.'
      )
      .addFields(
        {
          name: '🎖️  Cargos de Progressão por Atividade',
          value: [
            '> 🥉 **Iniciante de Nosleira** — 5h de atividade',
            '> 🥈 **Explorador de Nosleira** — 15h de atividade',
            '> 🥇 **Guerreiro de Nosleira** — 35h de atividade',
            '> 💎 **Veterano de Nosleira** — 75h de atividade',
            '> 👑 **Lenda de Nosleira** — 150h de atividade',
            '> 🌟 **Imortal de Nosleira** — 300h de atividade',
          ].join('\n'),
          inline: false,
        },
        {
          name: '💬  Como consultar seu progresso?',
          value: 'Utilize o comando `!rank` ou clique nos botões rápidos em #comandos para visualizar seu tempo acumulado.',
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT 7.4 • Gamificação Oficial', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    await chRanks.send({ embeds: [embedRanks] });
    console.log('✅ Canal de Ranks atualizado com sucesso!');
  }

  // 4. Reseta o contador de tickets para 1
  const contadorPath = path.join('d:/Server/discord-setup', 'ticket_counter.json');
  try {
    fs.writeFileSync(contadorPath, JSON.stringify({ counter: 1 }, null, 2), 'utf-8');
    console.log('✅ Contador de tickets resetado para #0001');
  } catch (err) {}

  console.log('🚀 Limpeza geral concluída com sucesso!');
  process.exit(0);
});

client.login(process.env.TOKEN);
