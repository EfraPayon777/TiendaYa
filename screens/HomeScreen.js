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
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useResponsive } from '../hooks/useResponsive';

const HomeScreen = ({ navigation }) => {
  const { isAuthenticated, user } = useAuth();
  const { isWeb, isMobile, isTablet, isDesktop, screenWidth } = useResponsive();
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Obtener productos desde la API
  const fetchProducts = async () => {
    try {
      console.log('🔍 Iniciando carga de productos...');
      setLoading(true);
      const response = await fetch('http://192.168.3.21:4000/api/productos');
      console.log('🔍 Respuesta del servidor:', response.status);
      const data = await response.json();
      console.log('🔍 Datos recibidos:', data);
      
      if (response.ok) {
        console.log('✅ Productos cargados exitosamente:', data.length, 'productos');
        setProducts(data);
      } else {
        console.log('❌ Error en la respuesta del servidor');
        Alert.alert('Error', 'No se pudieron cargar los productos');
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      Alert.alert('Error', 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Obtener categorías
  const fetchCategorias = async () => {
    try {
      const response = await fetch('http://192.168.3.21:4000/api/categorias');
      const data = await response.json();
      
      if (response.ok) {
        setCategorias(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategorias();
  }, []);

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleCategoryFilter = (categoriaId) => {
    setSelectedCategory(selectedCategory === categoriaId ? null : categoriaId);
  };

  const handleNavigateToFavorites = () => {
    if (!isAuthenticated()) {
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
    navigation.navigate('Favorites');
  };

  const handleNavigateToPostProduct = () => {
    if (!isAuthenticated()) {
      Alert.alert(
        'Iniciar Sesión',
        'Debes iniciar sesión para publicar productos',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar Sesión', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    navigation.navigate('PostProduct');
  };

  const handleNavigateToProfile = () => {
    if (!isAuthenticated()) {
      Alert.alert(
        'Iniciar Sesión',
        'Debes iniciar sesión para ver tu perfil',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar Sesión', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    navigation.navigate('Profile');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
                         product.descripcion.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoria_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  console.log('🔍 Estado actual:');
  console.log('  - Productos totales:', products.length);
  console.log('  - Productos filtrados:', filteredProducts.length);
  console.log('  - Loading:', loading);

  const renderProductCard = ({ item }) => {
    console.log('🔍 Renderizando producto:', item);
    console.log('🔍 Imagen del producto:', item.imagen);
    console.log('🔍 Promedio rating:', item.promedio_rating, 'Tipo:', typeof item.promedio_rating);
    console.log('🔍 Total reseñas:', item.total_reseñas, 'Tipo:', typeof item.total_reseñas);
    return (
    <TouchableOpacity 
      style={[
        styles.productCard,
        isWeb && {
          width: isDesktop ? '22%' : isTablet ? '30%' : '45%',
          margin: isWeb ? '1%' : 8,
        }
      ]}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.imageContainer}>
        {item.imagen ? (
          <Image 
            source={{ uri: item.imagen }} 
            style={styles.productImage}
            onError={(error) => console.log('❌ Error cargando imagen:', error.nativeEvent.error)}
            onLoad={() => console.log('✅ Imagen cargada correctamente')}
          />
        ) : (
          <View style={[styles.productImage, { backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons name="image-outline" size={32} color="#9CA3AF" />
            <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 4 }}>Sin imagen</Text>
          </View>
        )}
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>${item.precio}</Text>
        </View>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.nombre}
        </Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.descripcion}
        </Text>
        
        <View style={styles.productFooter}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>
              {item.promedio_rating && typeof item.promedio_rating === 'number' && item.promedio_rating > 0 ? `(${item.promedio_rating.toFixed(1)})` : '(Sin calificar)'}
            </Text>
          </View>
          <Text style={styles.stockText}>
            Stock: {item.stock}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  const renderCategoryChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.categoryChipSelected
      ]}
      onPress={() => handleCategoryFilter(item.id)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.categoryTextSelected
      ]}>
        {item.nombre}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>TiendaYa</Text>
        <Text style={styles.headerSubtitle}>Encuentra lo que necesitas</Text>
        
        {/* Botones de navegación */}
        <View style={styles.navButtons}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => {
              console.log('Botón Favoritos presionado');
              if (!isAuthenticated()) {
                console.log('Usuario no autenticado, redirigiendo a login');
                navigation.navigate('Login');
              } else {
                console.log('Usuario autenticado, navegando a favoritos');
                navigation.navigate('Favorites');
              }
            }}
          >
            <Ionicons name="heart" size={20} color="#FC930A" />
            <Text style={styles.navButtonText}>Favoritos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => {
              console.log('Botón Vender presionado');
              if (!isAuthenticated()) {
                console.log('Usuario no autenticado, redirigiendo a login');
                navigation.navigate('Login');
              } else {
                console.log('Usuario autenticado, navegando a publicar producto');
                navigation.navigate('PostProduct');
              }
            }}
          >
            <Ionicons name="add-circle" size={20} color="#FC930A" />
            <Text style={styles.navButtonText}>Vender</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => {
              console.log('Botón Perfil presionado');
              if (!isAuthenticated()) {
                console.log('Usuario no autenticado, redirigiendo a login');
                navigation.navigate('Login');
              } else {
                console.log('Usuario autenticado, navegando a perfil');
                navigation.navigate('Profile');
              }
            }}
          >
            <Ionicons name="person" size={20} color="#FC930A" />
            <Text style={styles.navButtonText}>Perfil</Text>
          </TouchableOpacity>
        </View>
        
        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Filtros de categorías */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>Categorías</Text>
        <FlatList
          data={categorias}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Lista de productos */}
      <View style={styles.productsContainer}>
        <View style={styles.productsHeader}>
          <Text style={styles.productsTitle}>
            {filteredProducts.length} productos encontrados
          </Text>
          {selectedCategory && (
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.clearFilterText}>Limpiar filtro</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredProducts}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FC930A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  navButton: {
    alignItems: 'center',
    padding: 8,
  },
  navButtonText: {
    fontSize: 12,
    color: '#FC930A',
    marginTop: 4,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  categoriesContainer: {
    padding: 16,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  categoriesList: {
    paddingRight: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipSelected: {
    backgroundColor: '#FC930A',
    borderColor: '#FEC12D',
  },
  categoryText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  productsContainer: {
    flex: 1,
    padding: 16,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  productsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  clearFilterText: {
    fontSize: 14,
    color: '#FC930A',
    fontWeight: '500',
  },
  productsGrid: {
    paddingBottom: 20,
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
  priceTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FC930A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    height: 40,
  },
  productDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    height: 32,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666666',
  },
  stockText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
});

export default HomeScreen;
