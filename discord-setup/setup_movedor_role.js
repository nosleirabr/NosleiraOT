const { Client, GatewayIntentBits, PermissionFlagsBits, ChannelType } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`🤖 Configurando Cargo Movedor e Permissões: ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.roles.fetch();
  await guild.channels.fetch();

  // 1. Cria ou obtém o cargo 🔀 Movedor
  let roleMovedor = guild.roles.cache.find((r) => r.name.includes('Movedor'));
  if (!roleMovedor) {
    roleMovedor = await guild.roles.create({
      name: '🔀 Movedor',
      color: '#00A8FF',
      mentionable: false,
      permissions: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.Connect,
        PermissionFlagsBits.Speak,
        PermissionFlagsBits.MoveMembers,
      ],
      reason: 'Cargo com permissão de mover membros em salas públicas',
    });
    console.log(`✅ Cargo criado: 🔀 Movedor (${roleMovedor.id})`);
  } else {
    await roleMovedor.edit({
      permissions: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.Connect,
        PermissionFlagsBits.Speak,
        PermissionFlagsBits.MoveMembers,
      ],
    });
    console.log(`✅ Cargo 🔀 Movedor atualizado com permissão de mover membros!`);
  }

  // 2. Configura restrições no canal Staff-Voice
  const chStaffVoice = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildVoice && c.name.toLowerCase().includes('staff')
  );

  if (chStaffVoice) {
    // Bloqueia expressamente o cargo Movedor de conectar e mover para dentro da Staff Voice
    await chStaffVoice.permissionOverwrites.edit(roleMovedor, {
      ViewChannel: false,
      Connect: false,
      MoveMembers: false,
    });

    // Bloqueia @everyone
    await chStaffVoice.permissionOverwrites.edit(guild.roles.everyone, {
      ViewChannel: false,
      Connect: false,
      MoveMembers: false,
    });
    console.log(`🔒 Restrição configurada no canal ${chStaffVoice.name}: Movedores e @everyone BLOQUEADOS.`);
  }

  // 3. Configura restrições no Contador de Membros
  const chContador = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildVoice && (c.name.includes('Membros') || c.name.includes('👥'))
  );
  if (chContador) {
    await chContador.permissionOverwrites.edit(roleMovedor, {
      Connect: false,
      MoveMembers: false,
    });
    await chContador.permissionOverwrites.edit(guild.roles.everyone, {
      Connect: false,
      MoveMembers: false,
    });
    console.log(`🔒 Restrição configurada no canal ${chContador.name}: Conexão e movimentação bloqueadas.`);
  }

  // 4. Configura canais públicos para permitir movimentação
  const canaisPublicos = guild.channels.cache.filter(
    (c) =>
      c.type === ChannelType.GuildVoice &&
      !c.name.toLowerCase().includes('staff') &&
      !c.name.includes('Membros') &&
      !c.name.includes('👥')
  );

  for (const ch of canaisPublicos.values()) {
    await ch.permissionOverwrites.edit(roleMovedor, {
      ViewChannel: true,
      Connect: true,
      Speak: true,
      MoveMembers: true,
    });
    console.log(`🔊 Permissão de Movedor liberada em ${ch.name}`);
  }

  console.log('🎉 Cargo 🔀 Movedor configurado com sucesso e limites 100% seguros!');
  process.exit(0);
});

client.login(process.env.TOKEN);
