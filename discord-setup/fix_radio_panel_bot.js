const { Client, GatewayIntentBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  await guild.channels.fetch();

  // Deletar o duplicado que criamos sem querer
  const chDuplicado = guild.channels.cache.find(c => c.name === '【📜】𝗿𝗲𝗴𝗿𝗮𝘀-𝗲-𝗰𝗼𝗺𝗮𝗻𝗱𝗼𝘀-𝗿𝗮𝗱𝗶𝗼');
  if (chDuplicado) await chDuplicado.delete().catch(() => {});

  // Achar o canal oficial
  const chOficial = guild.channels.cache.find(c => c.name.includes('📻') && c.type === ChannelType.GuildText);
  if (!chOficial) {
    console.log('Canal oficial não encontrado.');
    process.exit(1);
  }

  // Limpar canal oficial
  const msgs = await chOficial.messages.fetch({ limit: 100 }).catch(() => null);
  if (msgs) {
    for (const m of msgs.values()) {
      await m.delete().catch(() => {});
    }
  }

  // Postar o painel como Nosleira-DJ
  const botAvatar = client.user.displayAvatarURL({ dynamic: true, size: 512 });
  const guildIcon = guild.iconURL({ dynamic: true, size: 512 }) || botAvatar;

  const embedRegras = new EmbedBuilder()
    .setColor('#00F0FF')
    .setAuthor({
      name: 'NosleiraOT 7.4 • Rádio Oficial & Sistema de Som 24/7',
      iconURL: guildIcon,
    })
    .setTitle('📻  Regras de Convivência & Comandos da Rádio')
    .setDescription(
      'Bem-vindo ao espaço oficial de convivência e música do **NosleiraOT**!\n' +
      'Abaixo estão todas as regras e o guia completo de comandos para curtir suas músicas com alta fidelidade na sala de voz.'
    )
    .addFields(
      {
        name: '⚖️  Regras de Convivência na Rádio',
        value: [
          '> 🎧 **Respeito à Fila:** Respeite as músicas pedidas pelos outros jogadores.',
          '> 🚫 **Proibido Earrape:** Proibido áudios estourados, ruídos estridentes ou que incomodem os membros.',
          '> 🔞 **Proibido Ofensas:** Conteúdo preconceituoso, ofensivo ou discursos de ódio geram punição imediata.',
          '> 🤖 **Permanência 24/7:** O bot de rádio fica conectado 24h na sala de rádio sem interrupções.',
        ].join('\n'),
        inline: false,
      },
      {
        name: '🎵  Comandos de Música (Usar no chat da Rádio)',
        value: [
          '> `!play <nome ou link>` — Toca uma música ou playlist do YouTube/SoundCloud',
          '> `!pause` — Pausa a reprodução atual',
          '> `!resume` — Retoma a música pausada',
          '> `!skip` ou `!pular` — Pula para a próxima música da fila',
          '> `!stop` ou `!sair` — Interrompe a reprodução e limpa a fila',
        ].join('\n'),
        inline: false,
      },
      {
        name: '🎛️  Comandos de Controle de Fila',
        value: [
          '> `!queue` ou `!fila` — Visualiza todas as faixas que estão na fila',
          '> `!np` — Mostra a faixa tocando no momento com barra de progresso',
          '> `!volume <1 a 100>` — Ajusta o volume do áudio',
          '> `!loop` — Ativa a repetição da música atual ou da fila',
          '> `!shuffle` — Embaralha a ordem das faixas na fila',
        ].join('\n'),
        inline: false,
      }
    )
    .setFooter({ text: 'NosleiraOT 7.4 • Rádio 24h • Sistema Permanente', iconURL: botAvatar })
    .setTimestamp();

  const rowControls = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('dj_btn_pause').setLabel('⏯️ Play / Pause').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('dj_btn_skip').setLabel('⏭️ Pular').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('dj_btn_queue').setLabel('📜 Ver Fila').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('dj_btn_stop').setLabel('⏹️ Parar').setStyle(ButtonStyle.Danger)
  );

  await chOficial.send({
    embeds: [embedRegras],
    components: [rowControls],
  });

  console.log(`✅ Postado com sucesso em ${chOficial.name}`);
  process.exit(0);
});

client.login(process.env.RADIO_TOKEN);
