@echo off
REM Script para configurar el proyecto automaticamente
REM Copia las credenciales de Firebase necesarias

if exist .env (
    echo .env ya existe, saltando copia...
) else (
    echo Creando .env con credenciales de Firebase...
    copy .env.example .env
    echo ✓ .env creado exitosamente
)

echo.
echo Instalando dependencias...
call npm.cmd install

echo.
echo ✓ Proyecto listo para ejecutar
echo.
echo Para iniciar la app, ejecuta:
echo   npm.cmd run start
echo.
