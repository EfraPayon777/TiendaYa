#!/bin/bash

# Script para iniciar TiendaYa en modo local (sin Docker)
echo "🚀 Iniciando TiendaYa en modo LOCAL..."
echo "=================================="

# Verificar que MySQL esté instalado localmente
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL no está instalado localmente"
    echo "   Por favor instala MySQL y configura la base de datos 'tiendaya'"
    echo "   Usuario: root, Contraseña: 2005"
    exit 1
fi

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "   Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    echo "   Por favor instala npm"
    exit 1
fi

echo "✅ MySQL, Node.js y npm están instalados"

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install

# Iniciar backend
echo "🚀 Iniciando backend..."
node server.js &
BACKEND_PID=$!

# Volver al directorio raíz
cd ..

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
npm install

# Iniciar frontend
echo "🚀 Iniciando frontend..."
npx expo start --host tunnel &
FRONTEND_PID=$!

echo ""
echo "✅ TiendaYa está ejecutándose en modo LOCAL!"
echo "=================================="
echo ""
echo "🌐 Servicios disponibles:"
echo "   • Frontend (Expo): http://localhost:8081"
echo "   • Backend API: http://localhost:4000"
echo "   • Base de datos MySQL: localhost:3306"
echo ""
echo "📱 Para conectar tu dispositivo móvil:"
echo "   1. Instala Expo Go en tu dispositivo"
echo "   2. Abre http://localhost:8081 en tu navegador"
echo "   3. Escanea el código QR con Expo Go"
echo ""
echo "🛑 Para detener los servicios:"
echo "   • Presiona Ctrl+C en esta terminal"
echo "   • O ejecuta: ./scripts/stop-local.sh"
echo ""
echo "🔧 PIDs de los procesos:"
echo "   • Backend PID: $BACKEND_PID"
echo "   • Frontend PID: $FRONTEND_PID"

# Esperar a que el usuario presione Ctrl+C
trap "echo '🛑 Deteniendo servicios...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Mantener el script ejecutándose
wait
