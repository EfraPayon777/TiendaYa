import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);


  // Verificar si el producto está en favoritos
  const checkFavorite = async () => {
    // Solo verificar favoritos si el usuario está autenticado
    if (!user || !user.id) {
      console.log('Usuario no autenticado, saltando verificación de favoritos');
      return;
    }
    
    try {
      const response = await fetch(`http://192.168.3.21:4000/api/favoritos/${user.id}`);
      const favorites = await response.json();
      if (response.ok && favorites.some(fav => fav.id === product.id)) {
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  useEffect(() => {
    checkFavorite();
  }, []);

  const toggleFavorite = async () => {
    // Verificar si el usuario está autenticado
    if (!user || !user.id) {
      Alert.alert(
        'Iniciar Sesión',
        'Debes iniciar sesión para agregar productos a favoritos',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar Sesión', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    try {
      setLoading(true);
      
      if (isFavorite) {
        // Eliminar de favoritos
        const response = await fetch(`http://192.168.3.21:4000/api/favoritos/${user.id}/${product.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setIsFavorite(false);
          Alert.alert('Éxito', 'Producto eliminado de favoritos');
        } else {
          Alert.alert('Error', 'No se pudo eliminar de favoritos');
        }
      } else {
        // Agregar a favoritos
        const response = await fetch(`http://192.168.3.21:4000/api/favoritos/${user.id}/${product.id}`, {
          method: 'POST',
        });
        
        if (response.ok) {
          setIsFavorite(true);
          Alert.alert('Éxito', 'Producto agregado a favoritos');
        } else {
          Alert.alert('Error', 'No se pudo agregar a favoritos');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = product.telefono || '50370000000'; // Número del vendedor desde la base de datos
    const message = `Hola! Me interesa el producto "${product.nombre}" que vi en TiendaYa. ¿Está disponible?`;
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'WhatsApp no está instalado en tu dispositivo');
        }
      })
      .catch((error) => {
        console.error('Error opening WhatsApp:', error);
        Alert.alert('Error', 'No se pudo abrir WhatsApp');
      });
  };

  const handleLeaveReview = () => {
    // Verificar si el usuario está autenticado
    if (!user || !user.id) {
      Alert.alert(
        'Iniciar Sesión',
        'Debes iniciar sesión para dejar una reseña',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar Sesión', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    // Verificar si el usuario es el vendedor del producto
    if (user.id === product.vendedorId) {
      Alert.alert('No permitido', 'No puedes calificar tu propio producto');
      return;
    }
    
    navigation.navigate('AddReview', { product });
  };

  const handleCallVendor = () => {
    const phoneNumber = product.telefono || '50370000000'; // Número del vendedor desde la base de datos
    const url = `tel:${phoneNumber}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'No se puede realizar la llamada');
        }
      })
      .catch((error) => {
        console.error('Error making call:', error);
        Alert.alert('Error', 'No se pudo realizar la llamada');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header con botones */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={() => Alert.alert('Compartir', 'Función de compartir en desarrollo')}
          >
            <Ionicons name="share-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={toggleFavorite}
            disabled={loading}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#FF6B6B" : "#1F2937"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagen del producto */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ 
              uri: product.imagen || 'https://via.placeholder.com/400x300?text=Sin+Imagen' 
            }} 
            style={styles.productImage} 
          />
        </View>

        {/* Información del producto */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.nombre}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.precio}</Text>
            <View style={styles.stockContainer}>
              <Ionicons name="cube-outline" size={16} color="#10B981" />
              <Text style={styles.stockText}>Stock: {product.stock}</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons 
                  key={star}
                  name="star" 
                  size={16} 
                  color="#FFD700" 
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {product.promedio_rating && (typeof product.promedio_rating === 'number' || typeof product.promedio_rating === 'string') && parseFloat(product.promedio_rating) > 0 
                ? `(${parseFloat(product.promedio_rating).toFixed(1)}) - ${product.total_reseñas || 0} reseñas`
                : 'Sin reseñas'
              }
            </Text>
          </View>

          <Text style={styles.descriptionTitle}>Descripción</Text>
          <Text style={styles.description}>{product.descripcion}</Text>

          {/* Información del vendedor */}
          <View style={styles.vendorContainer}>
            <Text style={styles.vendorTitle}>Vendedor</Text>
            <View style={styles.vendorInfo}>
              <View style={styles.vendorAvatar}>
                <Ionicons name="person" size={24} color="#FC930A" />
              </View>
              <View style={styles.vendorDetails}>
                <Text style={styles.vendorName}>{product.vendedor}</Text>
                <Text style={styles.vendorRating}>
                  {product.promedio_rating && (typeof product.promedio_rating === 'number' || typeof product.promedio_rating === 'string') && parseFloat(product.promedio_rating) > 0
                    ? `⭐ ${parseFloat(product.promedio_rating).toFixed(1)} (${product.total_reseñas || 0} reseñas)` 
                    : '⭐ Sin calificar'
                  }
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.callButton}
          onPress={handleCallVendor}
        >
          <Ionicons name="call" size={20} color="#FFFFFF" />
          <Text style={styles.callButtonText}>Llamar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.whatsappButton}
          onPress={handleWhatsAppContact}
        >
          <LinearGradient
            colors={['#25D366', '#128C7E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.whatsappGradient}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
            <Text style={styles.whatsappButtonText}>WhatsApp</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.reviewButton}
          onPress={handleLeaveReview}
        >
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.reviewGradient}
          >
            <Ionicons name="star" size={20} color="#FFFFFF" />
            <Text style={styles.reviewButtonText}>Dejar Reseña</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    padding: 8,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#FFFFFF',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FC930A',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  vendorContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  vendorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  vendorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vendorDetails: {
    flex: 1,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  vendorRating: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B7280',
    paddingVertical: 16,
    borderRadius: 12,
    marginRight: 8,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  whatsappButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 8,
  },
  whatsappGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  whatsappButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  reviewButton: {
    flex: 1,
    marginLeft: 8,
  },
  reviewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reviewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProductDetailScreen;
