# Usar Node.js 18 como imagen base
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el resto del código
COPY . .

# Crear directorio para uploads
RUN mkdir -p uploads

# Exponer puerto 4000
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
