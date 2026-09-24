/**
 * renomear_bold.js
 * Formato final: 【 emoji 】 𝗡𝗼𝗺𝗲 (bold Unicode + sem hífens)
 */
const { Client, GatewayIntentBits } = require("discord.js");

const BOT_TOKEN = "MTU1MDk0Njg0OTIyMzg2ODQ3Nw.G8TczK.LlFaIPBqhFjlmNAxwuCdy73-wkV3lHmmyYI1u8";
const GUILD_ID  = "1550944696761843915";

const S = "\u00A0"; // espaço não-quebrável (sem hífen)

// Converte texto normal → bold sans-serif Unicode (𝗟𝗶𝗸𝗲 𝗧𝗵𝗶𝘀)
function bold(text) {
  const map = {
    A:"𝗔",B:"𝗕",C:"𝗖",D:"𝗗",E:"𝗘",F:"𝗙",G:"𝗚",H:"𝗛",I:"𝗜",J:"𝗝",
    K:"𝗞",L:"𝗟",M:"𝗠",N:"𝗡",O:"𝗢",P:"𝗣",Q:"𝗤",R:"𝗥",S:"𝗦",T:"𝗧",
    U:"𝗨",V:"𝗩",W:"𝗪",X:"𝗫",Y:"𝗬",Z:"𝗭",
    a:"𝗮",b:"𝗯",c:"𝗰",d:"𝗱",e:"𝗲",f:"𝗳",g:"𝗴",h:"𝗵",i:"𝗶",j:"𝗷",
    k:"𝗸",l:"𝗹",m:"𝗺",n:"𝗻",o:"𝗼",p:"𝗽",q:"𝗾",r:"𝗿",s:"𝘀",t:"𝘁",
    u:"𝘂",v:"𝘃",w:"𝘄",x:"𝘅",y:"𝘆",z:"𝘇",
  };
  return text.split("").map(c => map[c] ?? c).join("");
}

// Gera nome final: 【 emoji 】 𝗧𝗲𝘅𝘁𝗼
function nome(emoji, texto) {
  return `【${S}${emoji}${S}】${S}${bold(texto)}`;
}

const RENOMEAR = {
  "1552164314473832489": nome("🤖", "Comandos-Geral"),
  "1552164320064962611": nome("📢", "Comunicados"),
  "1552119197784477700": nome("✍🏻", "Atualizacoes"),
  "1550954702198415382": nome("🔱", "Links"),
  "1552139244770697278": nome("🏆", "Ranks"),
  "1550954758905397271": nome("🔴", "Ticket-BR"),
  "1550954696678580295": nome("⛔", "Regras"),
  "1550954762067910706": nome("📋", "Log-Tickets"),
  "1552123472535224440": nome("🎥", "Streamers"),
  "1550954745051488266": nome("📸", "Screenshots"),
  "1552108282926207097": nome("📺", "Clips"),
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", async () => {
  console.log(`Bot: ${client.user.tag}`);
  console.log("Aplicando 【 emoji 】 𝗡𝗼𝗺𝗲 bold sem hífens...\n");

  const guild = await client.guilds.fetch(GUILD_ID);
  await guild.channels.fetch();

  for (const [id, novoNome] of Object.entries(RENOMEAR)) {
    const canal = guild.channels.cache.get(id);
    if (!canal) { console.log(`  ℹ ${id} não encontrado`); continue; }
    try {
      console.log(`  ✏️  → "${novoNome}"`);
      await canal.setName(novoNome, "Padrão bold Nosleira OT");
      await sleep(1000);
    } catch (e) { console.log(`  ⚠ Erro: ${e.message}`); }
  }

  console.log("\n✅ Pronto!");
  client.destroy();
});

client.login(BOT_TOKEN);
