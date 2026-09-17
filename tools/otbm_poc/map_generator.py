import json
import struct
import os

# POC: Gerador estrutural de OTBM a partir de JSON
# NOTA: Este e um script de Prova de Conceito (POC) e nao gera um arquivo
# totalmente compativel com o TFS sem o header completo. O objetivo e validar
# a conversao estrutural de JSON (Map-as-code) para a arvore de Nos OTBM.

# IDs basicos de Nodes (Arvore OTBM)
OTBM_MAP_DATA = 0x02
OTBM_TILE_AREA = 0x04
OTBM_TILE = 0x05
OTBM_ITEM = 0x06
NODE_START = 0xFE
NODE_END = 0xFF
ESCAPE_CHAR = 0xFD

def write_node_start(f, node_type):
    f.write(struct.pack('B', ESCAPE_CHAR))
    f.write(struct.pack('B', NODE_START))
    f.write(struct.pack('B', node_type))

def write_node_end(f):
    f.write(struct.pack('B', ESCAPE_CHAR))
    f.write(struct.pack('B', NODE_END))

def generate_poc_otbm(json_path, output_path):
    print(f"Lendo mapa em JSON: {json_path}...")
    with open(json_path, 'r') as jf:
        map_data = json.load(jf)
    
    print(f"Gerando formato binario OTBM estrutural em: {output_path}...")
    with open(output_path, 'wb') as f:
        # Header falso (Ignorado nesta POC simplificada)
        f.write(b'OTBM\x00\x00\x00\x00')
        
        # Iniciando o map data node
        write_node_start(f, OTBM_MAP_DATA)
        
        for area in map_data.get('areas', []):
            write_node_start(f, OTBM_TILE_AREA)
            
            # Base coords (x,y,z) uint16
            f.write(struct.pack('<H', area['x']))
            f.write(struct.pack('<H', area['y']))
            f.write(struct.pack('<B', area['z']))
            
            for tile in area.get('tiles', []):
                write_node_start(f, OTBM_TILE)
                # Offset X, Y da area
                f.write(struct.pack('<B', tile['x'] - area['x']))
                f.write(struct.pack('<B', tile['y'] - area['y']))
                
                # Ground item
                for item in tile.get('items', []):
                    write_node_start(f, OTBM_ITEM)
                    f.write(struct.pack('<H', item['id']))
                    write_node_end(f) # End item
                
                write_node_end(f) # End tile
                
            write_node_end(f) # End tile area
            
        write_node_end(f) # End map data

    print("POC Concluida. (Tamanho gerado: {} bytes)".format(os.path.getsize(output_path)))

if __name__ == '__main__':
    # Usando como teste
    json_poc = {
        "areas": [
            {
                "x": 1000, "y": 1000, "z": 7,
                "tiles": [
                    {"x": 1000, "y": 1000, "items": [{"id": 470}]} # Grass
                ]
            }
        ]
    }
    
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    with open('test_map.json', 'w') as f:
        json.dump(json_poc, f, indent=2)
        
    generate_poc_otbm('test_map.json', 'test_map.otbm')
