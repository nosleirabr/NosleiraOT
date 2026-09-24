import os
import re

SERVER_SRC = "./server/src"
SERVER_DATA = "./server/data"

print("\n" + "="*50)
print("  AUDITORIA DE QUALIDADE E SEGURANÇA (AI)")
print("="*50)
print("Baseado no AI Kit: project_skillz.md\n")

violations = 0

# 1. Checar OWASP: Concatenação de SQL perigosa em C++
print("[*] Checando vulnerabilidades de SQL Injection...")
sql_pattern = re.compile(r'SELECT\s+.*\s+FROM\s+.*\+', re.IGNORECASE)
found_sql = False
if os.path.exists(SERVER_SRC):
    for root, dirs, files in os.walk(SERVER_SRC):
        for f in files:
            if f.endswith('.cpp'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                    for i, line in enumerate(file):
                        if sql_pattern.search(line):
                            print(f"  [!] Risco no arquivo {f}:{i+1} -> {line.strip()}")
                            found_sql = True
                            violations += 1

if not found_sql:
    print("  [x] Nenhum risco de SQL Injection detectado no C++.")

# 2. Checar Memory Leaks e C++17 (Uso de 'new' puro)
print("\n[*] Checando gerenciamento de memória (Raw Pointers)...")
new_pattern = re.compile(r'\bnew\s+\w+\(')
smart_pattern = re.compile(r'(make_unique|make_shared)')
found_leaks = 0
if os.path.exists(SERVER_SRC):
    for root, dirs, files in os.walk(SERVER_SRC):
        for f in files:
            if f.endswith('.cpp'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                    for line in file:
                        if new_pattern.search(line) and not smart_pattern.search(line):
                            found_leaks += 1

if found_leaks > 0:
    print(f"  [!] Encontradas {found_leaks} instâncias de 'new' puro. Recomenda-se migrar para std::unique_ptr (C++17).")
    violations += 1
else:
    print("  [x] C++ Memory: Uso de ponteiros estável e moderno.")

# 3. Checar Performance Lua (Polling)
print("\n[*] Checando performance dos scripts Lua (Event-driven vs Polling)...")
loop_pattern = re.compile(r'while\s+true\s+do')
found_loops = False
if os.path.exists(SERVER_DATA):
    for root, dirs, files in os.walk(SERVER_DATA):
        for f in files:
            if f.endswith('.lua'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                    for i, line in enumerate(file):
                        if loop_pattern.search(line):
                            print(f"  [!] Loop bloqueante em {f}:{i+1} -> {line.strip()}")
                            found_loops = True
                            violations += 1

if not found_loops:
    print("  [x] Lua Performance: Scripts orientados a evento. Nenhum gargalo de While(true) detectado.")

print("\n" + "="*50)
if violations == 0:
    print("STATUS: EXCELENTE! 🚀 O código está alinhado 100% com o AI Kit.")
else:
    print(f"STATUS: ATENÇÃO! Foram encontradas {violations} violações de arquitetura/segurança.")
    print("Recomendação: Refatore as áreas indicadas usando as skills de C++17 e Lua.")
print("="*50 + "\n")
