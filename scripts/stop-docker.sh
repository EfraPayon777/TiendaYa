#!/bin/bash

# Script para detener TiendaYa con Docker
echo "🛑 Deteniendo TiendaYa con Docker..."

# Detener y eliminar contenedores
echo "🛑 Deteniendo contenedores..."
docker-compose down

echo "✅ Servicios Docker detenidos"
echo ""
echo "🌐 Para volver a iniciar:"
echo "   • Modo Docker: ./scripts/start-docker.sh"
echo "   • Modo local: ./scripts/start-local.sh"