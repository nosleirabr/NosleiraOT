const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function toScript(text) {
  const map = {
    'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗', 'I': '𝓘',
    'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡',
    'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩',
    'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲',
    'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺', 'r': '𝓻',
    's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃'
  };
  return text.split('').map(char => map[char] || char).join('');
}

client.once('ready', async () => {
  console.log(`🤖 Aplicando fonte 𝓓 (Script Bold): ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  // 1. Categorias
  const categorias = [
    { match: 'informac', novoNome: `[ 📢 ] ${toScript('Informações & Comandos')}` },
    { match: 'atendimento', novoNome: `[ 🎫 ] ${toScript('Atendimento & Suporte')}` },
    { match: 'comunidade', novoNome: `[ 🎮 ] ${toScript('Comunidade & Mídia')}` },
    { match: 'voz', novoNome: `[ 🔊 ] ${toScript('Canais de Voz')}` },
  ];

  for (const cat of categorias) {
    const ch = guild.channels.cache.find(
      (c) => c.type === ChannelType.GuildCategory && c.name.toLowerCase().includes(cat.match)
    );
    if (ch && ch.name !== cat.novoNome) {
      console.log(`📁 Categoria: "${ch.name}" -> "${cat.novoNome}"`);
      await ch.setName(cat.novoNome).catch((e) => console.log(e.message));
      await sleep(400);
    }
  }

  // 2. Canais de Texto
  const canaisTexto = [
    { match: 'comandos', novoNome: `〔 🤖 〕・${toScript('Comandos-Geral')}` },
    { match: 'comunicados', novoNome: `〔 📢 〕・${toScript('Comunicados')}` },
    { match: 'atualizac', novoNome: `〔 ✍🏻 〕・${toScript('Atualizações')}` },
    { match: 'links', novoNome: `〔 🔱 〕・${toScript('Links')}` },
    { match: 'ranks', novoNome: `〔 🏆 〕・${toScript('Ranks')}` },
    { match: 'regras', novoNome: `〔 ⛔ 〕・${toScript('Regras')}` },
    { match: 'ticket-br', novoNome: `〔 🔴 〕・${toScript('Ticket-BR')}` },
    { match: 'log-tickets', novoNome: `〔 📋 〕・${toScript('Log-Tickets')}` },
    { match: 'streamers', novoNome: `〔 🎥 〕・${toScript('Streamers')}` },
    { match: 'screenshots', novoNome: `〔 📸 〕・${toScript('Screenshots')}` },
    { match: 'clips', novoNome: `〔 📺 〕・${toScript('Clips')}` },
  ];

  for (const item of canaisTexto) {
    const ch = guild.channels.cache.find(
      (c) => c.type === ChannelType.GuildText && c.name.toLowerCase().includes(item.match)
    );
    if (ch && ch.name !== item.novoNome) {
      console.log(`💬 Canal de Texto: "${ch.name}" -> "${item.novoNome}"`);
      await ch.setName(item.novoNome).catch((e) => console.log(e.message));
      await sleep(400);
    }
  }

  // 3. Canais de Voz
  const canaisVoz = [
    { match: 'geral 1', novoNome: `〔 🔊 〕 ${toScript('Geral 1')}` },
    { match: 'geral 2', novoNome: `〔 🔊 〕 ${toScript('Geral 2')}` },
    { match: 'jogando', novoNome: `〔 🎮 〕 ${toScript('Jogando')}` },
    { match: 'boss', novoNome: `〔 🐉 〕 ${toScript('Boss')}` },
    { match: 'afk', novoNome: `〔 💤 〕 ${toScript('AFK')}` },
    { match: 'staff-voice', novoNome: `〔 🔊 〕 ${toScript('Staff-Voice')}` },
  ];

  for (const item of canaisVoz) {
    const ch = guild.channels.cache.find(
      (c) => c.type === ChannelType.GuildVoice && !c.name.includes('Membros') && c.name.toLowerCase().includes(item.match)
    );
    if (ch && ch.name !== item.novoNome) {
      console.log(`🎙️ Canal de Voz: "${ch.name}" -> "${item.novoNome}"`);
      await ch.setName(item.novoNome).catch((e) => console.log(e.message));
      await sleep(400);
    }
  }

  // 4. Contador de Membros
  const chMembros = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildVoice && (c.name.includes('Membros') || c.name.includes('👥'))
  );
  if (chMembros) {
    const members = await guild.members.fetch().catch(() => null);
    const total = members ? members.filter((m) => !m.user.bot).size : guild.memberCount;
    const online = members
      ? members.filter((m) => m.presence && m.presence.status !== 'offline' && !m.user.bot).size
      : 1;
    const novoNome = `⌈ 👥 ⌋ ${toScript('Membros')}: 🟢[${online}] 🔴[${total}]`;
    console.log(`👥 Contador: "${chMembros.name}" -> "${novoNome}"`);
    await chMembros.setName(novoNome).catch((e) => console.log(e.message));
  }

  console.log('🎉 Todos os canais foram renomeados com sucesso usando a fonte estilizada 𝓓!');
  process.exit(0);
});

client.login(process.env.TOKEN);
