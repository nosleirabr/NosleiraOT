const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_RATELIMIT')), ms)),
  ]);

// Mapeamento para Sans-Serif Bold
function toBoldSans(text) {
  const map = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜',
    'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥',
    'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶',
    'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿',
    's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵',
  };
  return (text || '').split('').map((char) => map[char] || char).join('');
}

client.once('ready', async () => {
  console.log(`🤖 Removendo todos os traços indesejados e padronizando: ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  // Canais de Texto exatos (SEM espaço após colchete para não virar traço no Discord)
  const canaisTexto = [
    { id: '1552415266590294056', nome: `【🤖】${toBoldSans('Comandos-Geral')}` },
    { id: '1552415253990477864', nome: `【📢】${toBoldSans('Comunicados')}` },
    { id: '1552415256142286878', nome: `【✍🏻】${toBoldSans('Atualizacoes')}` },
    { id: '1552415258411401226', nome: `【🔱】${toBoldSans('Links')}` },
    { id: '1552415260848164924', nome: `【🏆】${toBoldSans('Ranks')}` },
    { id: '1552415263498969199', nome: `【⛔】${toBoldSans('Regras')}` },
    { id: '1552415270000267454', nome: `【🔴】${toBoldSans('Ticket-BR')}` },
    { id: '1552415272319844514', nome: `【📋】${toBoldSans('Log-Tickets')}` },
    { id: '1552415275951853569', nome: `【🎥】${toBoldSans('Streamers')}` },
    { id: '1552415278166704211', nome: `【📸】${toBoldSans('Screenshots')}` },
    { id: '1552415280528105543', nome: `【📺】${toBoldSans('Clips')}` },
  ];

  for (const c of canaisTexto) {
    const ch = guild.channels.cache.get(c.id);
    if (ch && ch.name !== c.nome) {
      console.log(`💬 Renomeando Texto: "${ch.name}" -> "${c.nome}"`);
      try {
        await withTimeout(ch.setName(c.nome), 3500);
        console.log(`   ✅ "${c.nome}" ajustado com sucesso!`);
      } catch (err) {
        console.log(`   ⚠️ Pulando "${c.nome}": ${err.message}`);
      }
      await sleep(250);
    }
  }

  // Canais de Voz exatos
  const canaisVoz = [
    { id: '1552419215129182210', nome: `【🔊】 ${toBoldSans('Staff-Voice')}` },
    { id: '1552419249417363566', nome: `【🔊】 ${toBoldSans('Geral 1')}` },
    { id: '1552415284516753451', nome: `【🔊】 ${toBoldSans('Geral 2')}` },
    { id: '1552415292057985075', nome: `【🎮】 ${toBoldSans('Jogando')}` },
    { id: '1552415294587281460', nome: `【🐉】 ${toBoldSans('Boss')}` },
    { id: '1552415296659394650', nome: `【💤】 ${toBoldSans('AFK')}` },
  ];

  for (const c of canaisVoz) {
    const ch = guild.channels.cache.get(c.id);
    if (ch && ch.name !== c.nome) {
      console.log(`🎙️ Renomeando Voz: "${ch.name}" -> "${c.nome}"`);
      try {
        await withTimeout(ch.setName(c.nome), 3500);
        console.log(`   ✅ "${c.nome}" ajustado com sucesso!`);
      } catch (err) {
        console.log(`   ⚠️ Pulando "${c.nome}": ${err.message}`);
      }
      await sleep(250);
    }
  }

  console.log('🎉 Todos os nomes foram limpos e formatados sem traço extra!');
  process.exit(0);
});

client.login(process.env.TOKEN);
