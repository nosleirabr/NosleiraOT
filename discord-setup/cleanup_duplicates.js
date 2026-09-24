const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

client.once('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  // IDs das categorias antigas que foram duplicadas
  const oldCategoryIds = [
    '1550954693528657991', // [ 📢 ] 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦 𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦
    '1550954755956674620', // [ 🎫 ] 𝗔𝗧𝗘𝗡𝗗𝗜𝗠𝗘𝗡𝗧𝗢 𝗘 𝗦𝗨𝗣𝗢𝗥𝗧𝗘 (antiga)
    '1550954710914179202', // [ 🎮 ] 𝗖𝗢𝗠𝗨𝗡𝗜𝗗𝗔𝗗𝗘 𝗘 𝗠𝗜𝗗𝗜𝗔 (antiga)
    '1550954790240915557', // [ 🔊 ] 𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭 (antiga)
  ];

  console.log('🧹 Limpando canais e categorias duplicadas antigas...');
  for (const catId of oldCategoryIds) {
    const chs = guild.channels.cache.filter((c) => c.parentId === catId);
    for (const c of chs.values()) {
      console.log(`  🗑️ Removendo canal antigo: ${c.name} (${c.id})`);
      await c.delete('Limpeza de canais duplicados').catch(() => {});
      await sleep(250);
    }
    const cat = guild.channels.cache.get(catId);
    if (cat) {
      console.log(`  🗑️ Removendo categoria antiga: ${cat.name} (${cat.id})`);
      await cat.delete('Limpeza de categoria antiga').catch(() => {});
      await sleep(250);
    }
  }

  console.log('✅ Limpeza concluída!');
  process.exit(0);
});

client.login(process.env.TOKEN);
