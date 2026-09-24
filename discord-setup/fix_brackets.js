const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.channels.fetch();

    // 1. Corrigir Bem-Vindos
    const chBemVindos = guild.channels.cache.find(c => c.name.includes('👋'));
    if (chBemVindos) {
      // B = 𝐁, e = 𝐞, m = 𝐦, - = -, V = 𝐕, i = 𝐢, n = 𝐧, d = 𝐝, o = 𝐨, s = 𝐬
      const novoNomeBV = '[ 👋 ]・𝐁𝐞𝐦-𝐕𝐢𝐧𝐝𝐨𝐬';
      await chBemVindos.setName(novoNomeBV).catch(console.error);
      console.log(`✅ Bem-Vindos renomeado para: ${novoNomeBV}`);
    }

    // 2. Corrigir Membros
    const chMembros = guild.channels.cache.find(c => c.type === 2 && (c.name.includes('👥') || c.name.includes('Membros') || c.name.includes('𝓜𝓮𝓶𝓫𝓻𝓸𝓼')));
    if (chMembros) {
      // Extrair online e total se possível, senão deixar 1 e 1 temporariamente até o bot atualizar
      const match = chMembros.name.match(/🟢\[(\d+)\] 🔴\[(\d+)\]/);
      const online = match ? match[1] : 1;
      const total = match ? match[2] : 1;
      
      // M = 𝓜, e = 𝓮, m = 𝓶, b = 𝓫, r = 𝓻, o = 𝓸, s = 𝓼
      const novoNomeMembros = `[ 👥 ] 𝓜𝓮𝓶𝓫𝓻𝓸𝓼: 🟢[${online}] 🔴[${total}]`;
      await chMembros.setName(novoNomeMembros).catch(console.error);
      console.log(`✅ Membros renomeado para: ${novoNomeMembros}`);
    }

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    process.exit(0);
  }
});

client.login(process.env.TOKEN);
