const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

function gerarControlesDJ() {
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('dj_select_playlist')
    .setPlaceholder('🎵 Escolha a Playlist 24/7 para tocar...')
    .addOptions([
      { label: 'Rock & Hard Rock 80s/90s', description: 'Guns, AC/DC, Queen, etc.', value: 'rock', emoji: '🎸' },
      { label: 'Eletrônica & EDM', description: 'Alok, Vintage, Guetta, etc.', value: 'eletronica', emoji: '🎧' },
      { label: 'Hip-Hop & Rap', description: 'Eminem, Tupac, Snoop Dogg', value: 'rap', emoji: '🎤' },
      { label: 'Sertanejo Universitário', description: 'Gusttavo Lima, Jorge & Mateus', value: 'sertanejo', emoji: '🤠' },
      { label: 'Lo-Fi / Chill & Study', description: 'Beats relaxantes para treinar ML', value: 'lofi', emoji: '☕' },
      { label: 'Parar Rádio 24/7', description: 'Desliga a rádio automática', value: 'stop', emoji: '⏹️' }
    ]);

  const rowMenu = new ActionRowBuilder().addComponents(selectMenu);

  const rowBotoes = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('dj_btn_pause').setLabel('⏸️ Pausar/Play').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('dj_btn_skip').setLabel('⏭️ Pular Faixa').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('dj_btn_queue').setLabel('📋 Ver Fila').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('dj_btn_help').setLabel('❓ Como Usar').setStyle(ButtonStyle.Secondary)
  );

  return [rowMenu, rowBotoes];
}

function gerarCardNowPlaying(guild, clientUser) {
  const botAvatar = clientUser.displayAvatarURL({ dynamic: true, size: 512 });
  const guildIcon = guild.iconURL({ dynamic: true, size: 512 }) || botAvatar;

  return new EmbedBuilder()
    .setColor('#00F0FF')
    .setAuthor({
      name: 'Rádio Nosleira 98.1 FM',
      iconURL: guildIcon,
    })
    .setTitle('📻  Painel do DJ Oficial')
    .setDescription('Escolha a playlist automática abaixo ou use os botões para controlar a música.')
    .setImage('https://i.imgur.com/8Yv6Z0b.png') // Um banner genérico bonito se quiser, ou removemos
    .setFooter({ text: 'Sistema de Rádio 24/7', iconURL: botAvatar })
    .setTimestamp();
}

client.once('ready', async () => {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.channels.fetch();
    
    // Procura o canal de voz ou texto da Rádio
    const chRadio = guild.channels.cache.find(c => (c.name.includes('Radio') || c.name.includes('📻')) && c.type === 2); // Voice channel chat
    
    if (chRadio) {
      // Clear
      const msgs = await chRadio.messages.fetch({ limit: 50 }).catch(() => null);
      if (msgs && msgs.size > 0) {
        for (const m of msgs.values()) {
          await m.delete().catch(() => {});
        }
      }

      const embed = gerarCardNowPlaying(guild, client.user);
      const controles = gerarControlesDJ();

      await chRadio.send({ embeds: [embed], components: controles });
      console.log('✅ Painel do DJ postado no canal de voz usando o RADIO_TOKEN!');
    } else {
      console.log('Canal de rádio (voz) não encontrado!');
    }
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    process.exit(0);
  }
});

client.login(process.env.RADIO_TOKEN);
