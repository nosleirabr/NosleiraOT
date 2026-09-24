const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), ms)),
  ]);

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
  console.log(`🤖 Configurando permissões de Voz, AFK 30min e Nomes: ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  // 1. Ajuste dos nomes das salas de voz
  const canaisVoz = [
    { id: '1552419249417363566', nome: `【🔊】 ${toBoldSans('Geral 1')}` },
    { id: '1552415284516753451', nome: `【🔊】 ${toBoldSans('Geral 2')}` },
    { id: '1552415292057985075', nome: `【🎮】 ${toBoldSans('Jogando')}` },
    { id: '1552415294587281460', nome: `【🐉】 ${toBoldSans('Boss')}` },
    { id: '1552415296659394650', nome: `【💤】 ${toBoldSans('AFK')}` },
    { id: '1552419215129182210', nome: `【🔊】 ${toBoldSans('Staff-Voice')}` },
  ];

  for (const item of canaisVoz) {
    const ch = guild.channels.cache.get(item.id);
    if (ch && ch.name !== item.nome) {
      console.log(`🎙️ Ajustando nome de voz: "${ch.name}" -> "${item.nome}"`);
      try {
        await withTimeout(ch.setName(item.nome), 3000);
        console.log(`   ✅ "${item.nome}" atualizado!`);
      } catch (err) {
        console.log(`   ⚠️ Pulando nome "${item.nome}": ${err.message}`);
      }
      await sleep(200);
    }
  }

  // 2. Configura permissões livres de transmissão e fotos para Geral 1, Geral 2, Jogando e Boss
  const salasLivres = ['1552419249417363566', '1552415284516753451', '1552415292057985075', '1552415294587281460'];

  for (const chId of salasLivres) {
    const ch = guild.channels.cache.get(chId);
    if (ch) {
      await ch.permissionOverwrites.edit(guild.roles.everyone, {
        ViewChannel: true,
        Connect: true,
        Speak: true,
        Stream: true,             // Compartilhar tela liberado
        SendMessages: true,       // Enviar mensagens no chat de voz liberado
        AttachFiles: true,        // Postar imagens/fotos liberado
        EmbedLinks: false,        // Bloqueado links de bet/scams
        UseVAD: true,             // Ativação por voz liberada
        UseSoundboard: true,
      });
      console.log(`✅ Permissões liberadas (Tela + Fotos) em: ${ch.name}`);
    }
  }

  // 3. Configura Canal AFK Oficial e Timeout de 30 minutos (1800s) no Servidor
  const chAFK = guild.channels.cache.get('1552415296659394650');
  if (chAFK) {
    await guild.setAFKChannel(chAFK).catch((e) => console.log(e.message));
    await guild.setAFKTimeout(1800).catch((e) => console.log(e.message)); // 30 minutos
    console.log(`💤 Configuração do servidor: Canal AFK definido com timeout de 30 minutos!`);
  }

  console.log('🎉 Todas as salas de voz e sistema AFK configurados com sucesso!');
  process.exit(0);
});

client.login(process.env.TOKEN);
