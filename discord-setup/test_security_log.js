const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.channels.fetch();
    
    // Procura o canal de Segurança
    const securityChannel = guild.channels.cache.find(c => c.name.includes('🔒') || c.name.includes('𝗦𝗲𝗴𝘂𝗿𝗮𝗻𝗰𝗮'));
    
    if (securityChannel) {
      const embedTest = new EmbedBuilder()
        .setColor('#FF0000') // Vermelho de alerta
        .setTitle('🚨 [TESTE] Alerta de Segurança e Atividade')
        .setDescription('**Atenção Staff:** Este é apenas um teste de notificação de segurança solicitado.')
        .addFields(
          { name: '👤 Usuário Detectado', value: '<@123456789012345678> (SpammerTeste#1234)', inline: true },
          { name: '🛡️ Ação Automática', value: 'Mutado por 10 minutos (Flood/Spam)', inline: true },
          { name: '📝 Motivo', value: 'Envio excessivo de mensagens contendo links maliciosos ou proibidos repetidas vezes.', inline: false },
          { name: '🕒 Horário da Ocorrência', value: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }), inline: false }
        )
        .setFooter({ text: 'NosleiraOT • Sistema Automático de Segurança', iconURL: guild.iconURL() })
        .setTimestamp();

      await securityChannel.send({ content: '🔔 **[ALERTA DE SISTEMA]** Notificação de segurança simulada gerada com sucesso.', embeds: [embedTest] });
      console.log(`✅ Teste enviado para ${securityChannel.name}`);
    } else {
      console.log('Canal de segurança não encontrado!');
    }
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    process.exit(0);
  }
});

client.login(process.env.TOKEN);
