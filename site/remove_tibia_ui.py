import sys

file_path = r'd:\Server\site\system\templates\characters.html.twig'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if '<!-- TIBIA UI START -->' in line:
        skip = True
        continue
    if '<!-- TIBIA UI END -->' in line:
        skip = False
        continue
    if not skip:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print('Done')
