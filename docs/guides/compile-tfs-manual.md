# Guia: Compilar o TFS 1.2 Manualmente (sem Docker)

Use este guia quando o Docker falhar ou quando você quiser compilar o server diretamente na sua máquina.

---

## Pré-requisitos (Ubuntu 22.04 / WSL2)

```bash
sudo apt-get update
sudo apt-get install -y \
  build-essential cmake git pkg-config \
  libboost-system-dev libboost-iostreams-dev \
  liblua5.3-dev \
  libmysqlclient-dev \
  libpugixml-dev \
  libgmp-dev
```

> **Windows nativo:** use WSL2 com Ubuntu 22.04. Compilação MSVC é possível mas não é o fluxo padrão deste projeto.

---

## Clonar o repositório (se necessário)

```bash
# O server fica em server/ dentro do workspace
cd /caminho/para/workspace/server
```

---

## Desabilitar cotire (necessário para builds sem cache pré-compilado)

O TFS 1.2 usa `cotire` para headers pré-compilados, mas isso quebra builds limpos em CI. Desabilite manualmente:

```bash
sed -i 's/include(cotire)/#include(cotire)/' CMakeLists.txt
sed -i '/set_target_properties(tfs PROPERTIES COTIRE/d' CMakeLists.txt
sed -i '/cotire(tfs)/d' CMakeLists.txt
```

> **Atenção:** não commite esse `CMakeLists.txt` modificado. Use apenas localmente.

---

## Compilar

```bash
mkdir -p build
cd build

cmake .. \
  -DCMAKE_BUILD_TYPE=Release \
  -DUSE_LUAJIT=OFF \
  -DLUA_INCLUDE_DIR=/usr/include/lua5.3 \
  -DLUA_LIBRARY=/usr/lib/x86_64-linux-gnu/liblua5.3.so

cmake --build . -- -j"$(nproc)"
```

O binário `tfs` será gerado em `build/`.

---

## Executar o server manualmente

```bash
# A partir de server/server/ (onde estão config.lua e data/)
./build/tfs
```

Configure `config.lua` apontando para o banco de dados:

```lua
mysqlHost = "127.0.0.1"
mysqlPort = 3306
mysqlUser = "tibia"
mysqlPass = "tibia"
mysqlDatabase = "tibia"
```

---

## Configurar o banco de dados manualmente

```bash
# Importe o schema (MariaDB / MySQL)
mysql -u root -p tibia < server/server/schema.sql
```

---

## Troubleshooting comum

| Erro | Solução |
|------|---------|
| `lua5.3 not found` | `sudo apt-get install liblua5.3-dev` |
| `mysql client not found` | `sudo apt-get install libmysqlclient-dev` |
| `cotire` errors | Aplique os `sed` acima |
| Link error `boost` | `sudo apt-get install libboost-all-dev` |

---

## Voltar ao Docker

Quando resolver o problema do Docker, volte ao fluxo normal:

```bash
docker compose up -d --build
docker compose logs -f tfs
```
