import json

with open('C:/Users/ariel/OneDrive/Desktop/Server/quests_clean.json', encoding='utf-8') as f:
    deusold = json.load(f)

non_74_keywords = ['potion', 'wand', 'yalahar', 'twinkiller', 'thieves guild', 'aruthang']

custom_or_suspect = []
authentic_74 = []

for q in deusold:
    name = q.get('name')
    rewards = q.get('rewards', '')
    location = q.get('location', '')
    
    reasons = []
    r_lower = rewards.lower()
    loc_lower = location.lower()
    
    for kw in non_74_keywords:
        if kw in r_lower or kw in loc_lower:
            reasons.append(kw)
            
    if 'voodoo doll (king)' in r_lower:
        reasons.append('custom item (voodoo doll king)')
        
    if reasons:
        custom_or_suspect.append((name, rewards, location, reasons))
    else:
        authentic_74.append((name, rewards, location))

print(f"Total Quests DeusOLD: {len(deusold)}")
print(f"\n--- QUESTS COM ITENS/LOCAIS CUSTOM OU PÓS-7.4 ({len(custom_or_suspect)}) ---")
for name, rewards, loc, reasons in custom_or_suspect:
    reason_str = ", ".join(reasons)
    print(f"* {name} (Local: {loc}) -> Recompensa: {rewards} | [Alertas: {reason_str}]")

print(f"\n--- TOTAL DE QUESTS AUTÊNTICAS 7.4 (2004): {len(authentic_74)} ---")
