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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

client.once('ready', async () => {
  console.log(`🧹 Removendo canais duplicados por ID e aplicando 𝓓: ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  // IDs dos canais duplicados a serem excluídos
  const idsParaDeletar = [
    '1552421682222862497',
    '1552421684626202775',
    '1552421687381725244',
    '1552421689583739041',
    '1552421691987337219',
    '1552421694482808942',
    '1552421696567255080',
    '1552421776900755588',
    '1552421779128057926',
    '1552421781778989100',
  ];

  for (const id of idsParaDeletar) {
    const ch = guild.channels.cache.get(id);
    if (ch) {
      console.log(`🗑️ Deletando duplicata ID: ${id} (${ch.name})`);
      await ch.delete().catch((e) => console.log(e.message));
      await sleep(200);
    }
  }

  // Renomeia os canais principais definitivos para a fonte 𝓓
  const canaisTexto = [
    { id: '1552415266590294056', nome: `〔 🤖 〕・${toScript('Comandos-Geral')}` },
    { id: '1552415253990477864', nome: `〔 📢 〕・${toScript('Comunicados')}` },
    { id: '1552415256142286878', nome: `〔 ✍🏻 〕・${toScript('Atualizacoes')}` },
    { id: '1552415258411401226', nome: `〔 🔱 〕・${toScript('Links')}` },
    { id: '1552415260848164924', nome: `〔 🏆 〕・${toScript('Ranks')}` },
    { id: '1552415263498969199', nome: `〔 ⛔ 〕・${toScript('Regras')}` },
    { id: '1552415270000267454', nome: `〔 🔴 〕・${toScript('Ticket-BR')}` },
    { id: '1552415272319844514', nome: `〔 📋 〕・${toScript('Log-Tickets')}` },
    { id: '1552415275951853569', nome: `〔 🎥 〕・${toScript('Streamers')}` },
    { id: '1552415278166704211', nome: `〔 📸 〕・${toScript('Screenshots')}` },
    { id: '1552415280528105543', nome: `〔 📺 〕・${toScript('Clips')}` },
  ];

  for (const c of canaisTexto) {
    const ch = guild.channels.cache.get(c.id);
    if (ch && ch.name !== c.nome) {
      console.log(`✏️ Renomeando Texto: "${ch.name}" -> "${c.nome}"`);
      await ch.setName(c.nome).catch((e) => console.log(e.message));
      await sleep(300);
    }
  }

  // Renomeia os canais de voz definitivos
  const canaisVoz = [
    { id: '1552419215129182210', nome: `〔 🔊 〕 ${toScript('Staff-Voice')}` },
    { id: '1552419249417363566', nome: `〔 🔊 〕 ${toScript('Geral 1')}` },
    { id: '1552415284516753451', nome: `〔 🔊 〕 ${toScript('Geral 2')}` },
    { id: '1552415292057985075', nome: `〔 🎮 〕 ${toScript('Jogando')}` },
    { id: '1552415294587281460', nome: `〔 🐉 〕 ${toScript('Boss')}` },
    { id: '1552415296659394650', nome: `〔 💤 〕 ${toScript('AFK')}` },
  ];

  for (const c of canaisVoz) {
    const ch = guild.channels.cache.get(c.id);
    if (ch && ch.name !== c.nome) {
      console.log(`✏️ Renomeando Voz: "${ch.name}" -> "${c.nome}"`);
      await ch.setName(c.nome).catch((e) => console.log(e.message));
      await sleep(300);
    }
  }

  console.log('🎉 Servidor 100% organizado com nomes únicos e fonte 𝓓!');
  process.exit(0);
});

client.login(process.env.TOKEN);
