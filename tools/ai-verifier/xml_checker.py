import os
import xml.etree.ElementTree as ET
import argparse
import sys

def check_xml_files(directory, file_type):
    print(f"[*] Analisando diretório de {file_type}: {directory}...")
    errors = []
    
    if not os.path.exists(directory):
        print(f"    [!] Diretório não encontrado: {directory}")
        return errors
        
    for root_dir, dirs, files in os.walk(directory):
        for file in files:
            if file == 'monsters.xml':
                continue
            if file.endswith('.xml'):
                filepath = os.path.join(root_dir, file)
                try:
                    tree = ET.parse(filepath)
                    root = tree.getroot()
                    
                    # Checagens específicas para Monstros
                    if file_type == 'monster':
                        if root.tag != 'monster':
                            errors.append(f"[{file}] A tag raiz deveria ser <monster>, mas é <{root.tag}>.")
                        if not root.get('name'):
                            errors.append(f"[{file}] O monstro não tem o atributo 'name'.")
                            
                    # Checagens específicas para NPCs
                    elif file_type == 'npc':
                        if root.tag != 'npc':
                            errors.append(f"[{file}] A tag raiz deveria ser <npc>, mas é <{root.tag}>.")
                        if not root.get('name'):
                            errors.append(f"[{file}] O NPC não tem o atributo 'name'.")
                            
                except ET.ParseError as e:
                    errors.append(f"[{file}] ERRO DE SINTAXE (XML quebrado): {str(e)}")
                except Exception as e:
                    errors.append(f"[{file}] ERRO DESCONHECIDO: {str(e)}")
                    
    return errors

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AI XML Verifier para OpenTibia 7.4")
    parser.add_argument('--data-dir', type=str, required=True, help="Caminho para a pasta 'data' do servidor")
    args = parser.parse_args()
    
    monster_dir = os.path.join(args.data_dir, 'monster')
    npc_dir = os.path.join(args.data_dir, 'npc')
    
    all_errors = []
    all_errors.extend(check_xml_files(monster_dir, 'monster'))
    all_errors.extend(check_xml_files(npc_dir, 'npc'))
    
    if all_errors:
        print("\n" + "="*50)
        print("!!! RELATÓRIO DE ERROS ENCONTRADOS !!!")
        print("="*50)
        for err in all_errors:
            print(f" - {err}")
        print("\n-> A IA pode usar esse relatório para corrigir os arquivos automaticamente.")
        print(f"Total de problemas: {len(all_errors)}")
        sys.exit(1)
    else:
        print("\n[OK] Sucesso! Nenhum erro de sintaxe encontrado nos XMLs de Monstros e NPCs.")
        sys.exit(0)
