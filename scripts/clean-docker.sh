#!/bin/bash

# Script para limpiar completamente Docker
echo "🧹 Limpiando Docker completamente..."
echo "=================================="

# Detener y eliminar contenedores
echo "🛑 Deteniendo contenedores..."
docker-compose down

# Eliminar imágenes
echo "🗑️ Eliminando imágenes..."
docker-compose down --rmi all

# Eliminar volúmenes (¡CUIDADO! Borra la base de datos)
echo "🗑️ Eliminando volúmenes..."
docker-compose down -v

# Limpiar sistema Docker
echo "🧹 Limpiando sistema Docker..."
docker system prune -a -f

echo ""
echo "✅ Limpieza completa realizada"
echo ""
echo "⚠️  NOTA: Todos los datos de la base de datos han sido eliminados"
echo "   Para volver a iniciar: ./scripts/start-docker.sh"
