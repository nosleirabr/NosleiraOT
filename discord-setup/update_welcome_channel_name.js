const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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

  const catInfo = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && (
      c.name.includes('𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦') ||
      c.name.toLowerCase().includes('informac') ||
      c.name.includes('📢')
    )
  );

  const chBV = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildText && (
      c.name.includes('Bem-Vindos') ||
      c.name.toLowerCase().includes('bem-vindo') ||
      c.name.toLowerCase().includes('welcome')
    )
  );

  const nomeNovo = `【👋】${toBoldSans('Bem-Vindos')}`;

  if (chBV) {
    console.log(`✏️ Atualizando canal "${chBV.name}" -> "${nomeNovo}"`);
    if (catInfo && chBV.parentId !== catInfo.id) {
      await chBV.setParent(catInfo.id, { lockPermissions: false });
    }
    await chBV.setName(nomeNovo);
    await chBV.setPosition(0);
    console.log(`✅ Canal atualizado com sucesso para: "${nomeNovo}" na categoria "${catInfo?.name}"!`);
  } else {
    console.log('Criando canal novo com o nome exato...');
    const novo = await guild.channels.create({
      name: nomeNovo,
      type: ChannelType.GuildText,
      parent: catInfo ? catInfo.id : null,
      position: 0,
    });
    console.log(`✅ Canal criado: "${novo.name}"`);
  }

  process.exit(0);
});

client.login(process.env.TOKEN);
