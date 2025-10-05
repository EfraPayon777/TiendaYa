# 🐳 TiendaYa - Guía de Docker

Esta guía te ayudará a ejecutar TiendaYa usando Docker y Docker Compose.

## 📋 Prerrequisitos

### 1. Instalar Docker Desktop
- **Windows/Mac**: Descargar desde [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Linux**: Seguir [guía oficial de instalación](https://docs.docker.com/engine/install/)

### 2. Verificar Instalación
```bash
docker --version
docker-compose --version
```

## 🚀 Inicio Rápido

### Opción 1: Scripts Automatizados (Recomendado)
```bash
# Dar permisos de ejecución
chmod +x scripts/*.sh

# Iniciar TiendaYa
./scripts/start-docker.sh

# Verificar estado
./scripts/check-docker.sh

# Detener TiendaYa
./scripts/stop-docker.sh

# Limpiar completamente (¡CUIDADO! Borra datos)
./scripts/clean-docker.sh
```

### Opción 2: Comandos Manuales
```bash
# Construir contenedores
docker-compose build

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 🌐 Servicios Disponibles

| Servicio | Puerto | URL | Descripción |
|----------|--------|-----|-------------|
| **Frontend** | 8081 | http://localhost:8081 | Expo Development Server |
| **Backend** | 4000 | http://localhost:4000 | API REST |
| **MySQL** | 3306 | localhost:3306 | Base de datos |

## 📱 Conectar Dispositivo Móvil

1. **Instalar Expo Go** en tu dispositivo móvil
2. **Abrir** http://localhost:8081 en tu navegador
3. **Escanear** el código QR con Expo Go
4. **¡Listo!** La app se cargará en tu dispositivo

## 🔧 Comandos Útiles

### Ver Estado de Contenedores
```bash
docker-compose ps
```

### Ver Logs de un Servicio
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend

# Solo base de datos
docker-compose logs -f mysql
```

### Acceder a Contenedores
```bash
# Backend
docker-compose exec backend sh

# Base de datos
docker-compose exec mysql mysql -u tiendaya_user -p tiendaya
```

### Reiniciar Servicios
```bash
# Reiniciar todo
docker-compose restart

# Reiniciar solo backend
docker-compose restart backend
```

## 🗄️ Base de Datos

### Credenciales
- **Host**: localhost (desde tu máquina) / mysql (desde contenedores)
- **Puerto**: 3306
- **Base de datos**: tiendaya
- **Usuario**: tiendaya_user
- **Contraseña**: tiendaya_password

### Conectar con MySQL Workbench
1. Abrir MySQL Workbench
2. Crear nueva conexión:
   - **Hostname**: localhost
   - **Port**: 3306
   - **Username**: tiendaya_user
   - **Password**: tiendaya_password
   - **Default Schema**: tiendaya

## 🐛 Solución de Problemas

### Puerto ya en uso
```bash
# Ver qué está usando el puerto
lsof -i :4000
lsof -i :8081
lsof -i :3306

# Detener servicios que usen el puerto
sudo kill -9 <PID>
```

### Limpiar Docker
```bash
# Eliminar contenedores
docker-compose down

# Eliminar imágenes
docker-compose down --rmi all

# Eliminar volúmenes (¡CUIDADO! Borra la base de datos)
docker-compose down -v

# Limpiar todo Docker
docker system prune -a
```

### Reconstruir Contenedores
```bash
# Reconstruir sin caché
docker-compose build --no-cache

# Reconstruir y levantar
docker-compose up --build
```

## 📁 Estructura de Archivos Docker

```
TiendaYa/
├── docker-compose.yml          # Orquestación de servicios
├── Dockerfile                  # Frontend (Expo)
├── backend/
│   └── Dockerfile              # Backend (Node.js)
├── database/
│   └── init.sql               # Script de inicialización
├── scripts/
│   ├── start-docker.sh        # Script de inicio
│   └── stop-docker.sh         # Script de parada
└── DOCKER.md                  # Esta documentación
```

## 🔄 Flujo de Desarrollo

1. **Modificar código** en tu editor
2. **Los cambios se reflejan** automáticamente (hot reload)
3. **Para cambios en backend**: reiniciar contenedor
4. **Para cambios en frontend**: se recargan automáticamente

## 🚀 Despliegue en Producción

Para desplegar en un servidor:

1. **Configurar variables de entorno** en `.env`
2. **Modificar puertos** en `docker-compose.yml`
3. **Configurar dominio** y SSL
4. **Usar base de datos externa** (no contenedor)

## 📞 Soporte

Si tienes problemas:
1. Revisar logs: `docker-compose logs -f`
2. Verificar puertos: `docker-compose ps`
3. Reiniciar servicios: `docker-compose restart`
4. Limpiar y reconstruir: `docker-compose down && docker-compose up --build`
