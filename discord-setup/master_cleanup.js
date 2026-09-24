const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('ready', async () => {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.channels.fetch();

    console.log('--- Iniciando Limpeza Master ---');

    // 1. Limpar Log-Tickets
    const chLog = guild.channels.cache.find(c => c.type === 0 && c.name.includes('📋'));
    if (chLog) {
      const msgs = await chLog.messages.fetch({ limit: 100 });
      let c = 0;
      for (const m of msgs.values()) {
        await m.delete().catch(() => {});
        c++;
      }
      console.log(`✅ Log-Tickets: Apagadas ${c} mensagens.`);
    }

    // 2. Limpar Ranks
    const chRanks = guild.channels.cache.find(c => c.type === 0 && (c.name.includes('🏆') || c.name.toLowerCase().includes('rank')));
    if (chRanks) {
      const msgs = await chRanks.messages.fetch({ limit: 100 });
      let c = 0;
      for (const m of msgs.values()) {
        // Deleta tudo, exceto se for o "Quadro de Honra" (que a gente não fez, mas o user pode ter feito manual)
        const contentStr = (m.content + ' ' + (m.embeds.length ? m.embeds[0].title : '')).toLowerCase();
        if (!contentStr.includes('quadro de honra')) {
          await m.delete().catch(() => {});
          c++;
        }
      }
      console.log(`✅ Ranks: Apagadas ${c} mensagens.`);
    }

    // 3. Restaurar Comunicados (Painel Principal)
    const chComunicados = guild.channels.cache.find(c => c.type === 0 && c.name.includes('📢'));
    if (chComunicados) {
      const msgs = await chComunicados.messages.fetch({ limit: 100 });
      let hasAviso = false;
      for (const m of msgs.values()) {
        if (m.embeds.length > 0 && m.embeds[0].title && m.embeds[0].title.includes('Central de Avisos')) {
          hasAviso = true;
        }
      }
      
      if (!hasAviso) {
        const embed = new EmbedBuilder()
          .setColor('#F39C12')
          .setTitle('📢  Central de Avisos — NosleiraOT')
          .setDescription(
            '**Este canal é reservado para avisos oficiais do servidor.**\n\n' +
            '> 🌐  Acompanhe também os avisos em: **[www.nosleiraot.com](http://www.nosleiraot.com)**\n\n' +
            '⚙️  *Integração automática com o site em breve — os avisos do site serão publicados aqui automaticamente.*'
          )
          .setFooter({ text: 'NosleiraOT • Canal Oficial de Avisos' })
          .setTimestamp();
        await chComunicados.send({ embeds: [embed] });
        console.log(`✅ Comunicados: Painel restaurado.`);
      } else {
        console.log(`✅ Comunicados: Painel já existia.`);
      }
    }

    // 4. Limpar Comandos-Geral
    const chComandos = guild.channels.cache.find(c => c.type === 0 && (c.name.includes('🤖') || c.name.toLowerCase().includes('comandos')));
    if (chComandos) {
      const msgs = await chComandos.messages.fetch({ limit: 100 });
      let c = 0;
      // Ordenar por data
      const arr = Array.from(msgs.values()).sort((a, b) => a.createdTimestamp - b.createdTimestamp);
      if (arr.length > 0) {
        // Pula o primeiro (Painel de comandos)
        for (let i = 1; i < arr.length; i++) {
          await arr[i].delete().catch(() => {});
          c++;
        }
      }
      console.log(`✅ Comandos-Geral: Apagadas ${c} mensagens (Manteve só o painel).`);
    }

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    process.exit(0);
  }
});

client.login(process.env.TOKEN);
