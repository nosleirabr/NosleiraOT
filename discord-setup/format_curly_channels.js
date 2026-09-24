const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

client.once('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  console.log('🔄 Formatando canais com as chaves estilizadas ❴ ❵ sem traços feios...');

  // Mapeamento de canais para o formato novo ❴...❵
  const formatMap = [
    // Informações
    { match: 'comunicados', novoNome: '❴📣❵・comunicados' },
    { match: 'atualiza', novoNome: '❴✏️❵・atualizações' },
    { match: 'links', novoNome: '❴🔗❵・links' },
    { match: 'ranks', novoNome: '❴🏆❵・ranks' },
    { match: 'regras', novoNome: '❴⛔❵・regras' },
    { match: 'comandos', novoNome: '❴🤖❵・comandos-geral' },

    // Suporte
    { match: 'ticket-br', novoNome: '❴🔴❵・ticket-br' },
    { match: 'log-tickets', novoNome: '❴📋❵・log-tickets' },

    // Mídia
    { match: 'streamers', novoNome: '❴🎥❵・streamers' },
    { match: 'screenshots', novoNome: '❴📸❵・screenshots' },
    { match: 'clips', novoNome: '❴📺❵・clips' },

    // Voz
    { match: 'geral 1', novoNome: '❴🔊❵ Geral 1' },
    { match: 'geral 2', novoNome: '❴🔊❵ Geral 2' },
    { match: 'jogando', novoNome: '❴🎮❵ Jogando' },
    { match: 'boss', novoNome: '❴🐉❵ Boss' },
    { match: 'afk', novoNome: '❴💤❵ AFK' },
    { match: 'staff voice', novoNome: '❴🔒❵ Staff Voice' },
  ];

  for (const item of formatMap) {
    const ch = guild.channels.cache.find(
      (c) => c.name.toLowerCase().includes(item.match)
    );
    if (ch) {
      if (ch.name !== item.novoNome) {
        console.log(`  ✏️ Renomeando "${ch.name}" -> "${item.novoNome}"`);
        await ch.setName(item.novoNome).catch((err) => {
          console.error(`     Erro ao renomear ${ch.name}: ${err.message}`);
        });
        await sleep(500);
      } else {
        console.log(`  ✅ Já está correto: "${ch.name}"`);
      }
    }
  }

  // Canal de membros
  const chMembros = guild.channels.cache.find(
    (c) => (c.name.includes('Membros') || c.name.includes('👥')) && c.type === ChannelType.GuildVoice
  );
  if (chMembros) {
    const nomeMembros = '❴👥❵ Membros-🟢[1]-🔴[2]';
    await chMembros.setName(nomeMembros).catch(() => {});
    console.log(`  ✅ Canal de Membros formatado: "${nomeMembros}"`);
  }

  console.log('\n🎉 Todos os canais foram atualizados com as chaves ❴ ❵!');
  process.exit(0);
});

client.login(process.env.TOKEN);
