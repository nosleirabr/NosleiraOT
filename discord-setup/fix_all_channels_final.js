const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
client.once('ready', async () => {
  const L = (...a) => console.log(...a);
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.channels.fetch();

    // Map: exact current name -> exact target name (all text channels)
    const textFixes = [
      { atual: '-🚫--𝐑𝐞𝐠𝐫𝐚𝐬', novo: '[ 🚫 ] 𝐑𝐞𝐠𝐫𝐚𝐬' },
      { atual: '-📣--𝐂𝐨𝐦𝐮𝐧𝐢𝐜𝐚𝐝𝐨𝐬', novo: '[ 📣 ] 𝐂𝐨𝐦𝐮𝐧𝐢𝐜𝐚𝐝𝐨𝐬' },
      { atual: '-🔱--𝐋𝐢𝐧𝐤𝐬', novo: '[ 🔱 ] 𝐋𝐢𝐧𝐤𝐬' },
      { atual: '-📷--𝐒𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭𝐬', novo: '[ 📷 ] 𝐒𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭𝐬' },
      { atual: '-🤖--𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬-𝐆𝐞𝐫𝐚𝐥', novo: '[ 🤖 ] 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬-𝐆𝐞𝐫𝐚𝐥' },
      { atual: '-🔴--𝐓𝐢𝐜𝐤𝐞𝐭-𝐁𝐑', novo: '[ 🔴 ] 𝐓𝐢𝐜𝐤𝐞𝐭-𝐁𝐑' },
      { atual: '-📋--𝐋𝐨𝐠-𝐓𝐢𝐜𝐤𝐞𝐭𝐬', novo: '[ 📋 ] 𝐋𝐨𝐠-𝐓𝐢𝐜𝐤𝐞𝐭𝐬' },
      { atual: '-📺--𝐂𝐥𝐢𝐩𝐬', novo: '[ 📺 ] 𝐂𝐥𝐢𝐩𝐬' },
      { atual: '-✍🏻--𝐀𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐜𝐨𝐞𝐬', novo: '[ ✍🏻 ] 𝐀𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐜𝐨𝐞𝐬' },
      { atual: '-📷--𝐒𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭𝐬', novo: '[ 📷 ] 𝐒𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭𝐬' },
      { atual: '-🎥--𝐒𝐭𝐫𝐞𝐚𝐦𝐞𝐫𝐬', novo: '[ 🎥 ] 𝐒𝐭𝐫𝐞𝐚𝐦𝐞𝐫𝐬' },
      { atual: '-🏆--ranks', novo: '[ 🏆 ] Rank\'s' },
      { atual: '-👑--ticket-nosleirabr', novo: '[ 👑 ] Ticket-nosleirabr' },
      { atual: '-🚨--ticket-nosleirabr', novo: '[ 🚨 ] Ticket-nosleirabr' },
      { atual: '-💰--ticket-nosleirabr', novo: '[ 💰 ] Ticket-nosleirabr' },
      { atual: '-🐞--ticket-nosleirabr', novo: '[ 🐞 ] Ticket-nosleirabr' },
      { atual: '-🔐--ticket-nosleirabr', novo: '[ 🔐 ] Ticket-nosleirabr' },
      { atual: '-🛡️--ticket-nosleirabr', novo: '[ 🛡️ ] Ticket-nosleirabr' },
      { atual: '-💬--ticket-nosleirabr', novo: '[ 💬 ] Ticket-nosleirabr' },
      { atual: '-🤖--𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬-𝐆𝐞𝐫𝐚𝐥', novo: '[ 🤖 ] 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬-𝐆𝐞𝐫𝐚𝐥' },
      { atual: '-🔱--𝐋𝐢𝐧𝐤𝐬', novo: '[ 🔱 ] 𝐋𝐢𝐧𝐤𝐬' },
      { atual: '-🛡️--ticket-nosleirabr', novo: '[ 🛡️ ] Ticket-nosleirabr' },
      { atual: '-📺--ticket-nosleirabr', novo: '[ 📺 ] Ticket-nosleirabr' },
      { atual: '-💰--ticket-nosleirabr', novo: '[ 💰 ] Ticket-nosleirabr' },
      { atual: '-🐞--ticket-nosleirabr', novo: '[ 🐞 ] Ticket-nosleirabr' },
      { atual: '-👑--ticket-nosleirabr', novo: '[ 👑 ] Ticket-nosleirabr' },
      { atual: '-🚨--ticket-nosleirabr', novo: '[ 🚨 ] Ticket-nosleirabr' },
      { atual: '-💰--ticket-nosleirabr', novo: '[ 💰 ] Ticket-nosleirabr' },
      { atual: '-🐞--ticket-nosleirabr', novo: '[ 🐞 ] Ticket-nosleirabr' },
      { atual: '-🔐--ticket-nosleirabr', novo: '[ 🔐 ] Ticket-nosleirabr' },
      { atual: '-🛡️--ticket-nosleirabr', novo: '[ 🛡️ ] Ticket-nosleirabr' },
      { atual: '-💬--ticket-nosleirabr', novo: '[ 💬 ] Ticket-nosleirabr' },
      { atual: '-💎--vip', novo: '[ 💎 ] VIP' },
      { atual: '-⚔️--boss', novo: '[ ⚔️ ] Boss' },
    ];

    for (const { atual, novo } of textFixes) {
      const ch = guild.channels.cache.find((c) => c.name === atual);
      if (!ch) { console.log('NAO ACHADO:', atual); continue; }
      if (ch.name !== novo) {
        await ch.setName(novo).catch((e) => console.log('Rename FAIL:', e.message));
        console.log('Renomeado:', novo);
        await sleep(300);
      } else {
        console.log('Ja ok:', novo);
      }
    }

    // Fix voice channels that don't have brackets
    const voiceFixes = [
      { atual: '[ 👥 ] Membros: 🟢 [2]', novo: '[ 👥 ] Membros: 🟢 [2]' },
      { atual: '🔊 | 𝐒𝐭𝐚𝐟𝐟 𝐕𝐨𝐢𝐜𝐞', novo: '🔊 | 𝐒𝐭𝐚𝐟𝐟 𝐕𝐨𝐢𝐜𝐞' }, // keep as is
    ];

    for (const { atual, novo } of voiceFixes) {
      const ch = guild.channels.cache.find((c) => c.name === atual);
      if (!ch) { console.log('VOZ NAO ACHADO:', atual); continue; }
      if (ch.name !== novo) {
        await ch.setName(novo).catch((e) => console.log('Rename FAIL:', e.message));
        console.log('Renomeado voz:', novo);
        await sleep(300);
      } else {
        console.log('Voz Ja ok:', novo);
      }
    }

    console.log('FIM: Todos canais padronizados');
  } catch (e) { console.log('ERR ' + (e.stack || e.message)); }
  client.destroy();
  setTimeout(() => process.exit(0), 2000);
});
client.login(process.env.TOKEN);
setTimeout(() => process.exit(1), 180000);