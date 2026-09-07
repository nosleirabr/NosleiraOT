import json
import os

with open('quests_clean.json', encoding='utf-8') as f:
    quests = json.load(f)

md = f"# Quests DeusOLD (Total: {len(quests)})\n\n"
for q in quests:
    md += f"## {q.get('name')}\n"
    md += f"- **Level:** {q.get('level')}\n"
    md += f"- **Local:** {q.get('location')}\n"
    md += f"- **Premium:** {q.get('premium')}\n"
    md += f"- **Recompensas:** {q.get('rewards')}\n"
    md += f"- **Link:** {q.get('link')}\n\n"

artifact_path = os.path.join(os.environ.get('APPDATA', ''), '..', 'Local', 'Temp', 'DeusOLD_Quests.md')
# Actually, I'll just write it directly to the artifact directory.
artifact_dir = r"C:\Users\ariel\.gemini\antigravity\brain\2c81f8bd-2a97-4e84-9471-ea414b149a6c"
os.makedirs(artifact_dir, exist_ok=True)
with open(os.path.join(artifact_dir, 'DeusOLD_Quests.md'), 'w', encoding='utf-8') as f:
    f.write(md)
