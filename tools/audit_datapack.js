const fs = require('fs');
const path = require('path');

const SERVER_DIR = 'server';
const ITEMS_XML = path.join(SERVER_DIR, 'data', 'items', 'items.xml');
const MONSTER_DIR = path.join(SERVER_DIR, 'data', 'monster');

let valid_item_ids = new Set();

console.log('Lendo ' + ITEMS_XML + '...');
try {
    const itemsData = fs.readFileSync(ITEMS_XML, 'utf-8');
    // Regex rudimentar para extrair ids
    const idRegex = /id="(\d+)(?:-(\d+))?"/g;
    let match;
    while ((match = idRegex.exec(itemsData)) !== null) {
        if (match[2]) {
            let start = parseInt(match[1]);
            let end = parseInt(match[2]);
            for(let i = start; i <= end; i++) valid_item_ids.add(i.toString());
        } else {
            valid_item_ids.add(match[1]);
        }
    }
    
    const fromIdRegex = /fromid="(\d+)"\s+toid="(\d+)"/g;
    while ((match = fromIdRegex.exec(itemsData)) !== null) {
        let start = parseInt(match[1]);
        let end = parseInt(match[2]);
        for(let i = start; i <= end; i++) valid_item_ids.add(i.toString());
    }
} catch (e) {
    console.log('Erro ao ler items.xml', e);
}

console.log('Total de items validos: ' + valid_item_ids.size);

let invalid_monster_items = 0;
console.log('\nAuditando Monstros em ' + MONSTER_DIR + '...');

function walkSync(dir, filelist = []) {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        try {
            filelist = fs.statSync(dirFile).isDirectory()
                ? walkSync(dirFile, filelist)
                : filelist.concat(dirFile);
        } catch(e) {}
    });
    return filelist;
}

const files = walkSync(MONSTER_DIR).filter(f => f.endsWith('.xml'));
for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    // Extract items inside <loot> tag. Roughly: <item id="xxx" ... />
    const lootMatch = content.match(/<loot>([\s\S]*?)<\/loot>/);
    if (lootMatch) {
        const lootContent = lootMatch[1];
        const itemRegex = /<item[^>]+id="(\d+)"/g;
        let match;
        while ((match = itemRegex.exec(lootContent)) !== null) {
            if (!valid_item_ids.has(match[1])) {
                console.log('[Monstro] ' + path.basename(file) + ': Loot usa ID invalido ' + match[1]);
                invalid_monster_items++;
            }
        }
    }
}

console.log('\nResumo: ' + invalid_monster_items + ' itens de monstros invalidos.');
