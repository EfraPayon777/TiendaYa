#!/bin/bash

# Script para detener TiendaYa en modo local
echo "🛑 Deteniendo TiendaYa en modo LOCAL..."

# Detener procesos de Node.js
echo "🔍 Buscando procesos de TiendaYa..."
pkill -f "node server.js"
pkill -f "expo start"

# Detener procesos en puertos específicos
echo "🔍 Liberando puertos..."
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
lsof -ti:8081 | xargs kill -9 2>/dev/null || true

echo "✅ Servicios detenidos"
echo ""
echo "🌐 Para volver a iniciar:"
echo "   • Modo local: ./scripts/start-local.sh"
echo "   • Modo Docker: ./scripts/start-docker.sh"
