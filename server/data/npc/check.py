import os

scripts = [f[:-4] for f in os.listdir('scripts') if f.endswith('.lua') and f != 'default.lua']
xmls = [f for f in os.listdir('.') if f.endswith('.xml')]

for x in xmls:
    for s in scripts:
        if x.lower() == s.lower().replace('_', ' ') + '.xml':
            with open(x, 'r') as file:
                if 'script="default.lua"' in file.read():
                    print(f'{x} uses default.lua but {s}.lua exists!')
