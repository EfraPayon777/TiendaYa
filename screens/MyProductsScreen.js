import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useResponsive } from '../hooks/useResponsive';

const MyProductsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { isWeb, isDesktop, isTablet } = useResponsive();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar productos del usuario
  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://192.168.3.21:4000/api/usuarios/${user.id}/productos`);
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data);
      } else {
        Alert.alert('Error', 'No se pudieron cargar tus productos');
      }
    } catch (error) {
      console.error('Error fetching my products:', error);
      Alert.alert('Error', 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const renderProductCard = ({ item }) => (
    <View 
      style={[
        styles.productCard,
        isWeb && {
          width: isDesktop ? '30%' : isTablet ? '45%' : '48%',
          margin: isWeb ? '1%' : 8,
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.productContent}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
      <View style={styles.imageContainer}>
        {item.imagen ? (
          <Image source={{ uri: item.imagen }} style={styles.productImage} />
        ) : (
          <View style={[styles.productImage, styles.placeholderImage]}>
            <Ionicons name="image-outline" size={32} color="#9CA3AF" />
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
        <Text style={styles.productCategory}>{item.categoria}</Text>
        <Text style={styles.stockText}>Stock: {item.stock}</Text>
        <Text style={styles.dateText}>
          Publicado: {new Date(item.creadoEn).toLocaleDateString()}
        </Text>
      </View>
      </TouchableOpacity>
      
      {/* Botón de editar */}
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProduct', { product: item })}
      >
        <Ionicons name="create-outline" size={20} color="#FC930A" />
        <Text style={styles.editButtonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="cube-outline" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No tienes productos</Text>
      <Text style={styles.emptySubtitle}>
        Publica tu primer producto para empezar a vender
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('PostProduct')}
      >
        <Ionicons name="add" size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Publicar Producto</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Productos</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Productos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('PostProduct')}
        >
          <Ionicons name="add" size={20} color="#FC930A" />
        </TouchableOpacity>
      </View>

      {/* Lista de productos */}
      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={isWeb ? (isDesktop ? 3 : 2) : 2}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 40,
  },
  addButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  productsList: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  placeholderImage: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 14,
    fontWeight: '600',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  stockText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#FC930A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  productContent: {
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  editButtonText: {
    color: '#FC930A',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default MyProductsScreen;
