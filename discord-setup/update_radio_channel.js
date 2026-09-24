const { Client, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

function toBoldSans(text) {
  const map = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜',
    'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥',
    'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶',
    'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿',
    's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵',
    '-': '-', ' ': ' '
  };
  return (text || '').split('').map((c) => map[c] || c).join('');
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`🤖 Logado como ${client.user.tag}`);
  const guild = client.guilds.cache.get(env.GUILD_ID);
  if (!guild) {
    console.error('❌ Servidor não encontrado!');
    process.exit(1);
  }

  await guild.channels.fetch();
  await guild.roles.fetch();

  // Localiza o canal de regras e comandos da rádio
  const chRadioComandos = guild.channels.cache.get('1552470998429990963') || guild.channels.cache.find(
    (c) => c.name.toLowerCase().includes('radio') && (c.name.toLowerCase().includes('comando') || c.name.toLowerCase().includes('regra'))
  );

  if (!chRadioComandos) {
    console.error('❌ Canal não encontrado!');
    process.exit(1);
  }

  const novoNome = `【📻】${toBoldSans('Comandos-Radio')}`;
  console.log(`✏️ Renomeando canal "${chRadioComandos.name}" -> "${novoNome}"...`);
  await chRadioComandos.setName(novoNome).catch(err => console.error('Erro ao renomear:', err.message));

  console.log(`🔒 Aplicando permissões padrão de canal de leitura/regras em "${novoNome}"...`);
  
  // Bloqueia @everyone de digitar
  await chRadioComandos.permissionOverwrites.edit(guild.roles.everyone.id, {
    ViewChannel: true,
    ReadMessageHistory: true,
    SendMessages: false,
    SendMessagesInThreads: false,
    CreatePublicThreads: false,
    CreatePrivateThreads: false,
    AddReactions: false,
  }).catch(err => console.error('Erro ao editar @everyone:', err.message));

  // Libera Dono e Admin
  const adminRoles = guild.roles.cache.filter((r) => {
    const n = r.name.toLowerCase();
    return n.includes('dono') || n.includes('admin') || r.permissions.has(PermissionFlagsBits.Administrator);
  });

  for (const [rId, role] of adminRoles) {
    await chRadioComandos.permissionOverwrites.edit(role.id, {
      ViewChannel: true,
      ReadMessageHistory: true,
      SendMessages: true,
      SendMessagesInThreads: true,
      ManageMessages: true,
      EmbedLinks: true,
      AttachFiles: true,
    }).catch(err => console.error(`Erro ao liberar ${role.name}:`, err.message));
  }

  console.log(`✅ Canal configurado com sucesso: ${novoNome} com permissões exclusivas para Dono/Admin!`);
  await client.destroy();
  process.exit(0);
});

client.login(env.TOKEN).catch((err) => {
  console.error('❌ Erro de login:', err.message);
  process.exit(1);
});
