const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function formatName(emoji, name) {
  const words = name.split(/[\s-]+/).filter(Boolean);
  const formatted = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  return `[ ${emoji} ] ${formatted}`;
}

function extractEmojiAndName(rawName) {
  // Pattern 1: -emoji--Name
  let match = rawName.match(/^-(.+?)--(.+)$/);
  if (match) return { emoji: match[1], name: match[2] };
  
  // Pattern 2: -emoji--ticket-name
  match = rawName.match(/^-(.+?)--ticket-(.+)$/);
  if (match) return { emoji: match[1], name: `Ticket-${match[2]}` };
  
  // Pattern 3: already formatted [ emoji ] Name
  match = rawName.match(/^\[\s*(.+?)\s*\]\s*(.+)$/);
  if (match) return { emoji: match[1].trim(), name: match[2] };
  
  // Pattern 4: Voice channels like [ 🔊 ] 𝐆𝐞𝐫𝐚𝐥 𝟏
  match = rawName.match(/^\[\s*(.+?)\s*\]\s+(.+)$/);
  if (match) return { emoji: match[1].trim(), name: match[2] };
  
  return null;
}

const fixMap = {
  // Categories
  '𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦': '𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦',
  '𝗔𝗗𝗩𝗘𝗥𝗧𝗜𝗦𝗜𝗡𝗚': '𝗔𝗗𝗩𝗘𝗥𝗧𝗜𝗦𝗜𝗡𝗚',
  '𝗦𝗨𝗣𝗢𝗥𝗧𝗘': '𝗦𝗨𝗣𝗢𝗥𝗧𝗘',
  '𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭': '𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭',
  '𝗠𝗘𝗠𝗕𝗘𝗥 𝗖𝗢𝗨𝗡𝗧': '𝗠𝗘𝗠𝗕𝗘𝗥 𝗖𝗢𝗨𝗡𝗧',
  '𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦': '𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦',
  '𝗦𝗨𝗣𝗢𝗥𝗧𝗘': '𝗦𝗨𝗣𝗢𝗥𝗧𝗘',
  '𝗧𝗜𝗖𝗞𝗘𝗧𝗦 𝗔𝗧𝗜𝗩𝗢𝗦': '𝗧𝗜𝗖𝗞𝗘𝗧𝗦 𝗔𝗧𝗜𝗩𝗢𝗦',
  '𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭': '𝗖𝗔𝗡𝗔𝗜𝗦 𝗗𝗘 𝗩𝗢𝗭',
  '𝗠𝗘𝗠𝗕𝗘𝗥 𝗖𝗢𝗨𝗡𝗧': '𝗠𝗘𝗠𝗕𝗘𝗥 𝗖𝗢𝗨𝗡𝗧',
};

client.once('ready', async () => {
  const L = (...a) => console.log(...a);
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.channels.fetch();
    let renamed = 0;
    
    // Fix categories first
    for (const ch of guild.channels.cache.values()) {
      if (ch.type !== ChannelType.GuildCategory) continue;
      if (fixMap[ch.name]) {
        const newName = fixMap[ch.name];
        if (ch.name !== newName) {
          await ch.setName(newName).catch((e) => console.log('Fail cat:', e.message));
          console.log(`CAT RENAMED: "${ch.name}" -> "${newName}"`);
          renamed++;
          await sleep(300);
        }
      }
    }
    
    // Fix text channels
    for (const ch of guild.channels.cache.values()) {
      if (ch.type !== ChannelType.GuildText) continue;
      const rawName = ch.name;
      const parsed = extractEmojiAndName(rawName);
      
      if (!parsed) {
        console.log('SKIP:', rawName);
        continue;
      }
      
      const { emoji, name } = parsed;
      const newName = formatName(emoji, name);
      
      if (ch.name !== newName) {
        await ch.setName(newName).catch((e) => console.log('Fail:', e.message, '|', rawName));
        console.log(`RENAMED: "${rawName}" -> "${newName}"`);
        renamed++;
        await sleep(300);
      }
    }
    
    // Fix voice channels (only if they don't have brackets)
    for (const ch of guild.channels.cache.values()) {
      if (ch.type !== ChannelType.GuildVoice) continue;
      if (ch.name.startsWith('[ ')) continue; // already good
      
      // Staff Voice should stay as is
      if (ch.name.includes('Staff Voice')) continue;
      
      // Membros counter already good
      if (ch.name.includes('Membros:')) continue;
      
      // Try to parse any remaining voice channels without brackets
      const parsed = extractEmojiAndName(ch.name);
      if (parsed) {
        const newName = formatName(parsed.emoji, parsed.name);
        if (ch.name !== newName) {
          await ch.setName(newName).catch((e) => console.log('Fail voice:', e.message));
          console.log(`VOICE RENAMED: "${ch.name}" -> "${newName}"`);
          renamed++;
          await sleep(300);
        }
      }
    }
    
    console.log(`\nTotal renamed: ${renamed}`);
  } catch (e) { console.log('ERR:', e.stack || e.message); }
  client.destroy();
  setTimeout(() => process.exit(0), 2000);
});

client.login(process.env.TOKEN);
setTimeout(() => process.exit(1), 180000);