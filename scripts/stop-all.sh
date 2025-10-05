#!/bin/bash

# Script para detener todos los servicios (local y Docker)
echo "🛑 Deteniendo todos los servicios de TiendaYa..."

# Detener procesos de Node.js
echo "🔍 Deteniendo procesos locales..."
pkill -f "node server.js" 2>/dev/null || true
pkill -f "expo start" 2>/dev/null || true

# Liberar puertos
echo "🔍 Liberando puertos..."
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
lsof -ti:8081 | xargs kill -9 2>/dev/null || true

# Detener Docker
echo "🐳 Deteniendo contenedores Docker..."
docker-compose down 2>/dev/null || true

echo "✅ Todos los servicios han sido detenidos"
echo ""
echo "🌐 Para volver a iniciar:"
echo "   • Modo local: ./scripts/start-local-simple.sh"
echo "   • Modo Docker: ./scripts/start-docker-simple.sh"
