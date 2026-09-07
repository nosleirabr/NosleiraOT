import json
import re
import os
import xml.etree.ElementTree as ET

# 1. Parse DeusOLD monsters from monsters.html
html_path = r"C:\Users\ariel\OneDrive\Desktop\Server\monsters.html"

with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

match = re.search(r'const MONSTERS\s*=\s*(\[.*?\]);', content, re.DOTALL)
if not match:
    # Try alternative regex
    match = re.search(r'const MONSTERS\s*=\s*(\[.*?\n\]);', content, re.DOTALL)

if match:
    monsters_json_str = match.group(1)
    deusold_monsters = json.loads(monsters_json_str)
else:
    print("Could not find const MONSTERS in HTML!")
    deusold_monsters = []

print(f"Total de Monstros no DeusOLD Wiki: {len(deusold_monsters)}")

# 2. Parse Local Server Monsters
local_monster_dir = r"C:\Users\ariel\OneDrive\Desktop\Server\server\data\monster"
local_monsters = []

if os.path.exists(local_monster_dir):
    for root_dir, dirs, files in os.walk(local_monster_dir):
        for file in files:
            if file.endswith('.xml') and file != 'monsters.xml':
                # Try to get monster name from XML file or root tag
                filepath = os.path.join(root_dir, file)
                try:
                    tree = ET.parse(filepath)
                    root = tree.getroot()
                    m_name = root.attrib.get('name', file.replace('.xml', '').capitalize())
                    local_monsters.append({'name': m_name, 'file': file, 'path': filepath})
                except Exception:
                    local_monsters.append({'name': file.replace('.xml', '').capitalize(), 'file': file, 'path': filepath})

print(f"Total de Monstros no seu Servidor Local: {len(local_monsters)}")

# Save clean json of DeusOLD monsters
with open(r"C:\Users\ariel\OneDrive\Desktop\Server\deusold_monsters.json", "w", encoding="utf-8") as f:
    json.dump(deusold_monsters, f, indent=2)

# Save local monsters
with open(r"C:\Users\ariel\OneDrive\Desktop\Server\local_monsters.json", "w", encoding="utf-8") as f:
    json.dump(local_monsters, f, indent=2)

# 3. Non-7.4 Monster Keywords/Names (Post-7.4 updates: 7.5 Port Hope, 7.8 Svargrond, 7.9 PoI, 8.4 Yalahar, etc.)
# 7.4 (released late 2004/early 2005) had mainland + Darashia + Ankrahmun + Kazordoon + Thais + Carlin + Venore + Edron + Rookgaard.
# Tiquanda/Port Hope was 7.5 (Aug 2005). Svargrond/Ice Islands revamp was 7.8 (2006). PoI was 7.9 (Dec 2006). Yalahar was 8.4 (2008).

post_74_monsters_known = [
    # 7.5 Port Hope / Tiquanda
    "hydra", "crocodile", "elephant", "tiquandas revenge", "terror bird", "carniphila", 
    "centipede", "dworc venombearer", "dworc fleshhunter", "dworc voodoomaster", 
    "lizard sentinel", "lizard snakecharmer", "lizard templar", "kongra", "sibang", "merlkin",
    # 7.8 Svargrond / Ice Islands
    "mammoth", "barbarian bloodwalker", "barbarian headsplitter", "barbarian skullhunter", "barbarian brutetamer",
    "ice golem", "crystal spider", "frost dragon", "ice witch", "braindeath", "chrysalis", "badger", "penguin", "silver rabbit",
    # 7.9 Pits of Inferno / 8.0
    "hellhound", "nightmare", "defiler", "plaguesmith", "lost soul", "spectre", "destroyer", 
    "juggernaut", "hand of cursed fate", "dark torturer", "betrayed wraith", "son of verminor", "avatara",
    # 8.4 Yalahar / Zao / Modern
    "grim reaper", "nightstalker", "wyrm", "sea serpent", "mutated rat", "mutated tiger", 
    "mutated human", "hellspawn", "war golem", "worker golem", "bog raider", "earth elemental", "energy elemental",
    # 7.5 Bosses & 8.0 Bosses
    "orshabaal", "morgaroth", "ghazbaran", "ferumbras", "ferumbras' soul"
]

deusold_names = [m['name'] for m in deusold_monsters]
local_names = [m['name'] for m in local_monsters]

deusold_set = set(n.lower() for n in deusold_names)
local_set = set(n.lower() for n in local_names)

deusold_post74 = [n for n in deusold_names if any(p in n.lower() for p in post_74_monsters_known)]
local_post74 = [n for n in local_names if any(p in n.lower() for p in post_74_monsters_known)]

print(f"\n--- ANÁLISE DE FIDELIDADE ---")
print(f"Monstros pós-7.4 (Port Hope, Svargrond, PoI, Yalahar, Bosses pós-7.4) encontrados no DeusOLD ({len(deusold_post74)}):")
for d in sorted(deusold_post74)[:20]:
    print(f"  - {d}")
if len(deusold_post74) > 20:
    print(f"  ... e mais {len(deusold_post74)-20}")

print(f"\nMonstros pós-7.4 encontrados no SEU SERVIDOR LOCAL ({len(local_post74)}):")
for l in sorted(local_post74):
    print(f"  - {l}")
