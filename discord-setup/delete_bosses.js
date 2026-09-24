const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

client.once('ready', async () => {
  const L = (...a) => console.log(...a);
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.channels.fetch();
    
    const bosses = guild.channels.cache.find(c => c.name === '⚔️ BOSSES' && c.type === ChannelType.GuildCategory);
    if (bosses) {
      // Delete all channels in the category first
      const children = guild.channels.cache.filter(c => c.parentId === bosses.id);
      for (const ch of children.values()) {
        await ch.delete('Remove BOSSES category').catch(() => {});
        L('Deleted channel:', ch.name);
        await sleep(400);
      }
      await bosses.delete('Remove BOSSES category');
      L('Deleted BOSSES category');
    }
    
    L('FIM');
  } catch (e) { console.log('ERR:', e.stack || e.message); }
  client.destroy();
  setTimeout(() => process.exit(0), 2000);
});

client.login(process.env.TOKEN);
setTimeout(() => process.exit(1), 120000);