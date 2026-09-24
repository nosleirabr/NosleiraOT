const fs = require('fs');
const files = [
    'bear.xml', 'bosses/general_murius.xml', 'cave rat.xml', 'crypt shambler.xml', 
    'elder beholder.xml', 'ghoul.xml', 'hyaena.xml', 'mummy.xml', 'rat.xml', 'rotworm.xml'
];
for (const f of files) {
    const path = 'server/data/monster/' + f;
    let c = fs.readFileSync(path, 'utf8');
    c = c.replace(/<!--\s*<\/loot>/g, '</loot>');
    fs.writeFileSync(path, c);
}
