const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function toBoldSans(text) {
  const map = {
    A:'𝗔',B:'𝗕',C:'𝗖',D:'𝗗',E:'𝗘',F:'𝗙',G:'𝗚',H:'𝗛',I:'𝗜',J:'𝗝',
    K:'𝗞',L:'𝗟',M:'𝗠',N:'𝗡',O:'𝗢',P:'𝗣',Q:'𝗤',R:'𝗥',S:'𝗦',T:'𝗧',
    U:'𝗨',V:'𝗩',W:'𝗪',X:'𝗫',Y:'𝗬',Z:'𝗭',
    a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',
    k:'𝗸',l:'𝗹',m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',
    u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',y:'𝘆',z:'𝘇',
    '0':'𝟬','1':'𝟭','2':'𝟮','3':'𝟯','4':'𝟰','5':'𝟱','6':'𝟲','7':'𝟳','8':'𝟴','9':'𝟵',
    '-':'-'
  };
  return text.split('').map(c => map[c] ?? c).join('');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

client.once('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  // Remove o canal duplicado de staff voice em canais de voz
  const dupStaff = guild.channels.cache.get('1550954806754021381');
  if (dupStaff) await dupStaff.delete().catch(() => {});

  const nomesFormatados = [
    { match: 'comandos', nome: `【🤖】${toBoldSans('Comandos-Geral')}` },
    { match: 'comunicados', nome: `【📢】${toBoldSans('Comunicados')}` },
    { match: 'atualiza', nome: `【✍🏻】${toBoldSans('Atualizações')}` },
    { match: 'links', nome: `【🔱】${toBoldSans('Links')}` },
    { match: 'ranks', nome: `【🏆】${toBoldSans('Ranks')}` },
    { match: 'regras', nome: `【⛔】${toBoldSans('Regras')}` },
    { match: 'ticket-br', nome: `【🔴】${toBoldSans('Ticket-BR')}` },
    { match: 'log-tickets', nome: `【📋】${toBoldSans('Log-Tickets')}` },
    { match: 'streamers', nome: `【🎥】${toBoldSans('Streamers')}` },
    { match: 'screenshots', nome: `【📸】${toBoldSans('Screenshots')}` },
    { match: 'clips', nome: `【📺】${toBoldSans('Clips')}` },
    { match: 'staff-voice', nome: `【🔊】Staff-Voice` },
    { match: 'geral 1', nome: `【🔊】Geral 1` },
    { match: 'geral 2', nome: `【🔊】Geral 2` },
    { match: 'jogando', nome: `【🎮】Jogando` },
    { match: 'boss', nome: `【🐉】Boss` },
    { match: 'afk', nome: `【💤】AFK` },
  ];

  for (const item of nomesFormatados) {
    const ch = guild.channels.cache.find(c => c.name.toLowerCase().includes(item.match));
    if (ch && ch.name !== item.nome) {
      console.log(`✏️ Renomeando "${ch.name}" -> "${item.nome}"`);
      await ch.setName(item.nome).catch((e) => console.log(e.message));
      await sleep(350);
    }
  }

  process.exit(0);
});

client.login(process.env.TOKEN);
