@echo off
echo ==========================================
echo  Mente Trader - Instalacao e Inicializacao
echo ==========================================
echo.

:: Verificar se Node.js esta instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Por favor, instale o Node.js em: https://nodejs.org
    echo Recomendamos a versao LTS mais recente.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado:
node --version
echo.

:: Instalar dependencias
echo Instalando dependencias (pode demorar alguns minutos)...
npm install

if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias.
    pause
    exit /b 1
)

echo.
echo [OK] Dependencias instaladas com sucesso!
echo.

:: Iniciar o servidor de desenvolvimento
echo Iniciando Mente Trader em http://localhost:5173 ...
echo.
echo Pressione Ctrl+C para parar o servidor.
echo.
npm run dev

pause
