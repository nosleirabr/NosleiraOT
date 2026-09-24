const {
  Client,
  GatewayIntentBits,
  ChannelType,
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const BANNER_PATH = path.join(__dirname, 'assets', 'welcome_banner.jpg');

client.once('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  const chBV = guild.channels.cache.find(
    (c) => c.name.includes('𝗕𝗲𝗺-𝗩𝗶𝗻𝗱𝗼𝘀') || c.name.includes('Bem-Vindos')
  );
  const chLinks = guild.channels.cache.find((c) => c.name.includes('𝗟𝗶𝗻𝗸𝘀') || c.name.includes('Links'));
  const chTicket = guild.channels.cache.find((c) => c.name.includes('𝗧𝗶𝗰𝗸𝗲𝘁-𝗕𝗥') || c.name.includes('Ticket-BR'));
  const chRegras = guild.channels.cache.find((c) => c.name.includes('𝗥𝗲𝗴𝗿𝗮𝘀') || c.name.includes('Regras'));

  console.log('Canais encontrados:', {
    BV: chBV ? chBV.name : 'null',
    Links: chLinks ? chLinks.id : 'null',
    Ticket: chTicket ? chTicket.id : 'null',
    Regras: chRegras ? chRegras.id : 'null',
  });

  if (chBV) {
    // Limpa mensagens antigas do canal de boas-vindas para ficar 100% limpo
    const msgs = await chBV.messages.fetch({ limit: 50 }).catch(() => null);
    if (msgs && msgs.size > 0) {
      for (const m of msgs.values()) {
        await m.delete().catch(() => {});
      }
    }

    // Embed limpo, compacto e profissional
    const embedLimpo = new EmbedBuilder()
      .setColor('#E67E22')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Servidor Oficial',
        iconURL: guild.iconURL({ dynamic: true }) || undefined,
      })
      .setTitle('⚔️  BEM-VINDO(A) AO NOSLEIRA OT 7.4!  ⚔️')
      .setDescription(
        'Seja muito bem-vindo(a) à nossa comunidade **Tibia 7.4 Old School**!\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        '🌐 **Site Oficial:** [www.nosleiraot.com](https://www.nosleiraot.com) — Crie sua conta.\n' +
        (chLinks ? `📥 **Downloads & Links:** <#${chLinks.id}>\n` : '') +
        (chTicket ? `🎫 **Central de Suporte:** <#${chTicket.id}> — Abra seu ticket aqui.\n` : '') +
        (chRegras ? `📜 **Regras do Servidor:** <#${chRegras.id}>\n` : '') +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .setImage('attachment://welcome_banner.jpg')
      .setFooter({ text: 'NosleiraOT 7.4 • Boas-Vindas Oficial', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    const rowBotoes = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('🌐 Criar Conta')
        .setStyle(ButtonStyle.Link)
        .setURL('https://www.nosleiraot.com'),
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('🎫 Abrir Ticket')
        .setStyle(ButtonStyle.Success)
    );

    const files = [];
    if (fs.existsSync(BANNER_PATH)) {
      files.push(new AttachmentBuilder(BANNER_PATH, { name: 'welcome_banner.jpg' }));
    }

    await chBV.send({
      embeds: [embedLimpo],
      components: [rowBotoes],
      files: files.length > 0 ? files : undefined,
    });

    console.log('✅ Mensagem de Boas-Vindas compacta e organizada publicada com sucesso!');
  }

  process.exit(0);
});

client.login(process.env.TOKEN);
