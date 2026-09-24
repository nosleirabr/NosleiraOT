const fs = require('fs');

const botFile = 'd:/Server/discord-setup/bot.js';
let content = fs.readFileSync(botFile, 'utf8');

// Remove all existing music_ blocks
content = content.replace(/if \(interaction\.isButton\(\) && customId\.startsWith\('music_'\)\) \{\s*return interaction\.reply\(\{\s*content: '.*?',\s*ephemeral: true\s*\}\);\s*\}/g, '');
content = content.replace(/if \(interaction\.isButton\(\) && customId\.startsWith\('music_'\)\) \{\s*return interaction\.reply\(\{\s*content: '.*?',\s*ephemeral: true\s*\}\n/g, ''); // Fix broken blocks if any

// Clean up extra empty lines
content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

// Insert exactly one correct block
const correctBlock = `
  if (interaction.isButton() && customId.startsWith('music_')) {
    return interaction.reply({
      content: '🎵 **Opa!** Para controlar o DJ, por favor, utilize os comandos de texto no chat (ex: \`!play\`, \`!pause\`, \`!skip\`). Esses botões são atalhos ilustrativos das funções!',
      ephemeral: true
    });
  }
`;

content = content.replace('const { customId, guild, member, channel } = interaction;', 'const { customId, guild, member, channel } = interaction;' + correctBlock);

fs.writeFileSync(botFile, content, 'utf8');
console.log('Fixed bot.js successfully!');
