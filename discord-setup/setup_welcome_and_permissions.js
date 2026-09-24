const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  AttachmentBuilder,
} = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function toScript(text) {
  const map = {
    'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗', 'I': '𝓘',
    'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡',
    'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩',
    'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲',
    'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺', 'r': '𝓻',
    's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃'
  };
  return (text || '').split('').map((char) => map[char] || char).join('');
}

const BANNER_PATH = path.join(__dirname, 'assets', 'welcome_banner.jpg');
const SITE_URL = 'https://www.nosleiraot.com';

client.once('ready', async () => {
  console.log(`🤖 Logado como ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) {
    console.error('❌ Servidor não encontrado!');
    process.exit(1);
  }

  await guild.channels.fetch();

  // 1. Localiza a categoria Informações & Comandos
  const catInfo = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && (
      c.name.toLowerCase().includes('informac') ||
      c.name.normalize('NFKD').toLowerCase().includes('informac') ||
      c.name.includes('📢')
    )
  );

  console.log(`📁 Categoria encontrada: ${catInfo ? catInfo.name : 'Nenhuma (criando no topo)'}`);

  // 2. Canal de Boas-Vindas
  const nomeBoasVindas = `〔 👋 〕・${toScript('Bem-Vindos')}`;
  let chBV = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildText && (
      c.name.toLowerCase().includes('bem-vindo') ||
      c.name.toLowerCase().includes('welcome') ||
      c.name.normalize('NFKD').toLowerCase().includes('bem-vindo')
    )
  );

  if (!chBV) {
    console.log(`✨ Criando canal "${nomeBoasVindas}"...`);
    chBV = await guild.channels.create({
      name: nomeBoasVindas,
      type: ChannelType.GuildText,
      parent: catInfo ? catInfo.id : null,
      position: 0,
      topic: '👋 Central oficial de boas-vindas do NosleiraOT 7.4!',
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.AddReactions,
          ],
          deny: [
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.CreatePublicThreads,
            PermissionFlagsBits.CreatePrivateThreads,
            PermissionFlagsBits.SendMessagesInThreads,
          ],
        },
      ],
    });
    console.log(`✅ Canal criado: ${chBV.name}`);
  } else {
    console.log(`✏️ Ajustando canal existente: ${chBV.name}`);
    if (catInfo && chBV.parentId !== catInfo.id) {
      await chBV.setParent(catInfo.id, { lockPermissions: false }).catch(() => {});
    }
    await chBV.setPosition(0).catch(() => {});
    if (chBV.name !== nomeBoasVindas) {
      await chBV.setName(nomeBoasVindas).catch(() => {});
    }
    await chBV.permissionOverwrites.edit(guild.roles.everyone.id, {
      ViewChannel: true,
      ReadMessageHistory: true,
      AddReactions: true,
      SendMessages: false,
      CreatePublicThreads: false,
      CreatePrivateThreads: false,
      SendMessagesInThreads: false,
    }).catch(() => {});
  }

  // 3. Verifica se precisa enviar a mensagem mestre de boas-vindas
  const msgsBV = await chBV.messages.fetch({ limit: 5 }).catch(() => null);
  if (!msgsBV || msgsBV.size === 0) {
    console.log('📢 Publicando mensagem mestre e banner no canal de Boas-Vindas...');
    
    const chRegras = guild.channels.cache.find((c) => c.name.toLowerCase().includes('regras'));
    const chComandos = guild.channels.cache.find((c) => c.name.toLowerCase().includes('comandos'));
    const chTicket = guild.channels.cache.find((c) => c.name.toLowerCase().includes('ticket'));
    const chLinks = guild.channels.cache.find((c) => c.name.toLowerCase().includes('links'));

    const embedMaster = new EmbedBuilder()
      .setColor('#E67E22')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Servidor Oficial',
        iconURL: guild.iconURL({ dynamic: true }) || undefined,
      })
      .setTitle('⚔️  BEM-VINDO(A) AO NOSLEIRA OT 7.4!  ⚔️')
      .setDescription(
        'Seja muito bem-vindo(a) ao servidor oficial do **NosleiraOT 7.4**!\n' +
        'O verdadeiro clássico **Old School** no melhor estilo RPG com estabilidade e dedicação.\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        '📜 **ATALHOS & INFORMAÇÕES ÚTEIS:**\n\n' +
        `> 🌐 **Site Oficial:** [nosleira74.com](${SITE_URL}) — Crie sua conta e gerencie seus personagens\n` +
        `> ⛔ **Diretrizes & Regras:** ${chRegras ? `<#${chRegras.id}>` : '#regras'} — Leia para evitar punições\n` +
        `> 🤖 **Guia de Comandos:** ${chComandos ? `<#${chComandos.id}>` : '#comandos-geral'} — Comandos e utilitários\n` +
        `> 🔱 **Links & Downloads:** ${chLinks ? `<#${chLinks.id}>` : '#links'} — Links rápidos do cliente\n` +
        `> 🔴 **Central de Suporte:** ${chTicket ? `<#${chTicket.id}>` : '#ticket-br'} — Abra um chamado com nossa equipe\n\n` +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        '🛡️ *Fique atento aos comunicados e divirta-se com nossa comunidade!*'
      )
      .setImage('attachment://welcome_banner.jpg')
      .setFooter({ text: 'NosleiraOT 7.4 • Boas-Vindas', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    const files = [];
    if (fs.existsSync(BANNER_PATH)) {
      files.push(new AttachmentBuilder(BANNER_PATH, { name: 'welcome_banner.jpg' }));
    }

    await chBV.send({
      embeds: [embedMaster],
      files: files.length > 0 ? files : undefined,
    }).catch(console.error);
    console.log('✅ Mensagem mestre de Boas-Vindas enviada!');
  }

  // 4. Bloqueia e configura canal de Log-Tickets (Histórico travado / read-only)
  const chLog = guild.channels.cache.find(
    (c) => c.name.toLowerCase().includes('log-ticket') || c.name.toLowerCase().includes('log-tickets')
  );
  if (chLog) {
    console.log(`🔒 Travando canal ${chLog.name} como Histórico Read-Only...`);
    await chLog.permissionOverwrites.edit(guild.roles.everyone.id, {
      ViewChannel: true,
      ReadMessageHistory: true,
      SendMessages: false,
      SendMessagesInThreads: false,
      CreatePublicThreads: false,
      CreatePrivateThreads: false,
      AddReactions: false,
    }).catch(() => {});
    console.log('✅ Canal de Logs protegido com sucesso.');
  }

  console.log('\n🎉 Configuração de Boas-Vindas e Logs concluída!');
  process.exit(0);
});

client.login(process.env.TOKEN);
