#!/bin/bash

# Script para iniciar TiendaYa con Docker
echo "🐳 Iniciando TiendaYa con Docker..."
echo "=================================="

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker Desktop."
    echo "   Descarga desde: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Verificar que Docker Compose esté instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado."
    exit 1
fi

echo "✅ Docker y Docker Compose están instalados"

# Crear directorios necesarios
echo "📁 Creando directorios necesarios..."
mkdir -p backend/uploads
mkdir -p database

# Limpiar contenedores anteriores si existen
echo "🧹 Limpiando contenedores anteriores..."
docker-compose down 2>/dev/null || true

# Construir y levantar los contenedores
echo "🔨 Construyendo contenedores..."
docker-compose build

echo "🚀 Iniciando servicios..."
docker-compose up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
echo "   Esto puede tomar 1-2 minutos en la primera ejecución..."

# Función para verificar si el servicio está listo
check_service() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose exec -T $service curl -f http://localhost:$port >/dev/null 2>&1 || 
           docker-compose logs $service | grep -q "listening\|ready\|started" 2>/dev/null; then
            echo "   ✅ $service está listo"
            return 0
        fi
        echo "   ⏳ Esperando $service... (intento $attempt/$max_attempts)"
        sleep 5
        attempt=$((attempt + 1))
    done
    
    echo "   ⚠️  $service puede no estar completamente listo"
    return 1
}

# Verificar servicios
check_service "mysql" "3306"
check_service "backend" "4000"

# Verificar estado de los contenedores
echo ""
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
echo "🔧 Comandos útiles:"
echo "   • Ver logs: docker-compose logs -f"
echo "   • Detener: docker-compose down"
echo "   • Reiniciar: docker-compose restart"
echo ""
echo "🛑 Para detener los servicios: ./scripts/stop-docker.sh"