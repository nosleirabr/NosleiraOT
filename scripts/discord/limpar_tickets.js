/**
 * limpar_tickets.js
 * - Apaga todos os canais "ticket-*" abertos
 * - Limpa todas as mensagens do Log-Tickets
 * - Limpa spam de "Ticket aberto em #desconhecido" no Ticket-BR
 */
const { Client, GatewayIntentBits, ChannelType } = require("discord.js");

const BOT_TOKEN    = "MTU1MDk0Njg0OTIyMzg2ODQ3Nw.G8TczK.LlFaIPBqhFjlmNAxwuCdy73-wkV3lHmmyYI1u8";
const GUILD_ID     = "1550944696761843915";
const CAT_SUPORTE  = "1550954755956674620";
const CH_LOG       = "1550954762067910706";
const CH_TICKET_BR = "1550954758905397271";

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function bulkDeleteAll(canal) {
  let total = 0;
  while (true) {
    const msgs = await canal.messages.fetch({ limit: 100 });
    if (msgs.size === 0) break;
    // Bulk delete só funciona em msgs < 14 dias; as antigas deletamos uma a uma
    const recentes = msgs.filter(m => Date.now() - m.createdTimestamp < 12 * 24 * 60 * 60 * 1000);
    const antigas  = msgs.filter(m => Date.now() - m.createdTimestamp >= 12 * 24 * 60 * 60 * 1000);
    if (recentes.size >= 2) {
      await canal.bulkDelete(recentes, true);
      await sleep(1000);
    }
    for (const msg of antigas.values()) {
      await msg.delete().catch(() => {});
      await sleep(500);
    }
    total += msgs.size;
    if (msgs.size < 100) break;
  }
  return total;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once("ready", async () => {
  console.log(`Bot: ${client.user.tag}\n`);
  const guild = await client.guilds.fetch(GUILD_ID);
  await guild.channels.fetch();

  // ── 1. Apagar canais ticket-* ─────────────────────────────────────────────
  console.log("─── Apagando canais de ticket abertos ───");
  const ticketCanais = guild.channels.cache.filter(c =>
    c.type === ChannelType.GuildText &&
    (c.name.startsWith("ticket-") || c.name.includes("ticket"))  &&
    c.id !== CH_TICKET_BR &&
    c.id !== CH_LOG
  );
  console.log(`  Encontrados: ${ticketCanais.size} canais`);
  for (const [, canal] of ticketCanais) {
    console.log(`  🗑  Apagando canal: "${canal.name}"`);
    await canal.delete("Limpeza de tickets").catch(e => console.log(`  ⚠ ${e.message}`));
    await sleep(700);
  }

  // ── 2. Limpar mensagens do Log-Tickets ────────────────────────────────────
  console.log("\n─── Limpando Log-Tickets ───");
  const logCh = guild.channels.cache.get(CH_LOG);
  if (logCh) {
    const total = await bulkDeleteAll(logCh);
    console.log(`  ✅ ${total} mensagens apagadas do Log-Tickets`);
  }

  // ── 3. Limpar spam do Ticket-BR ───────────────────────────────────────────
  console.log("\n─── Limpando spam do Ticket-BR ───");
  const ticketBR = guild.channels.cache.get(CH_TICKET_BR);
  if (ticketBR) {
    const total = await bulkDeleteAll(ticketBR);
    console.log(`  ✅ ${total} mensagens apagadas do Ticket-BR`);
  }

  console.log("\n✅ Limpeza completa!");
  client.destroy();
});

client.login(BOT_TOKEN);
