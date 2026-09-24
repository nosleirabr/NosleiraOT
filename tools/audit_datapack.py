import os
import xml.etree.ElementTree as ET
import re

SERVER_DIR = "server"
ITEMS_XML = os.path.join(SERVER_DIR, "data", "items", "items.xml")
MONSTER_DIR = os.path.join(SERVER_DIR, "data", "monster")

valid_item_ids = set()

print(f"Lendo {ITEMS_XML}...")
try:
    tree = ET.parse(ITEMS_XML)
    root = tree.getroot()
    for item in root.findall('item'):
        if 'id' in item.attrib:
            ids = item.attrib['id'].split('-')
            if len(ids) == 2:
                for i in range(int(ids[0]), int(ids[1])+1):
                    valid_item_ids.add(str(i))
            else:
                valid_item_ids.add(ids[0])
        if 'fromid' in item.attrib and 'toid' in item.attrib:
            for i in range(int(item.attrib['fromid']), int(item.attrib['toid'])+1):
                valid_item_ids.add(str(i))
except Exception as e:
    print(f"Erro ao ler items.xml: {e}")

print(f"Total de items validos: {len(valid_item_ids)}")

invalid_monster_items = 0
print(f"\nAuditando Monstros em {MONSTER_DIR}...")
for root_dir, dirs, files in os.walk(MONSTER_DIR):
    for f in files:
        if f.endswith('.xml'):
            path = os.path.join(root_dir, f)
            try:
                tree = ET.parse(path)
                monster = tree.getroot()
                loot = monster.find('loot')
                if loot is not None:
                    for item in loot.iter('item'):
                        item_id = item.attrib.get('id')
                        if item_id and item_id not in valid_item_ids:
                            print(f"[Monstro] {f}: Loot usa ID invalido '{item_id}'")
                            invalid_monster_items += 1
            except Exception as e:
                pass

print(f"\nResumo: {invalid_monster_items} itens de monstros invalidos.")
