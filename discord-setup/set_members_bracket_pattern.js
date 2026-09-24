const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });

function toBoldSerif(text) {
  const map = {
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈',
    'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑',
    'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
    'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢',
    'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫',
    's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗',
  };
  return (text || '').split('').map((char) => map[char] || char).join('');
}

client.once('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();
  await guild.members.fetch().catch(() => {});

  const chMembros = guild.channels.cache.find(
    (c) => (c.name.includes('Membros') || c.name.includes('👥')) && c.type === ChannelType.GuildVoice
  );

  const members = await guild.members.fetch().catch(() => null);
  const total = members ? members.filter((m) => !m.user.bot).size : guild.memberCount;
  const online = members
    ? members.filter((m) => m.presence && m.presence.status !== 'offline' && !m.user.bot).size
    : 1;

  // Padrão unificado com 【👥】 igual aos outros canais: 【👥】 𝐌𝐞𝐦𝐛𝐫𝐨𝐬: 🟢[online] 🔴[total]
  const nomeMembrosUnificado = `【👥】 ${toBoldSerif('Membros')}: 🟢[${online}] 🔴[${total}]`;

  if (chMembros) {
    console.log(`🔊 Renomeando canal de membros: "${chMembros.name}" -> "${nomeMembrosUnificado}"`);
    await chMembros.setName(nomeMembrosUnificado).catch((err) => {
      console.error('Erro ao renomear:', err.message);
    });
    console.log(`✅ Canal de Membros atualizado para o padrão "${nomeMembrosUnificado}"!`);
  }

  process.exit(0);
});

client.login(process.env.TOKEN);
