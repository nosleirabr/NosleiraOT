const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  const catInfo = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && c.name.includes('𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦')
  );
  const chBV = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildText && c.name.includes('𝐁𝐞𝐦-𝐕𝐢𝐧𝐝𝐨𝐬')
  );

  if (chBV && catInfo) {
    console.log(`📁 Vinculando ${chBV.name} dentro da categoria ${catInfo.name}`);
    await chBV.setParent(catInfo.id, { lockPermissions: false });
    await chBV.setPosition(0);
  }

  console.log('✅ Canal de Boas-Vindas posicionado perfeitamente no topo de Informações & Comandos!');
  process.exit(0);
});

client.login(process.env.TOKEN);
