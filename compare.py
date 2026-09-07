import json
import re
import os

backup_quests_dir = r"E:\OT-BECKUP\server\server\data\actions\scripts\quests"
deusold_quests_file = r"C:\Users\ariel\OneDrive\Desktop\Server\quests_clean.json"

with open(deusold_quests_file, encoding='utf-8') as f:
    deusold = json.load(f)

# Extract quest hints from system.lua
system_lua_path = os.path.join(backup_quests_dir, "system.lua")
with open(system_lua_path, encoding='utf-8', errors='ignore') as f:
    system_code = f.read()

# Find comments in questRewards table like -- Quest Name
found_quests = set()
for match in re.finditer(r'--\s*(.*?Quest.*)', system_code, re.IGNORECASE):
    found_quests.add(match.group(1).strip().lower())

# Also check file names in the quests folder
for f in os.listdir(backup_quests_dir):
    if f.endswith('.lua'):
        found_quests.add(f.replace('.lua', '').replace('_', ' ').lower())

missing = []
for q in deusold:
    name = q['name'].lower()
    # fuzzy check
    match = False
    for fq in found_quests:
        if name.replace(' quest', '') in fq or fq.replace(' quest', '') in name:
            match = True
            break
    if not match:
        missing.append(q['name'])

print(f"Total DeusOLD quests: {len(deusold)}")
print(f"Total potentially missing or unmapped: {len(missing)}")
print("Missing:")
for m in missing:
    print(f"- {m}")
