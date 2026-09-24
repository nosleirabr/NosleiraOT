/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║   SETUP DE ESTRUTURA — NOSLEIRA OT DISCORD                  ║
 * ║   Arquivo: setup_estrutura.js                               ║
 * ║   Rodar: node setup_estrutura.js                            ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require("discord.js");

// ─── CONFIGURAÇÕES ────────────────────────────────────────────────────────────
const BOT_TOKEN = "MTU1MDk0Njg0OTIyMzg2ODQ3Nw.G8TczK.LlFaIPBqhFjlmNAxwuCdy73-wkV3lHmmyYI1u8";
const GUILD_ID  = "1550944696761843915";
const DRY_RUN   = false;
// ──────────────────────────────────────────────────────────────────────────────

// Cargos que têm acesso total aos canais privados
const CARGOS_STAFF = ["dono", "owner", "admin", "administrador", "staff", "mod", "moderador"];

// ─── ESTRUTURA COMPLETA ───────────────────────────────────────────────────────
const ESTRUTURA = [
  {
    categoria: "[ 📢 ] INFORMAÇÕES E COMANDOS",
    canais: [
      { nome: "[ 🤖 ] Comandos-Geral", tipo: ChannelType.GuildText,  privado: false, somenteVer: false },
      { nome: "[ 📢 ] Comunicados",    tipo: ChannelType.GuildText,  privado: false, somenteVer: true  },
      { nome: "[ ✍🏻 ] Atualizacoes",  tipo: ChannelType.GuildText,  privado: false, somenteVer: true  },
      { nome: "[ 🔱 ] Links",          tipo: ChannelType.GuildText,  privado: false, somenteVer: true  },
      { nome: "[ ⛔ ] Regras",         tipo: ChannelType.GuildText,  privado: false, somenteVer: true  },
    ],
  },
  {
    categoria: "[ 🎫 ] ATENDIMENTO E SUPORTE",
    canais: [
      { nome: "[ 🔴 ] Ticket-BR",   tipo: ChannelType.GuildText, privado: false, somenteVer: false },
      { nome: "[ 📋 ] Log-Tickets", tipo: ChannelType.GuildText, privado: true,  somenteVer: false },
    ],
  },
  {
    categoria: "[ 🎮 ] COMUNIDADE E MÍDIA",
    canais: [
      { nome: "[ 🎥 ] Streamers",   tipo: ChannelType.GuildText,  privado: false, somenteVer: false },
      { nome: "[ 📷 ] Screenshots", tipo: ChannelType.GuildText,  privado: false, somenteVer: false },
      { nome: "[ 📺 ] Clips",       tipo: ChannelType.GuildText,  privado: false, somenteVer: false },
    ],
  },
  {
    categoria: "[ 🔊 ] CANAIS DE VOZ",
    canais: [
      { nome: "[ 👥 ] Membros",      tipo: ChannelType.GuildVoice, privado: true,  somenteVer: true  },
      { nome: "[ 🔊 ] Staff Voice",  tipo: ChannelType.GuildVoice, privado: true,  somenteVer: false },
      { nome: "[ 🔊 ] Geral 1",      tipo: ChannelType.GuildVoice, privado: false, somenteVer: false },
      { nome: "[ 🔊 ] Geral 2",      tipo: ChannelType.GuildVoice, privado: false, somenteVer: false },
      { nome: "[ 🎮 ] Jogando",      tipo: ChannelType.GuildVoice, privado: false, somenteVer: false },
      { nome: "[ 🐉 ] Boss",         tipo: ChannelType.GuildVoice, privado: false, somenteVer: false },
      { nome: "[ 💤 ] AFK",          tipo: ChannelType.GuildVoice, privado: false, somenteVer: false },
    ],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function log(msg) {
  console.log(`${DRY_RUN ? "[DRY-RUN] " : "[APLICADO]"} ${msg}`);
}

function acharCategoria(guild, nome) {
  const nomeLimpo = nome.trim().toLowerCase();
  return guild.channels.cache.find(
    (c) =>
      c.type === ChannelType.GuildCategory &&
      c.name.trim().toLowerCase() === nomeLimpo
  );
}

function acharCanal(guild, nome) {
  const nomeLimpo = nome.trim().toLowerCase();
  return guild.channels.cache.find(
    (c) => c.name.trim().toLowerCase() === nomeLimpo
  );
}

function buildPermissions(guild, privado, somenteVer) {
  const permissionOverwrites = [];
  const everyone = guild.roles.everyone;

  if (privado) {
    // @everyone não vê
    permissionOverwrites.push({
      id: everyone.id,
      deny: [PermissionFlagsBits.ViewChannel],
    });
  } else if (somenteVer) {
    // @everyone vê mas não escreve
    permissionOverwrites.push({
      id: everyone.id,
      allow: [PermissionFlagsBits.ViewChannel],
      deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions],
    });
  }

  // Libera cargos de staff
  if (privado || somenteVer) {
    guild.roles.cache.forEach((role) => {
      if (CARGOS_STAFF.some((s) => role.name.toLowerCase().includes(s))) {
        permissionOverwrites.push({
          id: role.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ManageMessages,
            PermissionFlagsBits.Connect,
          ],
        });
      }
    });
  }

  return permissionOverwrites;
}

// ─── LÓGICA PRINCIPAL ─────────────────────────────────────────────────────────
async function executarSetup(guild) {
  let criados = 0, movidos = 0, jaOk = 0;

  for (let i = 0; i < ESTRUTURA.length; i++) {
    const bloco = ESTRUTURA[i];
    console.log(`\n${"─".repeat(58)}`);
    console.log(`  📁 ${bloco.categoria}`);
    console.log("─".repeat(58));

    // Garante categoria
    let categoria = acharCategoria(guild, bloco.categoria);
    if (!categoria) {
      log(`CRIAR CATEGORIA: "${bloco.categoria}"`);
      if (!DRY_RUN) {
        categoria = await guild.channels.create({
          name: bloco.categoria,
          type: ChannelType.GuildCategory,
          position: i * 5,
          reason: "Setup Nosleira OT",
        });
        await sleep(800);
      }
    } else {
      log(`✓ Categoria já existe: "${categoria.name}"`);
    }

    // Garante cada canal
    for (let j = 0; j < bloco.canais.length; j++) {
      const cfg = bloco.canais[j];
      const canalExistente = acharCanal(guild, cfg.nome);
      const perms = buildPermissions(guild, cfg.privado, cfg.somenteVer);
      const tipoStr = cfg.tipo === ChannelType.GuildVoice ? "voz" : "texto";
      const privStr = cfg.privado ? " [🔒PRIVADO]" : cfg.somenteVer ? " [📢SÓ-VER]" : "";

      if (canalExistente) {
        const catAtual = canalExistente.parentId;
        const catAlvo  = categoria?.id;
        if (catAtual === catAlvo) {
          log(`  ✓ "${cfg.nome}" já está no lugar certo`);
          jaOk++;
        } else {
          log(`  MOVER: "${cfg.nome}" → "${bloco.categoria}"`);
          movidos++;
          if (!DRY_RUN && categoria) {
            await canalExistente.setParent(categoria.id, { lockPermissions: false, reason: "Setup Nosleira OT" });
            await canalExistente.permissionOverwrites.set(perms, "Setup Nosleira OT");
            await sleep(700);
          }
        }
      } else {
        log(`  CRIAR canal ${tipoStr}: "${cfg.nome}"${privStr}`);
        criados++;
        if (!DRY_RUN && categoria) {
          await guild.channels.create({
            name: cfg.nome,
            type: cfg.tipo,
            parent: categoria.id,
            position: j,
            permissionOverwrites: perms,
            reason: "Setup Nosleira OT",
          });
          await sleep(800);
        }
      }
    }
  }

  return { criados, movidos, jaOk };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── CLIENTE DISCORD ──────────────────────────────────────────────────────────
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once("ready", async () => {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Bot: ${client.user.tag}`);
  console.log(`  Modo: ${DRY_RUN ? "DRY RUN — nada será alterado" : "⚡ EXECUÇÃO REAL"}`);
  console.log("═".repeat(60));

  // Busca direto via API (não depende de cache)
  let guild;
  try {
    guild = await client.guilds.fetch(GUILD_ID);
    // Força carregamento dos canais e cargos
    await guild.channels.fetch();
    await guild.roles.fetch();
    await guild.members.fetch();
  } catch (e) {
    console.error("❌ Servidor não encontrado! O bot foi adicionado ao servidor?");
    console.error("   Link de convite: https://discord.com/oauth2/authorize?client_id=" + client.user.id + "&permissions=8&scope=bot");
    console.error("   Erro:", e.message);
    process.exit(1);
  }

  console.log(`\nServidor  : ${guild.name}`);
  console.log(`Membros   : ${guild.memberCount}`);
  console.log(`Canais    : ${guild.channels.cache.size}`);
  console.log(`Categorias: ${guild.channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size}`);

  const resultado = await executarSetup(guild);

  console.log(`\n${"═".repeat(60)}`);
  console.log("  ✅ SETUP CONCLUÍDO!");
  console.log(`     Criados : ${resultado.criados}`);
  console.log(`     Movidos : ${resultado.movidos}`);
  console.log(`     Já ok   : ${resultado.jaOk}`);
  if (DRY_RUN) {
    console.log("\n  ℹ  Nada foi alterado (DRY_RUN = true).");
    console.log('  →  Mude DRY_RUN = false e rode de novo para aplicar.');
  } else {
    console.log("\n  🎉 Estrutura aplicada no servidor!");
  }
  console.log("═".repeat(60));

  client.destroy();
});

// ─── INICIAR ──────────────────────────────────────────────────────────────────
if (BOT_TOKEN === "SEU_TOKEN_AQUI") {
  console.error("❌ Preencha o BOT_TOKEN no arquivo antes de rodar!");
  process.exit(1);
}

client.login(BOT_TOKEN);
