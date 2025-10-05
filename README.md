# TiendaYa - E-commerce Mobile App

Una aplicación móvil completa de e-commerce desarrollada con React Native y Expo.

## Características

- **Catálogo de Productos** - Navegación y búsqueda
- **Sistema de Usuarios** - Registro, login y perfiles
- **Favoritos** - Guardar productos favoritos
- **Reseñas** - Sistema de calificaciones con comentarios
- **Fotos de Perfil** - Subida y gestión de imágenes
- **Detección Automática** - Sin configuración manual de IPs
- **Docker Support** - Contenerización completa

## Requisitos Previos

- Node.js 18+
- MySQL 8.0+
- Docker y Docker Compose (opcional)
- Expo CLI
- Git

## Instalación

### 1. Clonar el Repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd TiendaYa
```

### 2. Instalar Dependencias
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

## Configuración de Base de Datos

### Opción A: MySQL Local
1. Crear base de datos MySQL: `tiendaya`
2. Usuario: `root`, Contraseña: `2005`
3. Importar el esquema desde `database/init.sql`

### Opción B: Docker (Recomendado)
```bash
# Iniciar con Docker
docker-compose up -d
```

## Modos de Ejecución

### Modo Local (Desarrollo)

#### Iniciar Backend
```bash
cd backend
node server.js
```

#### Iniciar Frontend
```bash
npm start
# o
npx expo start --host tunnel
```

### Modo Docker (Producción/Colaboración)

#### Iniciar Todo con Docker
```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f
```

#### Comandos Docker Útiles
```bash
# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Limpiar todo
docker-compose down -v
```

## Scripts de Automatización

### Scripts para Modo Local
```bash
# Iniciar en modo local
./scripts/start-local-simple.sh

# Detener todo
./scripts/stop-all.sh
```

### Scripts para Docker
```bash
# Iniciar con Docker
./scripts/start-docker-simple.sh

# Detener todo
./scripts/stop-all.sh
```

## Configuración Automática

**No necesitas configurar IPs manualmente!** El sistema detecta automáticamente:

- **Dispositivo Físico**: IP de tu red local
- **Emulador**: localhost automáticamente
- **Docker**: Variables de entorno automáticas
- **Producción**: URL de producción

## Funcionalidades

### Autenticación
- Registro de usuarios con foto de perfil
- Login seguro con JWT
- Gestión de perfiles
- Actualización de datos personales

### Productos
- CRUD completo de productos
- Subida de imágenes múltiples
- Categorías y filtros
- Sistema de búsqueda avanzado
- Información del vendedor

### Interacción
- Sistema de favoritos
- Reseñas y calificaciones con comentarios
- Navegación intuitiva
- Contacto directo con vendedores (WhatsApp, llamadas)

## Tecnologías

- **Frontend**: React Native, Expo
- **Backend**: Node.js, Express
- **Base de Datos**: MySQL 8.0
- **Autenticación**: JWT
- **Archivos**: Multer
- **UI**: Componentes nativos
- **Docker**: Contenerización completa

## Estructura del Proyecto

```
TiendaYa/
├── backend/                 # Servidor Node.js
│   ├── config/             # Configuración de BD
│   ├── controllers/        # Controladores
│   ├── routes/            # Rutas de API
│   └── uploads/           # Archivos subidos
├── screens/               # Pantallas de la app
├── components/            # Componentes reutilizables
├── contexts/              # Contextos de React
├── utils/                 # Utilidades (API automática)
├── database/              # Scripts de BD
├── scripts/               # Scripts de automatización
├── docker-compose.yml     # Configuración Docker
└── Dockerfile            # Imagen Docker
```

## Comandos Principales

### Desarrollo Local
```bash
# Iniciar backend
cd backend
node server.js

# Iniciar frontend
npm start

# Limpiar caché
expo start --clear
```

### Docker
```bash
# Construir imágenes
docker-compose build

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### Scripts de Automatización
```bash
# Modo local
./scripts/start-local-simple.sh

# Modo Docker
./scripts/start-docker-simple.sh

# Detener todo
./scripts/stop-all.sh
```

## Puertos y URLs

### Modo Local
- **Frontend**: http://localhost:8081
- **Backend**: http://localhost:4000
- **MySQL**: localhost:3306

### Modo Docker
- **Frontend**: http://localhost:8081
- **Backend**: http://localhost:4000
- **MySQL**: localhost:3307

## Solución de Problemas

### Error de Puerto Ocupado
```bash
# Liberar puertos
./scripts/stop-all.sh
```

### Error de Conexión a BD
```bash
# Verificar MySQL
docker-compose logs mysql

# Reiniciar backend
docker-compose restart backend
```

### Error de Expo
```bash
# Limpiar caché
expo start --clear

# Reinstalar dependencias
rm -rf node_modules
npm install
```

## Estado del Proyecto

- **100% Funcional**
- **Sin Hardcoding**
- **Detección Automática**
- **Docker Support**
- **Listo para Producción**

## Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

---

**El proyecto está listo para usar sin configuración manual!**
