const { Client, GatewayIntentBits, ChannelType, EmbedBuilder } = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once('ready', async () => {
  console.log(`🤖 Atualizando fotos e ícones em tempo real com ${client.user.tag}...`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) {
    console.error('❌ Servidor não encontrado!');
    process.exit(1);
  }

  await guild.channels.fetch();

  const botAvatar = client.user.displayAvatarURL({ dynamic: true, size: 512 });
  const guildIcon = guild.iconURL({ dynamic: true, size: 512 }) || botAvatar;

  console.log(`🖼️ Ícone Atual do Servidor: ${guildIcon}`);
  console.log(`🤖 Avatar Atual do Bot: ${botAvatar}`);

  const canaisAlvo = [
    'screenshots',
    'clips',
    'streamers',
    'comunicados',
    'ticket-br',
    'ticket-dono',
    'regras',
    'ranks',
    'links',
    'comandos',
    'atualizac',
  ];

  let mensagensAtualizadas = 0;

  for (const ch of guild.channels.cache.values()) {
    if (ch.type !== ChannelType.GuildText && ch.type !== ChannelType.GuildAnnouncement && !ch.isThread?.()) continue;

    try {
      const msgs = await ch.messages.fetch({ limit: 50 }).catch(() => null);
      if (!msgs || msgs.size === 0) continue;

      for (const msg of msgs.values()) {
        // Apenas mensagens enviadas pelo próprio Bot
        if (msg.author.id !== client.user.id) continue;
        if (!msg.embeds || msg.embeds.length === 0) continue;

        let mudou = false;
        const novosEmbeds = msg.embeds.map((emb) => {
          const builder = EmbedBuilder.from(emb);

          // Atualiza o Author Icon para a foto atual do Servidor/Bot
          if (emb.author && emb.author.name) {
            builder.setAuthor({
              name: emb.author.name,
              iconURL: guildIcon,
              url: emb.author.url || undefined,
            });
            mudou = true;
          }

          // Atualiza o Footer Icon para a foto atual do Bot
          if (emb.footer && emb.footer.text) {
            builder.setFooter({
              text: emb.footer.text,
              iconURL: botAvatar,
            });
            mudou = true;
          }

          // Atualiza a Thumbnail se ela apontava para foto antiga ou se tiver thumbnail
          if (emb.thumbnail && emb.thumbnail.url) {
            builder.setThumbnail(guildIcon);
            mudou = true;
          }

          return builder;
        });

        if (mudou) {
          await msg.edit({ embeds: novosEmbeds, components: msg.components }).catch((e) => {
            console.warn(`Aviso ao editar msg em #${ch.name}:`, e.message);
          });
          mensagensAtualizadas++;
          console.log(`✅ Fotos e ícones atualizados em tempo real em #${ch.name}`);
        }
      }
    } catch (err) {
      console.warn(`Erro no canal #${ch.name}:`, err.message);
    }
  }

  console.log(`\n🎉 Concluído! Total de ${mensagensAtualizadas} mensagem(ns) atualizada(s) com as fotos em tempo real.`);
  process.exit(0);
});

client.login(process.env.TOKEN);
