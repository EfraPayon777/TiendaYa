import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useResponsive } from '../hooks/useResponsive';
import StarRating from '../components/StarRating';
import { API_ENDPOINTS, apiRequest } from '../utils/api';

const AddReviewScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { user } = useAuth();
  const { isWeb, isDesktop, isTablet } = useResponsive();
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Por favor selecciona una calificación');
      return;
    }

    setLoading(true);
    try {
      await apiRequest(API_ENDPOINTS.REVIEWS, {
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          productoId: product.id,
          rating: rating,
        }),
      });

      Alert.alert('Éxito', 'Reseña enviada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.headerTitle}>Dejar Reseña</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Producto */}
        <View style={styles.productCard}>
          <View style={styles.productImageContainer}>
            {product.imagen ? (
              <Image source={{ uri: product.imagen }} style={styles.productImage} />
            ) : (
              <View style={[styles.productImage, styles.placeholderImage]}>
                <Ionicons name="image-outline" size={32} color="#9CA3AF" />
              </View>
            )}
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.nombre}</Text>
            <Text style={styles.productDescription} numberOfLines={2}>
              {product.descripcion}
            </Text>
            <Text style={styles.productPrice}>${product.precio}</Text>
            <Text style={styles.vendedorName}>Vendedor: {product.vendedor}</Text>
          </View>
        </View>

        {/* Calificación */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>¿Cómo calificarías este producto?</Text>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size={32}
            color="#FFD700"
          />
          {rating > 0 && (
            <Text style={styles.ratingText}>
              {rating === 1 ? 'Muy malo' : 
               rating === 2 ? 'Malo' : 
               rating === 3 ? 'Regular' : 
               rating === 4 ? 'Bueno' : 'Excelente'}
            </Text>
          )}
        </View>

        {/* Botón de enviar */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmitReview}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Enviando...' : 'Enviar Reseña'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 20,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
  },
  productImageContainer: {
    marginRight: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  placeholderImage: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FC930A',
    marginBottom: 4,
  },
  vendedorName: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  ratingSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#FC930A',
    fontWeight: '600',
    marginTop: 12,
  },
  submitButton: {
    backgroundColor: '#FC930A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddReviewScreen;
