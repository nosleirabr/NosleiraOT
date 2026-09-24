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

client.once('ready', async () => {
  console.log(`🧹 Limpando canais duplicados e alinhando: ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  // Canais esperados (um por tipo/nome lógico)
  const esperadosTexto = [
    { key: 'comandos', nome: `〔 🤖 〕・${toScript('Comandos-Geral')}` },
    { key: 'comunicados', nome: `〔 📢 〕・${toScript('Comunicados')}` },
    { key: 'atualizac', nome: `〔 ✍🏻 〕・${toScript('Atualizacoes')}` },
    { key: 'links', nome: `〔 🔱 〕・${toScript('Links')}` },
    { key: 'ranks', nome: `〔 🏆 〕・${toScript('Ranks')}` },
    { key: 'regras', nome: `〔 ⛔ 〕・${toScript('Regras')}` },
    { key: 'ticket-br', nome: `〔 🔴 〕・${toScript('Ticket-BR')}` },
    { key: 'log-tickets', nome: `〔 📋 〕・${toScript('Log-Tickets')}` },
    { key: 'streamers', nome: `〔 🎥 〕・${toScript('Streamers')}` },
    { key: 'screenshots', nome: `〔 📸 〕・${toScript('Screenshots')}` },
    { key: 'clips', nome: `〔 📺 〕・${toScript('Clips')}` },
  ];

  const esperadosVoz = [
    { key: 'staff-voice', nome: `〔 🔊 〕 ${toScript('Staff-Voice')}` },
    { key: 'geral 1', nome: `〔 🔊 〕 ${toScript('Geral 1')}` },
    { key: 'geral 2', nome: `〔 🔊 〕 ${toScript('Geral 2')}` },
    { key: 'jogando', nome: `〔 🎮 〕 ${toScript('Jogando')}` },
    { key: 'boss', nome: `〔 🐉 〕 ${toScript('Boss')}` },
    { key: 'afk', nome: `〔 💤 〕 ${toScript('AFK')}` },
  ];

  // Deletar qualquer canal de texto sem categoria solto na raiz (ex: 【👥】𝗠𝗲𝗺𝗯𝗿𝗼𝘀)
  const soltos = guild.channels.cache.filter((c) => !c.parentId && c.type !== ChannelType.GuildCategory);
  for (const c of soltos.values()) {
    console.log(`🗑️ Deletando canal solto sem categoria: ${c.name} (${c.id})`);
    await c.delete().catch(() => {});
  }

  // Deduplicar texto
  for (const esp of esperadosTexto) {
    const correspondentes = guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildText && (
        c.name.toLowerCase().includes(esp.key) ||
        c.name.normalize('NFKD').toLowerCase().includes(esp.key)
      )
    );

    if (correspondentes.size > 1) {
      console.log(`⚠️ Encontrados ${correspondentes.size} canais para "${esp.key}"`);
      // Manter o primeiro e deletar os excedentes
      const arr = Array.from(correspondentes.values());
      const principal = arr[0];
      for (let i = 1; i < arr.length; i++) {
        console.log(`   🗑️ Deletando duplicata: ${arr[i].name} (${arr[i].id})`);
        await arr[i].delete().catch(() => {});
      }
      await principal.setName(esp.nome).catch(() => {});
    } else if (correspondentes.size === 1) {
      const ch = correspondentes.first();
      if (ch.name !== esp.nome) {
        await ch.setName(esp.nome).catch(() => {});
      }
    }
  }

  // Deduplicar voz
  for (const esp of esperadosVoz) {
    const correspondentes = guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildVoice && !c.name.includes('Membros') && !c.name.includes('👥') && (
        c.name.toLowerCase().includes(esp.key) ||
        c.name.normalize('NFKD').toLowerCase().includes(esp.key)
      )
    );

    if (correspondentes.size > 1) {
      console.log(`⚠️ Encontrados ${correspondentes.size} canais de voz para "${esp.key}"`);
      const arr = Array.from(correspondentes.values());
      const principal = arr[0];
      for (let i = 1; i < arr.length; i++) {
        console.log(`   🗑️ Deletando duplicata de voz: ${arr[i].name} (${arr[i].id})`);
        await arr[i].delete().catch(() => {});
      }
      await principal.setName(esp.nome).catch(() => {});
    } else if (correspondentes.size === 1) {
      const ch = correspondentes.first();
      if (ch.name !== esp.nome) {
        await ch.setName(esp.nome).catch(() => {});
      }
    }
  }

  console.log('✅ Servidor perfeitamente limpo, organizado e deduplicado!');
  process.exit(0);
});

client.login(process.env.TOKEN);
