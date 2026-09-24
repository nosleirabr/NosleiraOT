const {
  Client,
  GatewayIntentBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  AttachmentBuilder,
} = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: 'd:/Server/discord-setup/.env' });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

const SITE_URL = 'https://www.nosleiraot.com';
const BANNER_PATH = path.join(__dirname, 'assets', 'welcome_banner.jpg');

async function limparCanal(canal) {
  try {
    const msgs = await canal.messages.fetch({ limit: 100 }).catch(() => null);
    if (!msgs || msgs.size === 0) return;
    for (const m of msgs.values()) {
      await m.delete().catch(() => {});
    }
  } catch (err) {
    console.error(`Erro ao limpar canal ${canal.name}:`, err.message);
  }
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
  console.log(`🤖 Logado como: ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) {
    console.error('❌ Guild não encontrada.');
    process.exit(1);
  }

  await guild.channels.fetch();
  await guild.members.fetch().catch(() => {});

  const botAvatar = client.user.displayAvatarURL({ dynamic: true, size: 512 });
  const guildIcon = guild.iconURL({ dynamic: true, size: 512 }) || botAvatar;

  const chBV = guild.channels.cache.get('1552437944030077018') || findCh(guild, 'bem-vindo');
  const chRegras = guild.channels.cache.get('1552415263498969199') || findCh(guild, 'regras');
  const chLinks = guild.channels.cache.get('1552415258411401226') || findCh(guild, 'links');
  const chAtual = guild.channels.cache.get('1552415256142286878') || findCh(guild, 'atualizac');
  const chRanks = guild.channels.cache.get('1552415260848164924') || findCh(guild, 'ranks');
  const chComandos = guild.channels.cache.get('1552415266590294056') || findCh(guild, 'comandos');
  const chComunidade = findCh(guild, 'comunidade') || findCh(guild, 'chat-geral') || findCh(guild, 'geral');
  const chTicket = guild.channels.cache.get('1552415270000267454') || findCh(guild, 'ticket-br');

  // ─────────────────────────────────────────────
  // 1. BOAS-VINDAS (#bem-vindos) — APENAS BOAS-VINDAS & LINKS BÁSICOS
  // ─────────────────────────────────────────────
  if (chBV) {
    console.log('🔄 Limpando e repostando canal de Boas-Vindas...');
    await limparCanal(chBV);

    const embedBV = new EmbedBuilder()
      .setColor('#E67E22')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Servidor Oficial',
        iconURL: guildIcon,
      })
      .setTitle('⚔️  BEM-VINDO(A) AO NOSLEIRA OT 7.4!  ⚔️')
      .setDescription(
        'Seja muito bem-vindo(a) à nossa comunidade **Tibia 7.4 Old School**!\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        `🌐 **Site Oficial:** [www.nosleiraot.com](${SITE_URL}) — Crie sua conta.\n` +
        (chLinks ? `📥 **Downloads & Links:** <#${chLinks.id}>\n` : '') +
        (chRegras ? `📜 **Regras do Servidor:** <#${chRegras.id}>\n` : '') +
        (chComandos ? `🤖 **Guia de Comandos:** <#${chComandos.id}>\n` : '') +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .setImage('attachment://welcome_banner.jpg')
      .setFooter({ text: 'NosleiraOT 7.4 • Boas-Vindas Oficial', iconURL: botAvatar })
      .setTimestamp();

    const rowBV = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🌐 Criar Conta').setStyle(ButtonStyle.Link).setURL(SITE_URL),
      new ButtonBuilder().setLabel('📥 Baixar Cliente').setStyle(ButtonStyle.Link).setURL(SITE_URL)
    );

    const files = [];
    if (fs.existsSync(BANNER_PATH)) {
      files.push(new AttachmentBuilder(BANNER_PATH, { name: 'welcome_banner.jpg' }));
    }

    await chBV.send({
      embeds: [embedBV],
      components: [rowBV],
      files: files.length > 0 ? files : undefined,
    });
    console.log('✅ Canal Boas-Vindas repostado limpo!');
  }

  // ─────────────────────────────────────────────
  // 2. REGRAS (#regras) — APENAS CONDUTA E DIRETRIZES
  // ─────────────────────────────────────────────
  if (chRegras) {
    console.log('🔄 Limpando e repostando canal de Regras...');
    await limparCanal(chRegras);

    const embedRegras = new EmbedBuilder()
      .setColor('#E74C3C')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Diretrizes & Conduta Oficial',
        iconURL: guildIcon,
      })
      .setTitle('📜  Regras Oficiais do Servidor & Discord')
      .setDescription(
        'Para manter um ambiente justo, seguro e respeitoso para todos os aventureiros, ' +
        'o cumprimento das diretrizes abaixo é **obrigatório** no jogo e na comunidade.\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '1️⃣  Respeito Mútuo & Convivência',
          value:
            '> • Proibido preconceito, racismo, homofobia, assédio, discurso de ódio ou discriminação.\n' +
            '> • Discussões no contexto natural de PvP são permitidas; ofensas pessoais e assédio não.',
          inline: false,
        },
        {
          name: '2️⃣  Conteúdo Impróprio & Jogos de Azar (Tolerância Zero)',
          value:
            '> • **Proibido pornografia, imagens adultas, NSFW ou gore (Banimento Imediato).**\n' +
            '> • **Proibido divulgação ou links de casas de apostas, cassinos, bots de bet ou jogos de azar.**',
          inline: false,
        },
        {
          name: '3️⃣  Trapaças, Botting & Segurança de Contas',
          value:
            '> • Proibido uso de macros ilegais, botting invasivo, speed hacks, packet injection ou abuso de bugs.\n' +
            '> • Nunca compartilhe suas credenciais. A staff jamais pedirá sua senha.',
          inline: false,
        },
        {
          name: '4️⃣  Divulgação Não Autorizada & Spam',
          value:
            '> • Proibido divulgar outros servidores, links de terceiros não autorizados, phishing ou scams.',
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT 7.4 • Administração & Moderação', iconURL: botAvatar })
      .setTimestamp();

    const rowRegras = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🌐 Site Oficial').setStyle(ButtonStyle.Link).setURL(SITE_URL)
    );

    await chRegras.send({ embeds: [embedRegras], components: [rowRegras] });
    console.log('✅ Canal Regras repostado limpo!');
  }

  // ─────────────────────────────────────────────
  // 3. LINKS (#links) — APENAS SITES E DOWNLOADS
  // ─────────────────────────────────────────────
  if (chLinks) {
    console.log('🔄 Limpando e repostando canal de Links...');
    await limparCanal(chLinks);

    const embedLinks = new EmbedBuilder()
      .setColor('#9B59B6')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Central de Links Oficiais',
        iconURL: guildIcon,
      })
      .setTitle('🔱  Links Úteis & Download do Cliente')
      .setDescription(
        'Todos os links oficiais, seguros e verificados do **NosleiraOT 7.4**:\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '🌐 Site Oficial & Painel de Contas',
          value: `> [www.nosleiraot.com](${SITE_URL})\n> Registre sua conta, confira o ranking online e gerencie seus personagens.`,
          inline: false,
        },
        {
          name: '📥 Download do Cliente Dedicado (OTCv8)',
          value: `> [Download Direto no Site Oficial](${SITE_URL})\n> Cliente completo com gráficos aprimorados, som ambiente, FPS livre e estabilidade.`,
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT 7.4 • Links Oficiais', iconURL: botAvatar })
      .setTimestamp();

    const rowLinks = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🌐 Acessar Site').setStyle(ButtonStyle.Link).setURL(SITE_URL),
      new ButtonBuilder().setLabel('📥 Baixar Cliente').setStyle(ButtonStyle.Link).setURL(SITE_URL)
    );

    await chLinks.send({ embeds: [embedLinks], components: [rowLinks] });
    console.log('✅ Canal Links repostado limpo!');
  }

  // ─────────────────────────────────────────────
  // 4. ATUALIZAÇÕES (#atualizacoes) — NOTAS DE PATCH E ENGINE
  // ─────────────────────────────────────────────
  if (chAtual) {
    console.log('🔄 Limpando e repostando canal de Atualizações...');
    await limparCanal(chAtual);

    const embedAtual = new EmbedBuilder()
      .setColor('#3498DB')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Central de Atualizações & Patches',
        iconURL: guildIcon,
      })
      .setTitle('⚔️  Tudo sobre o NosleiraOT 7.4 & Novidades')
      .setDescription(
        'O **NosleiraOT 7.4** foi desenvolvido para resgatar a autêntica era de ouro do Tibia Old School, combinando jogabilidade clássica 7.4 com infraestrutura moderna.\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '🛡️  Autenticidade & Filosofia 7.4',
          value: [
            '> ⚔️ **PvP & Combate Clássico:** Mira de runas no battle, UH trap clássica, sem cooldowns modernos.',
            '> 🚫 **Sem Mecânicas Modernas:** Sem montarias, sem stamina de treino off, sem shop abusivo.',
            '> 🏹 **Vocações Balanceadas:** Knight tanker, Paladin veloz e Mages com magias de impacto.',
            '> 🗺️ **Mapa Clássico Completo:** Thais, Carlin, Venore, Edron, Darashia, Kazordoon, Ab\'Dendriel e Rookgaard.',
          ].join('\n'),
          inline: false,
        },
        {
          name: '⚙️  Tecnologia & Infraestrutura',
          value: [
            '> 🚀 **Engine C++17 Custom:** Estabilidade contínua 24/7 e latência ultra-baixa.',
            '> 🖥️ **Cliente Otimizado:** FPS desbloqueado, iluminação dinâmica suave e conexão estável.',
            '> 🛡️ **Anti-Cheat Avançado:** Monitoramento constante para garantir jogabilidade justa.',
            '> 👹 **Monitor Dinâmico de Bosses:** Spawns épicos e invasões com avisos em tempo real.',
          ].join('\n'),
          inline: false,
        },
        {
          name: '📢  Notas de Patch & Manutenções',
          value: [
            '🌐 **Changelog Completo:** Publicado diretamente no site **[www.nosleiraot.com](https://www.nosleiraot.com)**.',
            '🔔 **Avisos no Discord:** Manutenções e eventos de Double EXP são avisados com antecedência.',
          ].join('\n'),
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT 7.4 • A lenda nunca morre!', iconURL: botAvatar })
      .setTimestamp();

    const rowAtual = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🌐 Site Oficial').setStyle(ButtonStyle.Link).setURL(SITE_URL)
    );

    await chAtual.send({ embeds: [embedAtual], components: [rowAtual] });
    console.log('✅ Canal Atualizações repostado limpo!');
  }

  // ─────────────────────────────────────────────
  // 5. RANKS (#ranks) — O ÚNICO LOCAL DE RANKINGS, HORAS E CONQUISTAS
  // ─────────────────────────────────────────────
  if (chRanks) {
    console.log('🔄 Limpando e repostando canal de Ranks...');
    await limparCanal(chRanks);

    const embedRanks = new EmbedBuilder()
      .setColor('#FFD700')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Sistema de Ranks & Gamificação',
        iconURL: guildIcon,
      })
      .setTitle('🏆  Quadro de Honra & Níveis de Atividade')
      .setDescription(
        'Aqui são anunciadas automaticamente as **conquistas, promoções de cargos e up de ranks** dos membros da comunidade!\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '⭐  Como Subir de Nível de Atividade?',
          value:
            '> 🎙️ **Tempo em Canais de Voz:** Cada hora conectado em salas de bate-papo pontua seu perfil.\n' +
            '> 💬 **Mensagens no Chat:** Cada conversa produtiva contribui com sua pontuação.\n' +
            '> 🎖️ Ao atingir as metas de horas, você recebe tags e cores exclusivas automaticamente!',
          inline: false,
        },
        {
          name: '👑  Escala de Ranks Oficiais',
          value: [
            '> `◆ 01` **Recruta de Rookgaard** (100h)',
            '> `◆ 02` **Aventureiro de Thais** (200h)',
            '> `◆ 03` **Guardião de Carlin** (400h)',
            '> `◆ 04` **Caçador de Venore** (700h)',
            '> `◆ 05` **Mago de Edron** (1000h)',
            '> `◆ 06` **Lorde de Darashia** (1300h)',
            '> `◆ 07` **Caçador de Demônios** (1600h)',
            '> `◆ 08` **Slayer Ancestral** (1900h)',
            '> `◆ 09` **Lenda de Tibia** (2200h)',
            '> `◆ 10` **Imortal de Nosleira** (2500h)',
          ].join('\n'),
          inline: false,
        },
        {
          name: '🔍  Consulte seu Progresso de Rank',
          value: 'Clique no botão verde abaixo para consultar suas horas e nível acumulados *(disponível 1x a cada 24 horas)*:',
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT 7.4 • Sistema de Conquistas', iconURL: botAvatar })
      .setTimestamp();

    const rowRanks = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('cmd_rank_self').setLabel('🏆 Meu Rank').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('cmd_vocacao_menu').setLabel('🛡️ Escolher Vocação').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setLabel('🌐 Ranking no Site').setStyle(ButtonStyle.Link).setURL(SITE_URL)
    );

    await chRanks.send({ embeds: [embedRanks], components: [rowRanks] });
    console.log('✅ Canal Ranks repostado como local EXCLUSIVO de Ranks!');
  }

  // ─────────────────────────────────────────────
  // 6. COMANDOS-GERAL (#comandos-geral) — APENAS UTILITÁRIOS (SEM BOTÃO DE RANK!)
  // ─────────────────────────────────────────────
  if (chComandos) {
    console.log('🔄 Limpando e repostando canal de Comandos...');
    await limparCanal(chComandos);

    const embedCmd = new EmbedBuilder()
      .setColor('#3498DB')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Central de Comandos & Utilitários',
        iconURL: guildIcon,
      })
      .setTitle('🤖  Guia de Comandos do Servidor')
      .setDescription(
        'Comandos úteis disponíveis para facilitar sua jornada no servidor e no Discord!\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '🎥  Mídia & Transmissões',
          value: [
            '> `!stream <link>` — Divulga sua live no canal ⌈ 🎥 ⌋ Streamers',
            '> `!screenshot [descrição]` — Publica sua print em ⌈ 📸 ⌋ Screenshots',
            '> `!clip <link> [texto]` — Publica seu vídeo em ⌈ 📺 ⌋ Clips',
          ].join('\n'),
          inline: false,
        },
        {
          name: '🎧  Rádio & Música 24/7',
          value: [
            '> `!play <música>` — Pede uma música na fila do DJ',
            '> `!fila` — Visualiza a ordem das músicas na fila',
            '> `!pular` — Pula a faixa atual',
            '> `!radio` — Abre o painel interativo da Rádio Nosleira 98 FM',
          ].join('\n'),
          inline: false,
        },
        {
          name: '⚡  Atalhos & Informações Rápidas',
          value: [
            '> `/site` — Link direto para criação de contas',
            '> `/info` — Informações sobre rates e regras',
            '> `!ajuda` — Resumo rápido dos utilitários',
          ].join('\n'),
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT 7.4 • Bot de Utilitários', iconURL: botAvatar })
      .setTimestamp();

    const rowCmd = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('🌐 Site Oficial').setStyle(ButtonStyle.Link).setURL(SITE_URL),
      new ButtonBuilder().setCustomId('cmd_regras_popup').setLabel('📜 Regras').setStyle(ButtonStyle.Secondary)
    );

    await chComandos.send({ embeds: [embedCmd], components: [rowCmd] });
    console.log('✅ Canal Comandos-Geral repostado LIMPO e sem botão de Rank!');
  }

  // ─────────────────────────────────────────────
  // 7. TICKET-BR (#ticket-br) — O ÚNICO LOCAL DE TICKETS DO SERVIDOR
  // ─────────────────────────────────────────────
  if (chTicket) {
    console.log('🔄 Limpando e repostando canal de Tickets...');
    await limparCanal(chTicket);

    const embedTicket = new EmbedBuilder()
      .setColor('#E67E22')
      .setAuthor({
        name: 'NosleiraOT 7.4 • Central de Suporte & Atendimento',
        iconURL: guildIcon,
      })
      .setTitle('🛡️  Central de Suporte Oficial')
      .setDescription(
        'Bem-vindo ao suporte do **NosleiraOT**! Nosso sistema garante um atendimento individual, rápido e seguro diretamente com a nossa equipe.\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      )
      .addFields(
        {
          name: '📂  Departamentos & Escala de Prioridade (P1 a P9)',
          value: [
            '> 👑 `[P1]` **Falar com o Dono** — Assuntos sigilosos e exclusivos diretamente com a Direção.',
            '> 🐛 `[P2]` **Bug no Jogo** — Falhas críticas, bugs de dupe, mapa, magias ou monstros.',
            '> 🚨 `[P3]` **Denúncias** — Reporte de trapaças, botters, ofensas ou violações de regras.',
            '> 💳 `[P4]` **Problemas com Pagamento** — Confirmações de PIX, doações e transações.',
            '> 🎁 `[P5]` **Item de Donate** — Suporte para entrega ou dúvidas sobre itens adquiridos.',
            '> 👤 `[P6]` **Problemas com Conta** — Acesso, bloqueios e dados cadastrais.',
            '> 🔑 `[P7]` **Recover Key** — Recuperação ou solicitação de chave de segurança.',
            '> 🔓 `[P8]` **Remover 2FA** — Desativação de autenticação de dois fatores.',
            '> ❓ `[P9]` **Dúvidas Gerais** — Informações sobre gameplay, rates e sistemas.',
          ].join('\n'),
          inline: false,
        },
        {
          name: '⚖️  Ordem de Atendimento por Prioridade',
          value: [
            '📌 **Atenção:** Os chamados são atendidos estritamente por **Ordem de Prioridade (P1 a P9)**, e **NÃO** apenas pela ordem de chegada.',
            '⚡ Chamados de emergência (`Bugs Críticos` e `Denúncias`) são priorizados pela equipe antes de solicitações cadastrais ou dúvidas gerais.',
          ].join('\n'),
          inline: false,
        },
        {
          name: '📋  Como funciona o Atendimento?',
          value: [
            '1️⃣ Clique no botão verde **`🎫 Abrir Ticket de Suporte`** abaixo.',
            '2️⃣ Escolha o departamento correspondente à sua solicitação.',
            '3️⃣ Um **subtópico privado e seguro** será aberto exclusivamente para você.',
            '4️⃣ Nossa equipe responderá conforme a classificação de prioridade.',
          ].join('\n'),
          inline: false,
        }
      )
      .setFooter({ text: 'NosleiraOT 7.4 • Suporte Oficial 24/7', iconURL: botAvatar })
      .setTimestamp();

    const rowTicket = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('🎫 Abrir Ticket de Suporte')
        .setStyle(ButtonStyle.Success)
    );

    await chTicket.send({ embeds: [embedTicket], components: [rowTicket] });
    console.log('✅ Canal Ticket-BR repostado com sucesso!');
  }

  console.log('\n🎉 REORGANIZAÇÃO COMPLETA: CADA ASSUNTO STRICTAMENTE NO SEU DEVIDO CANAL!');
  process.exit(0);
});

client.login(process.env.TOKEN);
