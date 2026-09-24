const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

client.once('ready', async () => {
  console.log(`🤖 Aplicando ícones exatos de voz: ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  const canaisVoz = [
    { match: 'geral 1', novoNome: '〔 🔊 〕 Geral 1' },
    { match: 'geral 2', novoNome: '〔 🔊 〕 Geral 2' },
    { match: 'jogando', novoNome: '〔 🎮 〕 Jogando' },
    { match: 'boss', novoNome: '〔 🐉 〕 Boss' },
    { match: 'afk', novoNome: '〔 💤 〕 AFK' },
    { match: 'staff-voice', novoNome: '〔 🔊 〕 Staff-Voice' },
  ];

  for (const item of canaisVoz) {
    const ch = guild.channels.cache.find(
      (c) => c.name.toLowerCase().includes(item.match) && c.type === ChannelType.GuildVoice
    );
    if (ch) {
      console.log(`✏️ Renomeando canal de voz "${ch.name}" -> "${item.novoNome}"`);
      await ch.setName(item.novoNome).catch((e) => console.log(e.message));
      await sleep(400);
    }
  }

  console.log('✅ Canais de voz 100% atualizados com o padrão da foto!');
  process.exit(0);
});

client.login(process.env.TOKEN);
