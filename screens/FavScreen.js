import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useResponsive } from '../hooks/useResponsive';

const FavScreen = ({ navigation }) => {
  const { user, isAuthenticated } = useAuth();
  const { isWeb, isDesktop, isTablet } = useResponsive();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener productos favoritos desde la API
  const fetchFavorites = async () => {
    console.log('🔍 Iniciando carga de favoritos...');
    console.log('🔍 Usuario autenticado:', isAuthenticated());
    console.log('🔍 Usuario ID:', user?.id);
    
    if (!isAuthenticated()) {
      console.log('❌ Usuario no autenticado, mostrando alerta');
      Alert.alert(
        'Iniciar Sesión',
        'Debes iniciar sesión para ver tus favoritos',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar Sesión', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Haciendo petición a:', `http://192.168.3.21:4000/api/favoritos/${user.id}`);
      const response = await fetch(`http://192.168.3.21:4000/api/favoritos/${user.id}`);
      console.log('🔍 Respuesta del servidor:', response.status);
      const data = await response.json();
      console.log('🔍 Datos recibidos:', data);
      
      if (response.ok) {
        console.log('✅ Favoritos cargados exitosamente:', data.length, 'productos');
        setProducts(data);
      } else {
        console.log('❌ Error en la respuesta del servidor');
        Alert.alert('Error', 'No se pudieron cargar los favoritos');
      }
    } catch (error) {
      console.error('❌ Error fetching favorites:', error);
      Alert.alert('Error', 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar de favoritos
  const removeFromFavorites = async (productId) => {
    try {
      const response = await fetch(`http://192.168.3.21:4000/api/favoritos/${user.id}/${productId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Actualizar la lista local
        setProducts(prevProducts => 
          prevProducts.filter(product => product.id !== productId)
        );
        Alert.alert('Éxito', 'Producto eliminado de favoritos');
      } else {
        Alert.alert('Error', 'No se pudo eliminar de favoritos');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      Alert.alert('Error', 'Error de conexión');
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const renderProductCard = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.productCard,
        isWeb && {
          width: isDesktop ? '22%' : isTablet ? '30%' : '45%',
          margin: isWeb ? '1%' : 8,
        }
      ]}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      {/* Imagen del producto */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ 
            uri: item.imagen || 'https://via.placeholder.com/300x200?text=Sin+Imagen' 
          }} 
          style={styles.productImage} 
        />

        {/* Botón de favorito */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation(); // Evitar que se active el onPress del card
            removeFromFavorites(item.id);
          }}>
          <Ionicons
            name="heart"
            size={24}
            color="#FF6B6B"
          />
        </TouchableOpacity>
      </View>

      {/* Información del producto */}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.nombre}
        </Text>
        <Text style={styles.productSeller} numberOfLines={1}>
          Por - {item.vendedor || 'Vendedor'}
        </Text>

        {/* Rating con estrellas */}
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>
            {item.promedio_rating && (typeof item.promedio_rating === 'number' || typeof item.promedio_rating === 'string') && parseFloat(item.promedio_rating) > 0 ? 
              `(${parseFloat(item.promedio_rating).toFixed(1)})` : 
              '(Sin calificar)'
            }
          </Text>
        </View>

        {/* Precio */}
        <Text style={styles.productPrice}>${item.precio}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={64} color="#CCCCCC" />
      <Text style={styles.emptyTitle}>No tienes favoritos</Text>
      <Text style={styles.emptySubtitle}>
        Los productos que marques como favoritos aparecerán aquí
      </Text>
    </View>
  );

  console.log('🔍 Estado actual de favoritos:');
  console.log('  - Productos totales:', products.length);
  console.log('  - Loading:', loading);
  console.log('  - Usuario ID:', user?.id);

  return (
    <SafeAreaView style={[
      styles.container,
      isWeb && {
        maxWidth: isDesktop ? 1200 : isTablet ? 800 : '100%',
        marginHorizontal: isWeb ? 'auto' : 0,
        paddingHorizontal: isWeb ? 20 : 0,
        height: '100vh', // Asegurar altura completa en web
      }
    ]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Favoritos</Text>
        <Text style={styles.headerSubtitle}>
          {products.length} productos guardados
        </Text>
      </View>

      {/* Lista de productos */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando favoritos...</Text>
        </View>
      ) : products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={isWeb ? (isDesktop ? 4 : isTablet ? 3 : 2) : 2}
          contentContainerStyle={[
            styles.productsGrid,
            isWeb && {
              justifyContent: 'flex-start',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }
          ]}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={!isWeb ? styles.columnWrapper : null}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  productsGrid: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 150,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    height: 40,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  productSeller: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default FavScreen;
