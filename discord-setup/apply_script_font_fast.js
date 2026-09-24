const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function toScript(text) {
  const map = {
    'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗', 'I': '𝓘',
    'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡',
    'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩',
    'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲',
    'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺', 'r': '𝓻',
    's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃'
  };
  return (text || '').split('').map((char) => map[char] || char).join('');
}

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_RATELIMIT')), ms)),
  ]);

client.once('ready', async () => {
  console.log(`🤖 Aplicando fonte 𝓓 em categorias e canais: ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  // 1. Categorias
  const categorias = [
    { match: 'informac', novoNome: `[ 📢 ] ${toScript('INFORMACOES E COMANDOS')}` },
    { match: 'atendimento', novoNome: `[ 🎫 ] ${toScript('ATENDIMENTO E SUPORTE')}` },
    { match: 'comunidade', novoNome: `[ 🎮 ] ${toScript('COMUNIDADE E MIDIA')}` },
    { match: 'voz', novoNome: `[ 🔊 ] ${toScript('CANAIS DE VOZ')}` },
  ];

  for (const cat of categorias) {
    const ch = guild.channels.cache.find(
      (c) => c.type === ChannelType.GuildCategory && c.name.toLowerCase().includes(cat.match)
    );
    if (ch && ch.name !== cat.novoNome) {
      console.log(`📁 Renomeando Categoria: "${ch.name}" -> "${cat.novoNome}"`);
      try {
        await withTimeout(ch.setName(cat.novoNome), 4000);
        console.log(`   ✅ Categoria "${cat.novoNome}" atualizada!`);
      } catch (err) {
        console.log(`   ⚠️ Pulando categoria "${ch.name}" (aguardando rate limit): ${err.message}`);
      }
    }
  }

  // 2. Canais de Texto
  const canaisTexto = [
    { match: 'comandos', novoNome: `〔 🤖 〕・${toScript('Comandos-Geral')}` },
    { match: 'comunicados', novoNome: `〔 📢 〕・${toScript('Comunicados')}` },
    { match: 'atualizac', novoNome: `〔 ✍🏻 〕・${toScript('Atualizacoes')}` },
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
      console.log(`💬 Renomeando Canal Texto: "${ch.name}" -> "${item.novoNome}"`);
      try {
        await withTimeout(ch.setName(item.novoNome), 4000);
        console.log(`   ✅ "${item.novoNome}" atualizado!`);
      } catch (err) {
        console.log(`   ⚠️ Pulando "${ch.name}" (rate limit Discord): ${err.message}`);
      }
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
      console.log(`🎙️ Renomeando Canal Voz: "${ch.name}" -> "${item.novoNome}"`);
      try {
        await withTimeout(ch.setName(item.novoNome), 4000);
        console.log(`   ✅ "${item.novoNome}" atualizado!`);
      } catch (err) {
        console.log(`   ⚠️ Pulando "${ch.name}": ${err.message}`);
      }
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
    if (chMembros.name !== novoNome) {
      console.log(`👥 Atualizando Contador: "${chMembros.name}" -> "${novoNome}"`);
      try {
        await withTimeout(chMembros.setName(novoNome), 4000);
        console.log(`   ✅ Contador atualizado!`);
      } catch (err) {
        console.log(`   ⚠️ Pulando contador: ${err.message}`);
      }
    }
  }

  console.log('🎉 Processamento da fonte 𝓓 finalizado!');
  process.exit(0);
});

client.login(process.env.TOKEN);
