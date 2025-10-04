# 🛒 TiendaYa - E-commerce Mobile App

Una aplicación móvil completa de e-commerce desarrollada con React Native y Expo.

## ✨ Características

- 🛍️ **Catálogo de Productos** - Navegación y búsqueda
- 👤 **Sistema de Usuarios** - Registro, login y perfiles
- ❤️ **Favoritos** - Guardar productos favoritos
- ⭐ **Reseñas** - Sistema de calificaciones
- 📸 **Fotos de Perfil** - Subida y gestión de imágenes
- 🔄 **Detección Automática** - Sin configuración manual

## 🚀 Inicio Rápido

### **1. Clonar el Repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
cd TiendaYa
```

### **2. Instalar Dependencias**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### **3. Configurar Base de Datos**
1. Crear base de datos MySQL: `tiendaya`
2. Importar el esquema de la base de datos
3. Configurar credenciales en `backend/config/db.js`

### **4. Iniciar Servicios**
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
npm start
```

## 🔧 Configuración Automática

**¡No necesitas configurar IPs manualmente!** El sistema detecta automáticamente:

- 📱 **Dispositivo Físico**: IP de tu red local
- 💻 **Emulador**: localhost automáticamente
- 🌐 **Producción**: URL de producción

## 📱 Funcionalidades

### **Autenticación**
- Registro de usuarios con foto de perfil
- Login seguro con JWT
- Gestión de perfiles

### **Productos**
- CRUD completo de productos
- Subida de imágenes
- Categorías y filtros
- Sistema de búsqueda

### **Interacción**
- Sistema de favoritos
- Reseñas y calificaciones
- Navegación intuitiva

## 🛠️ Tecnologías

- **Frontend**: React Native, Expo
- **Backend**: Node.js, Express
- **Base de Datos**: MySQL
- **Autenticación**: JWT
- **Archivos**: Multer
- **UI**: Componentes nativos

## 📁 Estructura

```
TiendaYa/
├── backend/           # Servidor Node.js
├── screens/          # Pantallas de la app
├── components/       # Componentes reutilizables
├── contexts/         # Contextos de React
├── utils/           # Utilidades (API automática)
└── assets/          # Recursos estáticos
```

## 🚀 Comandos

```bash
# Desarrollo
npm start                    # Iniciar Expo
cd backend && npm start     # Iniciar backend

# Limpiar caché
expo start --clear

# Producción
npm run build
```

## 📖 Documentación

- [Guía para Desarrolladores](SETUP-DESARROLLADORES.md)
- [Migración de IPs](README-MIGRACION.md)

## 🎯 Estado del Proyecto

- ✅ **100% Funcional**
- ✅ **Sin Hardcoding**
- ✅ **Detección Automática**
- ✅ **Listo para Producción**

---

**¡El proyecto está listo para usar sin configuración manual!** 🎉
