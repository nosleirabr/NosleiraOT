const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

function toBoldSans(text) {
  const map = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜',
    'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥',
    'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶',
    'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿',
    's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵',
  };
  return (text || '').split('').map((char) => map[char] || char).join('');
}

client.once('ready', async () => {
  console.log(`🤖 Logado como ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  // Encontra categoria de Canais de Voz
  const catVoz = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && (
      c.name.includes('CANAIS DE VOZ') ||
      c.name.normalize('NFKD').includes('CANAIS DE VOZ') ||
      c.name.includes('🔊')
    )
  );

  const nomeRadio = `【📻】 ${toBoldSans('Radio-Nosleira-98')}`;

  // Verifica se o canal de voz da Rádio já existe
  let chRadio = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildVoice && (
      c.name.includes('Radio') ||
      c.name.normalize('NFKD').includes('Radio') ||
      c.name.includes('📻')
    )
  );

  const chBoss = guild.channels.cache.find((c) => c.name.includes('Boss') || c.name.includes('🐉'));
  const chAFK = guild.channels.cache.find((c) => c.name.includes('AFK') || c.name.includes('💤'));

  const posDesejada = chBoss ? chBoss.position + 1 : 5;

  if (!chRadio) {
    chRadio = await guild.channels.create({
      name: nomeRadio,
      type: ChannelType.GuildVoice,
      parent: catVoz ? catVoz.id : null,
      position: posDesejada,
      userLimit: 0, // Ilimitado
      bitrate: 64000,
      reason: 'Criação da Rádio Nosleira 98 24/7',
    });
    console.log(`✅ Canal de Voz criado com sucesso: ${nomeRadio}`);
  } else {
    await chRadio.setName(nomeRadio).catch(() => {});
    if (catVoz) await chRadio.setParent(catVoz.id, { lockPermissions: false }).catch(() => {});
    await chRadio.setPosition(posDesejada).catch(() => {});
    console.log(`✅ Canal de Voz da Rádio atualizado e posicionado: ${nomeRadio}`);
  }

  // Se houver canal AFK, garante que ele fique depois da Rádio
  if (chAFK) {
    await chAFK.setPosition(posDesejada + 1).catch(() => {});
  }

  console.log('🎉 Configuração da Rádio Nosleira 98 concluída com sucesso!');
  process.exit(0);
});

client.login(process.env.TOKEN);
