#!/bin/bash

# Script para iniciar Expo con configuración correcta
echo "🚀 Iniciando Expo Development Server..."

# Cambiar al directorio de la aplicación
cd /app

# Iniciar Expo con configuración para mostrar DevTools
npx expo start --host tunnel --dev-client
