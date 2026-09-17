@echo off
echo ===================================================
echo   OTClient - Build Automatizado (Windows)
echo ===================================================
echo.
echo Requisitos:
echo - Visual Studio 2022 (Desktop development with C++)
echo - vcpkg (Integrado com o Visual Studio)
echo - CMake (Adicionado ao PATH)
echo.

if not exist "..\client_base\OTClient-Redemption" (
    echo [ERRO] O codigo fonte (OTClient-Redemption) nao foi encontrado em client_base/
    echo Por favor, certifique-se de que a pasta existe.
    exit /b 1
)

cd ..\client_base\OTClient-Redemption

echo [INFO] Limpando e criando diretorio de build...
if exist "build" rmdir /s /q build
mkdir build
cd build

echo [INFO] Gerando arquivos de solucao com CMake...
:: Ajuste o caminho do vcpkg de acordo com a sua maquina limpa (ex: C:\vcpkg)
cmake .. -G "Visual Studio 17 2022" -A x64 -DCMAKE_TOOLCHAIN_FILE=C:\vcpkg\scripts\buildsystems\vcpkg.cmake

echo [INFO] Compilando em modo Release...
cmake --build . --config Release

echo [INFO] Copiando binarios compilados para a pasta client/
copy Release\otclient*.exe ..\..\..\client\

echo.
echo ===================================================
echo Build finalizado com sucesso!
echo Execute otclient_dx.exe ou otclient_gl.exe na pasta client/ para conectar ao servidor local.
echo ===================================================
pause
