const { Client, GatewayIntentBits, ActivityType, PermissionFlagsBits } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', async () => {
  console.log(`🤖 Logado como ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) {
    console.error('Guild não encontrada!');
    process.exit(1);
  }

  await guild.roles.fetch();
  const me = await guild.members.fetchMe();

  // 1. Procura ou cria o cargo supremo do Bot com cor Vermelho Puro (#FF0000)
  let botRole = guild.roles.cache.find(
    (r) => r.name === '🤖 NosleiraOT-BOT' || r.name === '🤖 BOT MASTER' || r.name === '🤖 Bot Oficial'
  );

  if (!botRole) {
    botRole = await guild.roles.create({
      name: '🤖 NosleiraOT-BOT',
      color: '#FF0000', // Vermelho Intenso / Poder
      hoist: true, // Exibe destacado na lista lateral de membros
      mentionable: false,
      reason: 'Cargo de destaque vermelho para o bot administrador',
    });
    console.log('✅ Cargo "🤖 NosleiraOT-BOT" criado em Vermelho (#FF0000)!');
  } else {
    await botRole.edit({
      color: '#FF0000',
      hoist: true,
    });
    console.log('✅ Cargo "🤖 NosleiraOT-BOT" atualizado com Vermelho Puro (#FF0000)!');
  }

  // Atribui o cargo vermelho ao bot
  if (!me.roles.cache.has(botRole.id)) {
    await me.roles.add(botRole).catch(console.error);
    console.log('✅ Cargo vermelho atribuído ao bot com sucesso!');
  }

  // Tenta posicionar o cargo no topo permitido
  try {
    const highestBotRole = me.roles.botRole;
    if (highestBotRole) {
      await highestBotRole.setColor('#FF0000').catch(() => {});
    }
  } catch (err) {}

  // 2. Define o status como 'dnd' (🔴 Bolinha Vermelha de Não Perturbe)
  client.user.setPresence({
    status: 'dnd', // 🔴 Bolinha Vermelha
    activities: [
      {
        name: '🛡️ Segurança & Moderação 24/7',
        type: ActivityType.Playing,
      },
    ],
  });

  console.log('🔴 Bolinha Vermelha (DND) e Nome Vermelho ativados com sucesso!');
  
  // Aguarda 3 segundos para garantir que a presença sincronize com o Discord
  setTimeout(() => {
    process.exit(0);
  }, 3000);
});

client.login(process.env.TOKEN);
