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
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const BANNER_PATH = path.join(__dirname, 'assets', 'welcome_banner.jpg');
const SITE_URL = 'https://www.nosleiraot.com';

client.once('ready', async () => {
  console.log(`🤖 Logado como ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  // 1. Deletar canal antigo com hífens/itálico
  const chAntigo = guild.channels.cache.find(
    (c) => c.name.includes('𝓑𝓮𝓶-𝓥𝓲𝓷𝓭𝓸𝓼') || c.name.includes('〔-👋-〕')
  );
  if (chAntigo) {
    console.log(`🗑️ Removendo canal antigo duplicado: ${chAntigo.name}`);
    await chAntigo.delete('Substituído pelo canal no formato oficial');
  }

  // 2. Localizar categoria Informações & Comandos
  const catInfo = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && (
      c.name.includes('𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗢𝗘𝗦') ||
      c.name.toLowerCase().includes('informac') ||
      c.name.includes('📢')
    )
  );

  // 3. Localizar o canal oficial 【👋】𝗕𝗲𝗺-𝗩𝗶𝗻𝗱𝗼𝘀
  const chBV = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildText && c.name.includes('𝗕𝗲𝗺-𝗩𝗶𝗻𝗱𝗼𝘀')
  );

  if (chBV) {
    console.log(`⚙️ Configurando ${chBV.name}...`);
    if (catInfo) {
      await chBV.setParent(catInfo.id, { lockPermissions: false });
    }
    await chBV.setPosition(0);
    await chBV.permissionOverwrites.edit(guild.roles.everyone.id, {
      ViewChannel: true,
      ReadMessageHistory: true,
      AddReactions: true,
      SendMessages: false,
      CreatePublicThreads: false,
      CreatePrivateThreads: false,
      SendMessagesInThreads: false,
    });

    // Envia o banner e embed oficial
    const msgs = await chBV.messages.fetch({ limit: 5 }).catch(() => null);
    if (!msgs || msgs.size === 0) {
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
      });
      console.log('✅ Banner e mensagem inicial publicados!');
    }
  }

  // 4. Também coloca 【🤖】𝗖𝗼𝗺𝗮𝗻𝗱𝗼𝘀-𝗚𝗲𝗿𝗮𝗹 na categoria correta se estiver fora
  const chCmd = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildText && c.name.includes('𝗖𝗼𝗺𝗮𝗻𝗱𝗼𝘀-𝗚𝗲𝗿𝗮𝗹')
  );
  if (chCmd && catInfo && chCmd.parentId !== catInfo.id) {
    console.log(`📁 Movendo ${chCmd.name} para a categoria ${catInfo.name}`);
    await chCmd.setParent(catInfo.id, { lockPermissions: false });
  }

  console.log('\n🎉 Tudo alinhado perfeitamente!');
  process.exit(0);
});

client.login(process.env.TOKEN);
