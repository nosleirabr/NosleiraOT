import json
import os
import re

json_file = r"C:\Users\ariel\OneDrive\Desktop\Server\quests_clean.json"
xml_out = r"E:\ArquivosDesktop\Server\server\data\XML\quests.xml"
system_lua_in = r"E:\ArquivosDesktop\Server\server\data\actions\scripts\quests\system.lua"

with open(json_file, encoding='utf-8') as f:
    quests = json.load(f)

# Base storage ID for our generated quests to avoid conflict
BASE_STORAGE = 50000

xml_lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<quests>']

quest_mapping = {}

for idx, q in enumerate(quests):
    storage = BASE_STORAGE + idx
    name = q.get('name', 'Unknown')
    rewards = q.get('rewards', 'None')
    quest_mapping[name.lower()] = storage
    
    xml_lines.append(f'\t<quest name="{name}" startstorageid="{storage}" startstoragevalue="1">')
    xml_lines.append(f'\t\t<mission name="{name}" storageid="{storage}" storagevalue="1">')
    xml_lines.append(f'\t\t\t<missionstate id="1" description="You have completed this quest! Rewards: {rewards}" />')
    xml_lines.append(f'\t\t</mission>')
    xml_lines.append(f'\t</quest>')

xml_lines.append('</quests>')

# Write quests.xml
with open(xml_out, 'w', encoding='utf-8') as f:
    f.write('\n'.join(xml_lines))

# Read system.lua and inject storage assignments
with open(system_lua_in, 'r', encoding='utf-8', errors='ignore') as f:
    system_code = f.read()

# We need to find the function onUse(player, item, fromPosition, target, toPosition, isHotkey)
# and add logic to set the storage if the uniqueID matches our known mapped quests.
# To keep it simple, we'll create a table mapping UniqueID to StorageID at the top,
# and insert a setStorageValue line in onUse.

# First, extract existing uniqueId -> quest name from comments
unique_to_storage = {}
for match in re.finditer(r'\[(\d+)\]\s*=\s*\{.*?\}.*?--\s*(.*?)(?:\n|$)', system_code, re.IGNORECASE):
    uid = int(match.group(1))
    comment_name = match.group(2).strip().lower().replace(' quest', '')
    
    # fuzzy find in quest_mapping
    for q_name, q_storage in quest_mapping.items():
        if comment_name in q_name or q_name.replace(' quest', '') in comment_name:
            unique_to_storage[uid] = q_storage
            break

# Generate the lua table
lua_mapping = "local questLogStorages = {\n"
for uid, stor in unique_to_storage.items():
    lua_mapping += f"    [{uid}] = {stor},\n"
lua_mapping += "}\n\n"

# Inject into system.lua
if "local questLogStorages =" not in system_code:
    # Insert right before onUse
    onuse_idx = system_code.find("function onUse")
    if onuse_idx != -1:
        new_code = system_code[:onuse_idx] + lua_mapping + system_code[onuse_idx:]
        
        # Now inject the setStorage inside onUse where they get the reward
        # We look for player:addItem or player:sendTextMessage
        # Actually, simpler: right after `local reward = questRewards[item.uid]`
        inject_spot = "if not reward then"
        inject_idx = new_code.find(inject_spot)
        if inject_idx != -1:
            # We want to add it right before returning true at the end, or when setting storage
            # system.lua usually does `player:setStorageValue(item.uid, 1)`
            # We'll just replace `player:setStorageValue(item.uid, 1)` with our custom logic too,
            # but let's find `player:setStorageValue`
            set_storage_idx = new_code.find("player:setStorageValue(")
            if set_storage_idx != -1:
                # Find the end of that line
                end_line = new_code.find("\n", set_storage_idx)
                injection = "\n    if questLogStorages[item.uid] then player:setStorageValue(questLogStorages[item.uid], 1) end"
                new_code = new_code[:end_line] + injection + new_code[end_line:]
        
        with open(system_lua_in, 'w', encoding='utf-8') as f:
            f.write(new_code)
            
print(f"quests.xml rewritten with {len(quests)} quests!")
print(f"system.lua patched with {len(unique_to_storage)} Quest Log mappings!")
