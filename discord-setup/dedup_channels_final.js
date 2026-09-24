const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  // Deduplica categoria MEMBER COUNT
  const catsMC = guild.channels.cache.filter(
    (c) => c.type === ChannelType.GuildCategory && c.name.includes('𝐌𝐄𝐌𝐁𝐄𝐑 𝐂𝐎𝐔𝐍𝐓')
  );
  if (catsMC.size > 1) {
    const arr = [...catsMC.values()];
    for (let i = 1; i < arr.length; i++) {
      console.log(`🗑️ Deletando categoria duplicada: ${arr[i].name} (${arr[i].id})`);
      await arr[i].delete().catch(() => {});
    }
  }

  // Deduplica canais de Bem-Vindos
  const bvs = guild.channels.cache.filter(
    (c) => c.type === ChannelType.GuildText && (c.name.includes('Bem-Vindos') || c.name.includes('𝐁𝐞𝐦-𝐕𝐢𝐧𝐝𝐨𝐬'))
  );
  if (bvs.size > 1) {
    const arr = [...bvs.values()];
    for (let i = 1; i < arr.length; i++) {
      console.log(`🗑️ Deletando canal BV duplicado: ${arr[i].name} (${arr[i].id})`);
      await arr[i].delete().catch(() => {});
    }
  }

  // Garante que o único BV restante esteja na categoria Informações & Comandos na pos 0
  const catInfo = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && c.name.includes('𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦')
  );
  const unicoBV = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildText && (c.name.includes('Bem-Vindos') || c.name.includes('𝐁𝐞𝐦-𝐕𝐢𝐧𝐝𝐨𝐬'))
  );
  if (unicoBV && catInfo) {
    if (unicoBV.parentId !== catInfo.id) {
      await unicoBV.setParent(catInfo.id, { lockPermissions: false });
    }
    await unicoBV.setPosition(0);
  }

  // Garante que o canal de voz Membros esteja na categoria MEMBER COUNT
  const catMCRestante = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && c.name.includes('𝐌𝐄𝐌𝐁𝐄𝐑 𝐂𝐎𝐔𝐍𝐓')
  );
  const chMembros = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildVoice && c.name.includes('𝐌𝐞𝐦𝐛𝐫𝐨𝐬')
  );
  if (chMembros && catMCRestante) {
    if (chMembros.parentId !== catMCRestante.id) {
      await chMembros.setParent(catMCRestante.id, { lockPermissions: false });
    }
  }

  console.log('✅ Deduplicação concluída com sucesso!');
  process.exit(0);
});

client.login(process.env.TOKEN);
