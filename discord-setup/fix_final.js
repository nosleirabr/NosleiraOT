const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function formatName(emoji, name) {
  const words = name.split(/[\s-]+/).filter(Boolean);
  const formatted = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  return `[ ${emoji} ] ${formatted}`;
}

client.once('ready', async () => {
  const L = (...a) => console.log(...a);
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.channels.fetch();
    let renamed = 0, deleted = 0, moved = 0;

    // 1. Fix all text/voice channels with -emoji--name format
    for (const ch of guild.channels.cache.values()) {
      const rawName = ch.name;
      if (rawName.startsWith('[ ')) { console.log('OK:', rawName); continue; }
      if (ch.type === ChannelType.GuildCategory) continue;

      const match = rawName.match(/^-(.+?)--(.+)$/);
      if (!match) { console.log('SKIP:', rawName); continue; }

      const emoji = match[1];
      const name = match[2];
      const newName = `[ ${match[1]} ] ${match[2].split(/[\s-]+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}`;

      if (ch.name !== newName) {
        await ch.setName(newName).catch((e) => console.log('Fail:', e.message));
        console.log(`RENAMED: "${rawName}" -> "${newName}"`);
        renamed++;
        await sleep(300);
      }
    }

    // 2. Fix categories: rename or delete
    const categoryFixes = {
      '𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦': '[ 📢 ] INFORMAÇÕES',
      '𝗦𝗨𝗣𝗢𝗥𝗧𝗘': '[ 🎫 ] SUPORTE',
      '𝗔𝗗𝗩𝗘𝗥𝗧𝗜𝗦𝗜𝗡𝗚': '[ 🎮 ] ADVERTISING',
      '𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦': '[ 🤖 ] COMANDOS',
      '𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭': '[ 🔊 ] CANAIS DE VOZ',
      '𝗠𝗘𝗠𝗕𝗘𝗥 𝗖𝗢𝗨𝗡𝗧': '𝗠𝗘𝗠𝗕𝗘𝗥 𝗖𝗢𝗨𝗡𝗧',
      // '𝗧𝗜𝗖𝗞𝗘𝗧𝗦 𝗔𝗧𝗜𝗩𝗢𝗦' NUNCA deletar — apagar a categoria quebra os tickets abertos
      '⚔️ BOSSES': '🗑️ REMOVER',
      '𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦': '🗑️ REMOVER',
    };

    for (const [oldName, newName] of Object.entries(categoryFixes)) {
      const cat = guild.channels.cache.find(c => c.name === oldName && c.type === ChannelType.GuildCategory);
      if (!cat) continue;
      if (newName === '🗑️ REMOVER') {
        const children = guild.channels.cache.filter(c => c.parentId === cat.id);
        for (const ch of children.values()) { await ch.delete('Remove unused').catch(() => {}); console.log('Deleted:', ch.name); await sleep(300); }
        await cat.delete('Remove unused').catch(() => {}); console.log('DELETED:', oldName); await sleep(500);
      } else if (cat.name !== newName) {
        await cat.setName(newName).catch(() => {}); console.log('Renamed cat:', newName); await sleep(300);
      }
    }

    // 3. Fix channel names (final pass for any remaining -emoji--name)
    await guild.channels.fetch();
    for (const ch of guild.channels.cache.values()) {
      const rawName = ch.name;
      if (rawName.startsWith('[ ')) continue;
      if (ch.type === ChannelType.GuildCategory) continue;

      const match = rawName.match(/^-(.+?)--(.+)$/);
      if (!match) { console.log('SKIP:', rawName); continue; }

      const emoji = match[1];
      const name = match[2];
      const newName = `[ ${match[1]} ] ${match[2].split(/[\s-]+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}`;

      if (ch.name !== newName) {
        await ch.setName(newName).catch((e) => console.log('Fail:', e.message));
        console.log(`RENAMED: "${rawName}" -> "${newName}"`);
        renamed++;
        await sleep(300);
      }
    }

    // 3b. Move channels to correct categories
    const channelToCategory = {
      // INFORMAÇÕES
      '[ 📣 ] Comunicados': '[ 📢 ] INFORMAÇÕES',
      '[ ✍🏻 ] Atualizações': '[ 📢 ] INFORMAÇÕES',
      '[ 🔱 ] Links': '[ 📢 ] INFORMAÇÕES',
      '[ 🚫 ] Regras': '[ 🎫 ] SUPORTE',
      '[ 📢 ] Comunicados': '[ 📢 ] INFORMAÇÕES',
      '[ ✍🏻 ] Atualizações': '[ 📢 ] INFORMAÇÕES',
      '[ 🔱 ] Links': '[ 📢 ] INFORMAÇÕES',
      '[ 🚫 ] Regras': '[ 🎫 ] SUPORTE',
      '[ 📋 ] Log Tickets': '[ 🎫 ] SUPORTE',
      '[ 🔴 ] Ticket Br': '[ 🎫 ] SUPORTE',
      // ADVERTISING
      '[ 🎥 ] Streamers': '[ 🎮 ] ADVERTISING',
      '[ 📷 ] Screenshots': '[ 🎮 ] ADVERTISING',
      '[ 📺 ] Clips': '[ 🎮 ] ADVERTISING',
      '[ 🎥 ] Streamers': '[ 🎮 ] ADVERTISING',
      '[ 📷 ] Screenshots': '[ 🎮 ] ADVERTISING',
      '[ 📺 ] Clips': '[ 🎮 ] ADVERTISING',
      // COMANDOS
      '[ 🤖 ] Comandos Geral': '[ 🤖 ] COMANDOS',
      // CANAIS DE VOZ
      '[ 🔊 ] Geral 1': '[ 🔊 ] CANAIS DE VOZ',
      '[ 🔊 ] Geral 2': '[ 🔊 ] CANAIS DE VOZ',
      '[ 🎮 ] Jogando': '[ 🔊 ] CANAIS DE VOZ',
      '[ 🐲 ] Boss': '[ 🔊 ] CANAIS DE VOZ',
      '[ 💤 ] Afk': '[ 🔊 ] CANAIS DE VOZ',
      '[ 👥 ] Membros:': '𝗠𝗘𝗠𝗕𝗘𝗥 𝗖𝗢𝗨𝗡𝗧',
      // SUPORTE
      '[ 🔴 ] Ticket Br': '[ 🎫 ] SUPORTE',
      '[ 🚫 ] Regras': '[ 🎫 ] SUPORTE',
      '[ 📋 ] Log Tickets': '[ 🎫 ] SUPORTE',
      // ADVERTISING
      '[ 🎥 ] Streamers': '[ 🎮 ] ADVERTISING',
      '[ 📷 ] Screenshots': '[ 🎮 ] ADVERTISING',
      '[ 📺 ] Clips': '[ 🎮 ] ADVERTISING',
      // BOSSES
      '[ 📊 ] Boss Spawns': '⚔️ BOSSES',
      '[ 💀 ] Boss Drops': '⚔️ BOSSES',
      '[ 📜 ] Boss Historico': '⚔️ BOSSES',
      // Staff Voice
      '🔊 | Staff Voice': '[ 🎫 ] SUPORTE',
    };

    for (const [channelName, categoryName] of Object.entries(channelToCategory)) {
      const ch = guild.channels.cache.find(c => c.name === channelName);
      const cat = guild.channels.cache.find(c => c.name === categoryName && c.type === ChannelType.GuildCategory);
      if (ch && cat && ch.parentId !== cat.id) {
        await ch.setParent(cat.id).catch(() => {});
        console.log(`MOVED: ${channelName} -> ${categoryName}`);
        moved++;
        await sleep(200);
      }
    }

    // Fix categories: rename or delete
    const categoryFixes = {
      '𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦': '[ 📢 ] INFORMAÇÕES',
      '𝗦𝗨𝗣𝗢𝗥𝗧𝗘': '[ 🎫 ] SUPORTE',
      '𝗔𝗗𝗩𝗘𝗥𝗧𝗜𝗦𝗜𝗡𝗚': '[ 🎮 ] ADVERTISING',
      '𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦': '[ 🤖 ] COMANDOS',
      '𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭': '[ 🔊 ] CANAIS DE VOZ',
      '𝗠𝗘𝗠𝗕𝗘𝗥 𝗖𝗢𝗨𝗡𝗧': '𝗠𝗘𝗠𝗕𝗘𝗥 𝗖𝗢𝗨𝗡𝗧',
      // '𝗧𝗜𝗖𝗞𝗘𝗧𝗦 𝗔𝗧𝗜𝗩𝗢𝗦' NUNCA deletar — apagar a categoria quebra os tickets abertos
      '⚔️ BOSSES': '🗑️ REMOVER',
      '𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦': '🗑️ REMOVER',
    };

    for (const [oldName, newName] of Object.entries(categoryFixes)) {
      const cat = guild.channels.cache.find(c => c.name === oldName && c.type === ChannelType.GuildCategory);
      if (!cat) continue;
      if (newName === '🗑️ REMOVER') {
        const children = guild.channels.cache.filter(c => c.parentId === cat.id);
        for (const ch of children.values()) { await ch.delete('Remove unused').catch(() => {}); console.log('Deleted:', ch.name); await sleep(300); }
        await cat.delete('Remove unused').catch(() => {}); console.log('DELETED:', oldName); await sleep(500);
      } else if (cat.name !== newName) {
        await cat.setName(newName).catch(() => {}); console.log('Renamed cat:', newName); await sleep(300);
      }
    }

    // Reorder categories
    const desiredOrder = [
      '𝗠𝗘𝗠𝗕𝗘𝗥 𝗖𝗢𝗨𝗡𝗧',
      '[ 📢 ] INFORMAÇÕES',
      '[ 🎫 ] SUPORTE',
      '[ 🎮 ] ADVERTISING',
      '[ 🤖 ] COMANDOS',
      '[ 🔊 ] CANAIS DE VOZ',
    ];
    await guild.channels.fetch();
    for (let i = 0; i < desiredOrder.length; i++) {
      const cat = guild.channels.cache.find(c => c.name === desiredOrder[i] && c.type === ChannelType.GuildCategory);
      if (cat) { await cat.setPosition(i).catch(() => {}); await sleep(300); }
    }

    // Reorder channels in categories
    const orders = {
      '[ 📢 ] INFORMAÇÕES': ['[ 📢 ] Comunicados', '[ ✍🏻 ] Atualizações', '[ 🔱 ] Links', '[ 🚫 ] Regras'],
      '[ 🎫 ] SUPORTE': ['[ 🔴 ] Ticket Br', '[ 🚫 ] Regras', '[ 📋 ] Log Tickets'],
      '[ 🎮 ] ADVERTISING': ['[ 🎥 ] Streamers', '[ 📷 ] Screenshots', '[ 📺 ] Clips'],
      '[ 🤖 ] COMANDOS': ['[ 🤖 ] Comandos Geral'],
      '[ 🔊 ] CANAIS DE VOZ': ['[ 🔊 ] Geral 1', '[ 🔊 ] Geral 2', '[ 🎮 ] Jogando', '[ 🐲 ] Boss', '[ 💤 ] Afk', '🔊 | Staff Voice'],
    };

    for (const [catName, channels] of Object.entries(channelOrders)) {
      const cat = guild.channels.cache.find(c => c.name === catName);
      if (!cat) continue;
      for (let i = 0; i < channels.length; i++) {
        const ch = guild.channels.cache.find(c => c.name === channels[i] && c.parentId === cat.id);
        if (ch) { await ch.setPosition(i).catch(() => {}); await sleep(200); }
      }
    }

    console.log('\nFIM: Tudo padronizado');
  } catch (e) { console.log('ERR:', e.stack || e.message); }
  client.destroy();
  setTimeout(() => process.exit(0), 2000);
});

const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

client.login(process.env.TOKEN);
setTimeout(() => process.exit(1), 180000);