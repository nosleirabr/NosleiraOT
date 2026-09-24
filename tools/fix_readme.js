const fs = require('fs');
let content = fs.readFileSync('README.md', 'utf8');
content = content.replace('M3 - Server testável CI | Em andamento (50%) ??', 'M3 - Server testável CI | Concluído (100%) ?');
content = content.replace('M5 - Infra nuvem e segurança | Planejado (17%) ?', 'M5 - Infra nuvem e segurança | Aguardando VPS (50%) ?');
content = content.replace('M6 - Release base estável | Planejado (40%) ?', 'M6 - Release base estável | Concluído Localmente (90%) ?');
fs.writeFileSync('README.md', content, 'utf8');
