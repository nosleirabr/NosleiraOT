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
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once('ready', async () => {
  console.log(`🤖 Publicando Painel de Vocações: ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  const canalComunicados = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildText && (
      c.name.toLowerCase().includes('comunicados') ||
      c.name.normalize('NFKD').toLowerCase().includes('comunicados')
    )
  );

  if (!canalComunicados) {
    console.error('❌ Canal Comunicados não encontrado!');
    process.exit(1);
  }

  const embedVoc = new EmbedBuilder()
    .setColor('#E67E22')
    .setAuthor({
      name: 'NosleiraOT 7.4 • Sistema de Vocações & Cargos',
      iconURL: guild.iconURL() || 'https://img.icons8.com/fluency/96/shield.png',
    })
    .setTitle('🛡️  Escolha a sua Vocação Principal')
    .setDescription(
      'Seja bem-vindo(a) ao **NosleiraOT 7.4**!\n' +
      'Escolha a sua classe principal para receber sua subtag oficial no Discord e interagir com outros membros da sua vocação:\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
      '⚔️ **Elite Knight (EK)** — Mestre do combate corpo-a-corpo, tanker e alta defesa.\n' +
      '🏹 **Royal Paladin (RP)** — Mestre das distâncias, alta precisão e balanceamento.\n' +
      '🔮 **Master Sorcerer (MS)** — Mago devastador com magias ofensivas e dano massivo.\n' +
      '🌿 **Elder Druid (ED)** — Conjurador dos elementos gelo/terra e mestre das curas.\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '👉 **Clique no botão da sua classe abaixo para receber a tag instantaneamente:**'
    )
    .setFooter({ text: 'NosleiraOT 7.4 • Você pode alterar sua vocação a qualquer momento clicando nos botões.' });

  const rowVoc = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('vocation_ek')
      .setLabel('⚔️ Knight (EK)')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('vocation_rp')
      .setLabel('🏹 Paladin (RP)')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('vocation_ms')
      .setLabel('🔮 Sorcerer (MS)')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('vocation_ed')
      .setLabel('🌿 Druid (ED)')
      .setStyle(ButtonStyle.Secondary)
  );

  await canalComunicados.send({ embeds: [embedVoc], components: [rowVoc] });
  console.log('✅ Painel de Vocações publicado com sucesso em Comunicados!');
  process.exit(0);
});

client.login(process.env.TOKEN);
