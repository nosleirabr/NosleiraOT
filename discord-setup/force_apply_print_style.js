const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

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
  console.log(`🤖 Logado como ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();
  await guild.members.fetch().catch(() => {});

  // 1. Categoria MEMBER COUNT
  const catMC = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && c.name.toLowerCase().includes('member count')
  );
  const nomeCat = `➤ ${toBoldSerif('MEMBER COUNT')}`;
  if (catMC && catMC.name !== nomeCat) {
    console.log(`📁 Atualizando categoria: "${catMC.name}" -> "${nomeCat}"`);
    await catMC.setName(nomeCat).catch((e) => console.error('Erro cat:', e.message));
  }

  // 2. Canal de Voz de Membros
  const members = await guild.members.fetch().catch(() => null);
  const total = members ? members.filter((m) => !m.user.bot).size : guild.memberCount;
  const online = members
    ? members.filter((m) => m.presence && m.presence.status !== 'offline' && !m.user.bot).size
    : 1;

  const nomeMembrosExato = `⌈ 👥 ⌋ ${toBoldSerif('Membros')}: 🟢[${online}] 🔴[${total}]`;

  const chMembros = guild.channels.cache.find(
    (c) => (c.name.includes('Membros') || c.name.includes('👥')) && c.type === ChannelType.GuildVoice
  );

  if (chMembros) {
    console.log(`🔊 Renomeando canal de membros para: "${nomeMembrosExato}"`);
    try {
      await chMembros.setName(nomeMembrosExato);
      console.log('✅ Canal de membros renomeado com sucesso!');
    } catch (err) {
      console.log('⚠️ Rate limit no canal de membros. Recriando canal para aplicar na hora...');
      const parentId = chMembros.parentId;
      const pos = chMembros.position;
      await chMembros.delete('Recriando com novo estilo sem rate limit').catch(() => {});
      await guild.channels.create({
        name: nomeMembrosExato,
        type: ChannelType.GuildVoice,
        parent: parentId,
        position: pos,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.Connect],
            allow: [PermissionFlagsBits.ViewChannel],
          },
        ],
      });
      console.log('✅ Canal de membros recriado com o nome e estilo exato!');
    }
  }

  // 3. Canal de Boas-Vindas
  const nomeBVExato = `⌈👋⌋・${toBoldSerif('Bem-Vindos')}`;
  const chBV = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildText && (c.name.includes('Bem-Vindos') || c.name.includes('Boas-Vindas') || c.name.includes('welcome'))
  );

  if (chBV) {
    console.log(`👋 Renomeando canal de boas-vindas para: "${nomeBVExato}"`);
    try {
      await chBV.setName(nomeBVExato);
      console.log('✅ Canal de Boas-Vindas renomeado com sucesso!');
    } catch (err) {
      console.log('⚠️ Rate limit no canal BV. Recriando canal para aplicar na hora...');
      const parentId = chBV.parentId;
      const msgs = await chBV.messages.fetch({ limit: 5 }).catch(() => null);
      await chBV.delete('Recriando com novo estilo sem rate limit').catch(() => {});
      const novoBV = await guild.channels.create({
        name: nomeBVExato,
        type: ChannelType.GuildText,
        parent: parentId,
        position: 0,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AddReactions],
            deny: [PermissionFlagsBits.SendMessages],
          },
        ],
      });
      console.log('✅ Canal de Boas-Vindas recriado com sucesso!');
    }
  }

  // 4. Limpar tickets soltos
  const canaisSoltos = guild.channels.cache.filter(
    (c) => c.name.toLowerCase().startsWith('ticket-') && c.type === ChannelType.GuildText
  );
  for (const c of canaisSoltos.values()) {
    console.log(`🗑️ Deletando ticket solto: ${c.name}`);
    await c.delete('Limpeza').catch(() => {});
  }

  console.log('\n🎉 APLICAÇÃO FORÇADA CONCLUÍDA COM SUCESSO!');
  process.exit(0);
});

client.login(process.env.TOKEN);
