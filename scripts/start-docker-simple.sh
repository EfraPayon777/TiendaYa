#!/bin/bash

# Script simple para iniciar TiendaYa con Docker
echo "🐳 Iniciando TiendaYa con Docker..."
echo "=================================="

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker Desktop."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado."
    exit 1
fi

echo "✅ Docker y Docker Compose están instalados"

# Detener contenedores anteriores
echo "🧹 Limpiando contenedores anteriores..."
docker-compose down 2>/dev/null || true

# Iniciar servicios
echo "🚀 Iniciando servicios..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado
echo "📊 Estado de los contenedores:"
docker-compose ps

echo ""
echo "✅ TiendaYa está ejecutándose con Docker!"
echo "=================================="
echo ""
echo "🌐 Servicios disponibles:"
echo "   • Frontend (Expo): http://localhost:8081"
echo "   • Backend API: http://localhost:4000"
echo "   • Base de datos MySQL: localhost:3307"
echo ""
echo "📱 Para conectar tu dispositivo móvil:"
echo "   1. Instala Expo Go en tu dispositivo"
echo "   2. Abre http://localhost:8081 en tu navegador"
echo "   3. Escanea el código QR con Expo Go"
echo ""
echo "🛑 Para detener los servicios:"
echo "   • Ejecuta: ./scripts/stop-docker.sh"
echo "   • O ejecuta: docker-compose down"
