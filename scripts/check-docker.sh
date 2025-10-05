#!/bin/bash

# Script para verificar el estado de TiendaYa con Docker
echo "🔍 Verificando estado de TiendaYa..."
echo "=================================="

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado"
    exit 1
fi

echo "✅ Docker y Docker Compose están instalados"

# Verificar contenedores
echo ""
echo "📊 Estado de los contenedores:"
docker-compose ps

echo ""
echo "🔍 Verificando servicios..."

# Verificar MySQL
if docker-compose exec -T mysql mysqladmin ping -h localhost --silent; then
    echo "✅ MySQL está funcionando"
else
    echo "❌ MySQL no está respondiendo"
fi

# Verificar Backend
if curl -f http://localhost:4000/api/productos >/dev/null 2>&1; then
    echo "✅ Backend API está funcionando"
else
    echo "❌ Backend API no está respondiendo"
fi

# Verificar Frontend
if curl -f http://localhost:8081 >/dev/null 2>&1; then
    echo "✅ Frontend Expo está funcionando"
else
    echo "❌ Frontend Expo no está respondiendo"
fi

echo ""
echo "🌐 URLs disponibles:"
echo "   • Frontend: http://localhost:8081"
echo "   • Backend: http://localhost:4000"
echo "   • Base de datos: localhost:3306"

echo ""
echo "📱 Para conectar dispositivo móvil:"
echo "   1. Instala Expo Go"
echo "   2. Abre http://localhost:8081"
echo "   3. Escanea el código QR"
