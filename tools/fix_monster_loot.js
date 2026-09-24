const fs = require('fs');
const path = require('path');
const MONSTER_DIR = 'server/data/monster';

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
const invalidIds = ['3976', '7404', '3972'];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let changed = false;
    for (const id of invalidIds) {
        // match <item id="xxx" ... /> and <item id="xxx" ... >...</item>
        const regex = new RegExp('<item[^>]+id="' + id + '"[^>]*>(?:.*?<\/item>)?', 'gs');
        if (regex.test(content)) {
            content = content.replace(regex, '');
            changed = true;
        }
    }
    // Remove empty lines created by replace
    if (changed) {
        content = content.replace(/^\s*[\r\n]/gm, '');
        fs.writeFileSync(file, content);
        console.log('Corrigido: ' + file);
    }
}
