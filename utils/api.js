// Cliente API inteligente - Detección automática de IP
import Constants from 'expo-constants';

// Función para obtener automáticamente la URL del backend
const getBackendURL = () => {
  if (__DEV__) {
    // En desarrollo, Expo detecta automáticamente la IP
    const debuggerHost = Constants.expoGoConfig?.debuggerHost;
    
    if (debuggerHost) {
      // Extraer la IP del debugger host (formato: "192.168.1.100:8081")
      const ip = debuggerHost.split(':')[0];
      return `http://${ip}:4000`;
    }
    
    // Fallback a localhost si no se detecta
    return 'http://localhost:4000';
  }
  
  // En producción
  return 'https://tu-api-produccion.com';
};

// URL base automática
export const API_BASE_URL = getBackendURL();

// Endpoints predefinidos
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  
  // Productos
  PRODUCTOS: `${API_BASE_URL}/api/productos`,
  PRODUCTO_BY_ID: (id) => `${API_BASE_URL}/api/productos/${id}`,
  
  // Categorías
  CATEGORIAS: `${API_BASE_URL}/api/categorias`,
  
  // Favoritos
  FAVORITOS_BY_USER: (userId) => `${API_BASE_URL}/api/favoritos/${userId}`,
  ADD_FAVORITO: (userId, productId) => `${API_BASE_URL}/api/favoritos/${userId}/${productId}`,
  REMOVE_FAVORITO: (userId, productId) => `${API_BASE_URL}/api/favoritos/${userId}/${productId}`,
  
  // Usuarios
  USUARIO_BY_ID: (userId) => `${API_BASE_URL}/api/usuarios/${userId}`,
  USUARIO_PRODUCTOS: (userId) => `${API_BASE_URL}/api/usuarios/${userId}/productos`,
  
  // Reviews
  REVIEWS: `${API_BASE_URL}/api/reviews`,
  REVIEWS_BY_USER: (userId) => `${API_BASE_URL}/api/reviews/usuario/${userId}`,
  REVIEW_BY_USER_PRODUCT: (userId, productId) => `${API_BASE_URL}/api/reviews/${userId}/${productId}`,
};

// Función helper para hacer peticiones
export const apiRequest = async (url, options = {}) => {
  try {
    console.log('🌐 Petición a:', url);
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error en petición:', error);
    throw error;
  }
};

// Log de configuración
console.log('🔧 API Base URL configurada:', API_BASE_URL);

export default API_BASE_URL;
