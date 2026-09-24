const {
  Client,
  GatewayIntentBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

async function limparCanal(canal) {
  try {
    const msgs = await canal.messages.fetch({ limit: 50 }).catch(() => null);
    if (!msgs || msgs.size === 0) return;
    for (const m of msgs.values()) {
      await m.delete().catch(() => {});
    }
  } catch (err) {}
}

const findCh = (guild, keyword) => {
  const kw = keyword.toLowerCase();
  return guild.channels.cache.find(
    (c) =>
      c.type === ChannelType.GuildText &&
      (c.name.toLowerCase().includes(kw) || c.name.normalize('NFKD').toLowerCase().includes(kw))
  );
};

client.once('ready', async () => {
  console.log(`🤖 Atualizando canais com embeds profissionais: ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) process.exit(1);

  await guild.channels.fetch();

  // ─────────────────────────────────────────────
  // 1. ATUALIZAÇÕES (#atualizacoes)
  // ─────────────────────────────────────────────
  const chAtual = findCh(guild, 'atualizac');
  if (chAtual) {
    await limparCanal(chAtual);
    const embedAtual = new EmbedBuilder()
      .setColor('#3498DB')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Central de Atualizações & Patches',
        iconURL: guild.iconURL() || 'https://img.icons8.com/fluency/96/shield.png',
      })
      .setTitle('⚔️  Tudo sobre o NosleiraOT 7.4 & Novidades')
      .setDescription(
        'O **NosleiraOT 7.4** foi desenvolvido para resgatar a era de ouro do Tibia Old School, combinando a jogabilidade autêntica da versão 7.4 com infraestrutura e tecnologia de ponta.\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '🛡️  Autenticidade & Filosofia 7.4',
          value: [
            '> ⚔️ **PvP & Combate Raiz:** Mira manual de runas no battle, UH trap clássica, sem cooldowns modernos.',
            '> 🚫 **Sem Mecânicas Modernas:** Sem montarias, sem stamina de treino off, sem pay-to-win abusivo.',
            '> 🏹 **Vocações Balanceadas:** Knight tanker de respeito, Paladin veloz e Mages com magias de alto impacto.',
            '> 🗺️ **Mapa & Quests Clássicas:** Thais, Carlin, Venore, Edron, Darashia, Kazordoon, Ab\'Dendriel e Rookgaard.',
          ].join('\n'),
          inline: false,
        },
        {
          name: '⚙️  Tecnologia & Infraestrutura Custom',
          value: [
            '> 🚀 **Engine Proprietária Custom:** Otimizada em C++17 para estabilidade contínua 24/7 e latência ultra-baixa.',
            '> 🖥️ **Cliente Dedicado & Fluido:** FPS desbloqueado, iluminação dinâmica suave e estabilidade de conexão.',
            '> 🛡️ **Sistema Anti-Cheat Avançado:** Proteção e monitoramento contra bots e fraudes para garantir um jogo 100% limpo.',
            '> 👹 **Monitor Dinâmico de Bosses:** Spawns épicos e invasões com avisos em tempo real para a comunidade.',
          ].join('\n'),
          inline: false,
        },
        {
          name: '📢  Como funcionam as Atualizações e Patches?',
          value: [
            '🌐 **Changelog Completo no Site:** Todas as atualizações, rebalanceamentos e notas de patch detalhadas são publicadas diretamente no site oficial **[www.nosleiraot.com](https://www.nosleiraot.com)**.',
            '🔔 **Avisos no Discord:** Manutenções programadas, eventos de Double EXP e grandes novidades são anunciadas com antecedência neste canal.',
          ].join('\n'),
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT 7.4 • A lenda nunca morre!' })
      .setTimestamp();

    const rowAtual = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🌐 Site Oficial').setStyle(ButtonStyle.Link).setURL('https://www.nosleiraot.com'),
      new ButtonBuilder().setCustomId('cmd_regras_popup').setLabel('📜 Regras').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('create_ticket').setLabel('🎫 Suporte').setStyle(ButtonStyle.Success)
    );

    await chAtual.send({ embeds: [embedAtual], components: [rowAtual] });
    console.log('✅ Canal Atualizações configurado com sucesso!');
  }

  // ─────────────────────────────────────────────
  // 2. SCREENSHOTS (#screenshots)
  // ─────────────────────────────────────────────
  const chScreens = findCh(guild, 'screenshots');
  if (chScreens) {
    await limparCanal(chScreens);
    const embedSS = new EmbedBuilder()
      .setColor('#2ECC71')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Galeria da Comunidade',
        iconURL: guild.iconURL() || 'https://img.icons8.com/fluency/96/camera.png',
      })
      .setTitle('📸  Galeria Oficial de Screenshots & Conquistas')
      .setDescription(
        'Este é o espaço para você registrar e compartilhar seus melhores momentos no **NosleiraOT**! ' +
        'Drops lendários, traps épicas, hunts em grupo, guerras e encontros com Bosses.\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '📤  Como Enviar suas Screenshots?',
          value: [
            '1️⃣ **Upload Direto no Discord:** Arraste sua foto para o chat ou clique no botão `+` do Discord e anexe a imagem.',
            '2️⃣ **Via Comando com Card Especial:** Digite `!print <descrição>` ou `!screenshot <descrição>` anexando a imagem para gerar uma publicação personalizada.',
            '3️⃣ **Hospedagem Externa (Imgur / ImgBB):** Você também pode hospedar gratuitamente em [Imgur.com](https://imgur.com) ou [ImgBB.com](https://imgbb.com) e colar o link da imagem aqui.',
          ].join('\n'),
          inline: false,
        },
        {
          name: '⚠️  Diretrizes da Galeria',
          value:
            '> • Envie apenas imagens relacionadas ao **NosleiraOT**.\n' +
            '> • Proibido conteúdo adulto, ofensivo ou spans de imagens repetidas.\n' +
            '> • Deixe sua reação e prestigie as conquistas dos seus amigos!',
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT • Compartilhe suas aventuras!' });

    await chScreens.send({ embeds: [embedSS] });
    console.log('✅ Canal Screenshots configurado com sucesso!');
  }

  // ─────────────────────────────────────────────
  // 3. STREAMERS (#streamers)
  // ─────────────────────────────────────────────
  const chStreamers = findCh(guild, 'streamers');
  if (chStreamers) {
    await limparCanal(chStreamers);
    const embedStreamers = new EmbedBuilder()
      .setColor('#9146FF')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Transmissões & Criadores de Conteúdo',
        iconURL: guild.iconURL() || 'https://img.icons8.com/fluency/96/video.png',
      })
      .setTitle('🎥  Divulgação de Lives & Streamers Oficiais')
      .setDescription(
        'Espaço dedicado para os criadores de conteúdo e streamers da comunidade divulgarem suas transmissões do **NosleiraOT**!\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '📢  Como Divulgar sua Live?',
          value: [
            '1️⃣ **Comando Rápido:** Digite `!stream <link>` ou `!live <link>` no chat deste canal.',
            '   *Exemplo:* `!stream https://twitch.tv/seucanal`',
            '2️⃣ **Plataformas Suportadas:** Twitch, YouTube Gaming, Kick e TikTok Live.',
            '3️⃣ O bot formatará automaticamente um card com o link e notificará a comunidade com `@here`.',
          ].join('\n'),
          inline: false,
        },
        {
          name: '🔴  Detecção Automática de Streamer',
          value:
            '> Conecte sua conta da **Twitch** ou **YouTube** no Discord (Configurações → Conexões).\n' +
            '> Ao iniciar uma live jogando **NosleiraOT**, o bot detectará seu status, atribuirá o cargo **🔴 Ao Vivo** e postará o link automaticamente!',
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT • Apoie os criadores de conteúdo do servidor!' });

    await chStreamers.send({ embeds: [embedStreamers] });
    console.log('✅ Canal Streamers configurado com sucesso!');
  }

  // ─────────────────────────────────────────────
  // 4. CLIPS (#clips)
  // ─────────────────────────────────────────────
  const chClips = findCh(guild, 'clips');
  if (chClips) {
    await limparCanal(chClips);
    const embedClips = new EmbedBuilder()
      .setColor('#E1306C')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Vídeos & Curtas',
        iconURL: guild.iconURL() || 'https://img.icons8.com/fluency/96/film-reel.png',
      })
      .setTitle('📺  Melhores Momentos, Clipes & Shorts')
      .setDescription(
        'Compartilhe os momentos mais insanos, engraçados ou épicos do jogo! ' +
        'Clipes da Twitch, Shorts do YouTube, TikToks e vídeos de batalhas.\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '🎬  Como Postar seu Clipe?',
          value: [
            '👉 **Digite no chat:** `!clip <link_do_video> [descrição do momento]`',
            '   *Exemplo:* `!clip https://clips.twitch.tv/... Trap insana em Venore`',
            '👉 O bot gerará um card em destaque para todos assistirem e comentarem!',
          ].join('\n'),
          inline: false,
        },
        {
          name: '📱  Plataformas Recomendadas',
          value: '> Twitch Clips • YouTube Shorts / Vídeos • TikTok • Kwai',
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT • Mostre suas jogadas para todo o servidor!' });

    await chClips.send({ embeds: [embedClips] });
    console.log('✅ Canal Clips configurado com sucesso!');
  }

  // ─────────────────────────────────────────────
  // 5. COMANDOS-GERAL (#comandos-geral)
  // ─────────────────────────────────────────────
  const chCmd = findCh(guild, 'comandos');
  if (chCmd) {
    await limparCanal(chCmd);
    const embedCmd = new EmbedBuilder()
      .setColor('#FFD700')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Central de Comandos & Utilitários',
        iconURL: guild.iconURL() || 'https://img.icons8.com/fluency/96/bot.png',
      })
      .setTitle('🤖  Guia de Comandos do NosleiraOT-BOT')
      .setDescription(
        'O **NosleiraOT-BOT** conta com diversos comandos e atalhos rápidos para facilitar sua experiência dentro e fora do jogo!\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '⚡  Slash Commands (`/`)',
          value: [
            '> `/site` — Exibe o link e acessos do site oficial',
            '> `/info` — Informações sobre rates, engine e regras do servidor',
            '> `/regras` — Consulta rápida das diretrizes e penalidades',
            '> `/ticket` — Abre a central de atendimento e suporte',
            '> `/rank` — Consulta suas horas de call, mensagens e nível',
            '> `/discord` — Convite oficial para chamar seus amigos',
          ].join('\n'),
          inline: false,
        },
        {
          name: '💬  Comandos de Chat (`!`)',
          value: [
            '> `!stream <link>` — Divulga sua transmissão em ⌈ 🎥 ⌋ Streamers',
            '> `!print <descrição>` — Publica print na galeria em ⌈ 📸 ⌋ Screenshots',
            '> `!clip <link> [texto]` — Publica clipe em ⌈ 📺 ⌋ Clips',
            '> `!rank` ou `!rank @jogador` — Consulta pontuação e horas de atividade',
            '> `!ajuda` ou `!comandos` — Mostra o menu de ajuda rápida',
            '> `!boss spawn / drop` — Alerta de bosses lendários *(Apenas Staff)*',
          ].join('\n'),
          inline: false,
        },
        {
          name: '👉  Atalhos Rápidos',
          value: 'Clique nos botões abaixo para acessar qualquer função instantaneamente:',
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT 7.4 • Bot 100% Ativo & Otimizado' })
      .setTimestamp();

    const rowCmd1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🌐 Site Oficial').setStyle(ButtonStyle.Link).setURL('https://www.nosleiraot.com'),
      new ButtonBuilder().setCustomId('cmd_vocacao_menu').setLabel('🛡️ Escolher Vocação').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('cmd_rank_self').setLabel('🏆 Meu Rank').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('create_ticket').setLabel('🎫 Abrir Ticket').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('cmd_regras_popup').setLabel('📜 Regras').setStyle(ButtonStyle.Secondary)
    );

    await chCmd.send({ embeds: [embedCmd], components: [rowCmd1] });
    console.log('✅ Canal Comandos-Geral configurado com sucesso!');
  }

  console.log('🎉 Todos os canais foram atualizados com sucesso e máxima qualidade!');
  process.exit(0);
});

client.login(process.env.TOKEN);
