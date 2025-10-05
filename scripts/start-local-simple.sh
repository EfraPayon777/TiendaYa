#!/bin/bash

# Script simple para iniciar TiendaYa en modo local
echo "💻 Iniciando TiendaYa en modo LOCAL..."
echo "=================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Instalar dependencias del frontend si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
fi

# Iniciar backend en segundo plano
echo "🚀 Iniciando backend..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# Esperar un momento para que el backend se inicie
sleep 3

# Iniciar frontend
echo "🚀 Iniciando frontend..."
npx expo start --host lan &
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

# Función para limpiar al salir
cleanup() {
    echo "🛑 Deteniendo servicios..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Capturar Ctrl+C
trap cleanup INT

# Mantener el script ejecutándose
wait
