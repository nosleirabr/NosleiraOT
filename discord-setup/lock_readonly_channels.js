const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Canais que devem ser somente leitura (ninguém posta, apenas Dono/Admin)
const READONLY_KEYWORDS = [
  'regra',
  'ranking',
  'link',
  'download',
  'atualiza',
  'update',
  'comunicado',
  'anuncio',
  'bem-vindo',
  'welcome',
  'informac',
  'vocaç',
  'vocac'
];

client.once('ready', async () => {
  console.log(`🤖 Logado como ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) {
    console.error('❌ Servidor não encontrado!');
    process.exit(1);
  }

  await guild.channels.fetch();
  await guild.roles.fetch();

  // Localiza cargo de Dono / Administrador / Admin se existir
  const adminRoles = guild.roles.cache.filter((r) => {
    const n = r.name.toLowerCase();
    return n.includes('dono') || n.includes('admin') || n.includes('propriet') || r.permissions.has(PermissionFlagsBits.Administrator);
  });

  console.log(`👑 Cargos administrativos identificados: ${adminRoles.map(r => r.name).join(', ') || 'Nenhum específico (usa Admin Perms)'}`);

  let lockedCount = 0;

  for (const [id, channel] of guild.channels.cache) {
    if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement) {
      const chName = channel.name.toLowerCase().normalize('NFKD');
      const isReadOnly = READONLY_KEYWORDS.some((kw) => chName.includes(kw));

      if (isReadOnly) {
        console.log(`🔒 Trancando canal: #${channel.name} (${channel.id})...`);

        // 1. Bloqueia envio de mensagens para @everyone
        await channel.permissionOverwrites.edit(guild.roles.everyone.id, {
          ViewChannel: true,
          ReadMessageHistory: true,
          SendMessages: false,
          SendMessagesInThreads: false,
          CreatePublicThreads: false,
          CreatePrivateThreads: false,
          AddReactions: false,
        }).catch((err) => console.error(`Erro ao trancar @everyone em #${channel.name}:`, err.message));

        // 2. Garante permissão explícita para os cargos de Dono/Admin
        for (const [rId, role] of adminRoles) {
          await channel.permissionOverwrites.edit(role.id, {
            ViewChannel: true,
            ReadMessageHistory: true,
            SendMessages: true,
            SendMessagesInThreads: true,
            ManageMessages: true,
            EmbedLinks: true,
            AttachFiles: true,
          }).catch((err) => console.error(`Erro ao dar permissão para ${role.name} em #${channel.name}:`, err.message));
        }

        lockedCount++;
      }
    }
  }

  console.log(`\n✅ Concluído! ${lockedCount} canais foram trancados com sucesso para apenas o Dono/Admin poder postar.`);
  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN).catch((err) => {
  console.error('❌ Falha ao logar no Discord:', err.message);
  process.exit(1);
});
