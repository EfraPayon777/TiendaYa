// Cliente API inteligente - Detección automática de IP
import Constants from 'expo-constants';

// Función para obtener automáticamente la URL del backend
const getBackendURL = () => {
  if (__DEV__) {
    // Detectar si estamos en dispositivo físico o emulador
    const debuggerHost = Constants.expoGoConfig?.debuggerHost;
    console.log('🔍 Debug - debuggerHost detectado:', debuggerHost);
    
    if (debuggerHost) {
      // Dispositivo físico - usar IP de la red
      const ip = debuggerHost.split(':')[0];
      const url = `http://${ip}:4000`;
      console.log('🔍 Debug - Dispositivo físico detectado, IP:', ip);
      console.log('🔍 Debug - URL del backend:', url);
      return url;
    } else {
      // Emulador - usar localhost
      const url = 'http://localhost:4000';
      console.log('🔍 Debug - Emulador detectado, usando localhost');
      console.log('🔍 Debug - URL del backend:', url);
      return url;
    }
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
  REVIEWS_BY_PRODUCT: (productId) => `${API_BASE_URL}/api/reviews/producto/${productId}`,
  REVIEW_BY_USER_PRODUCT: (userId, productId) => `${API_BASE_URL}/api/reviews/${userId}/${productId}`,
};

// Función helper para hacer peticiones
export const apiRequest = async (url, options = {}) => {
  try {
    console.log('🌐 Petición a:', url);
    
    // Configurar headers por defecto
    const defaultHeaders = {};
    
    // Solo agregar Content-Type si no es FormData
    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(url, {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
