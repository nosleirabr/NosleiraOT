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
    console.warn(`Aviso ao limpar #${canal.name}:`, err.message);
  }
}

client.once('ready', async () => {
  console.log(`🤖 Atualizando canal de Clipes com ${client.user.tag}...`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  const chClips = guild.channels.cache.find(
    (c) => (c.name.toLowerCase().includes('clip') || c.name.includes('📺') || c.name.normalize('NFKD').toLowerCase().includes('clip')) && c.type === ChannelType.GuildText
  );

  if (!chClips) {
    console.error('❌ Canal de clipes não encontrado!');
    process.exit(1);
  }

  console.log(`Limpando e recriando embed em #${chClips.name}...`);
  await limparCanal(chClips);

  const botAvatar = client.user.displayAvatarURL({ dynamic: true, size: 512 });
  const guildIcon = guild.iconURL({ dynamic: true, size: 512 }) || botAvatar;

  const embedClips = new EmbedBuilder()
    .setColor('#E1306C')
    .setAuthor({
      name: 'NosleiraOT 7.4 • Central de Mídia & Clipes',
      iconURL: guildIcon,
    })
    .setTitle('📺  Melhores Momentos, Clipes & Shorts')
    .setDescription(
      'Compartilhe os momentos mais épicos, engraçados e jogadas insanas do **NosleiraOT**!\n' +
      'Seus clipes de PVP, boss hunts, war e fails ganham destaque para toda a comunidade assistir e reagir.'
    )
    .addFields(
      {
        name: '🎬  Como Publicar seu Clipe?',
        value: [
          '👉 **Digite no chat:** `!clip <link_do_video> [descrição do momento]`',
          '📌 **Exemplo:** `!clip https://clips.twitch.tv/... Trap insana no Hellgate!`',
          '✨ *O bot formata automaticamente um card com link direto e sua autoria!*',
        ].join('\n'),
        inline: false,
      },
      {
        name: '🌐  Plataformas Recomendadas & Suportadas',
        value: [
          '> 🟣 **Twitch** (Clips & VODs)',
          '> 🔴 **YouTube** (Shorts & Vídeos)',
          '> ⚫ **TikTok** (Vídeos curtos)',
          '> 🟢 **Kick** (Clips & Transmissões)',
          '> 🔵 **Clapper** (Shorts & Vídeos)',
          '> 🟡 **Medal.tv** (Highlights de Jogos)',
          '> 🟠 **Kwai** (Vídeos & Shorts)',
          '> 🔷 **Twitter / X** & 📸 **Instagram Reels**',
        ].join('\n'),
        inline: false,
      },
      {
        name: '📌  Diretrizes de Envio',
        value: [
          '> ⚔️ Exclusivo para conteúdos e jogadas gravadas no **NosleiraOT**.',
          '> 🛡️ Mantenha o respeito: conteúdos com ofensas graves serão removidos.',
        ].join('\n'),
        inline: false,
      }
    )
    .setFooter({ text: 'NosleiraOT 7.4 • Mostre suas jogadas para todo o servidor!', iconURL: botAvatar })
    .setTimestamp();

  await chClips.send({ embeds: [embedClips] });

  console.log(`✅ Canal #${chClips.name} atualizado com visual profissional e todas as plataformas!`);
  process.exit(0);
});

client.login(process.env.TOKEN);
