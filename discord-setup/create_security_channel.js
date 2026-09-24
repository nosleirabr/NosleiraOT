const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) {
      console.error('Guild não encontrada!');
      process.exit(1);
    }
    await guild.channels.fetch();
    
    // Procura a categoria achando o canal de ticket log
    const ticketLog = guild.channels.cache.find(c => c.name.includes('𝐋𝐨𝐠-𝐓𝐢𝐜𝐤𝐞𝐭𝐬') || c.name.toLowerCase().includes('log-ticket'));
    let parentId = ticketLog ? ticketLog.parentId : null;
    
    if (!parentId) {
      console.log('Categoria não encontrada através do canal de log de tickets. Criando sem categoria e você move.');
    }

    // Configuração de Permissões (igual a staffOnly do setup)
    const ev = guild.roles.everyone.id;
    
    // Localiza cargos staff
    const rolesStaff = ['🎓 Tutor', '⭐ Sênior Tutor', '🛡️ Community Manager', '🔱 Game Master', '👑 Administrador', '💠 Dono'];
    const rm = {};
    await guild.roles.fetch();
    guild.roles.cache.forEach(r => rm[r.name] = r);
    
    const permissionOverwrites = [
      { id: ev, deny: [PermissionFlagsBits.ViewChannel] }
    ];

    rolesStaff.forEach(roleName => {
      if (rm[roleName]) {
        permissionOverwrites.push({
          id: rm[roleName].id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
        });
      }
    });

    // Cria o canal de Segurança
    const channelName = '[ 🔒 ] 𝐋𝐨𝐠-𝐒𝐞𝐠𝐮𝐫𝐚𝐧𝐜𝐚';
    const existingChannel = guild.channels.cache.find(c => c.name === channelName);
    
    if (existingChannel) {
      console.log(`Canal ${channelName} já existe!`);
    } else {
      const ch = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: parentId || undefined,
        topic: 'Log de segurança, atividade de Discord e automod.',
        permissionOverwrites: permissionOverwrites
      });
      console.log(`✅ Canal criado com sucesso: ${ch.name}`);
    }
    
  } catch (error) {
    console.error('Erro ao criar canal:', error);
  } finally {
    process.exit(0);
  }
});

client.login(process.env.TOKEN);
