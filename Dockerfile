# Usar Node.js 18 como imagen base
FROM node:18-alpine

# Instalar Expo CLI y ngrok globalmente
RUN npm install -g @expo/cli @expo/ngrok

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Copiar script de inicio
COPY start-expo.sh /app/start-expo.sh

# Hacer ejecutable el script
RUN chmod +x /app/start-expo.sh

# Exponer puerto 8081 (Expo)
EXPOSE 8081

# Comando para iniciar Expo
CMD ["sh", "/app/start-expo.sh"]
