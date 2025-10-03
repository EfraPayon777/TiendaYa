import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useResponsive } from '../hooks/useResponsive';
import StarRating from '../components/StarRating';

const ReviewsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { isWeb, isDesktop, isTablet } = useResponsive();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar reseñas del usuario
  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://192.168.3.21:4000/api/reviews/usuario/${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data);
      } else {
        Alert.alert('Error', 'No se pudieron cargar tus reseñas');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Alert.alert('Error', 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyReviews();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const renderReviewCard = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.producto_nombre}
          </Text>
          <Text style={styles.vendedorName}>
            Vendedor: {item.vendedor_nombre}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <StarRating rating={item.rating} readonly={true} size={16} />
        </View>
      </View>
      
      <View style={styles.reviewFooter}>
        <Text style={styles.dateText}>
          {new Date(item.creadoEn).toLocaleDateString()}
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteReview(item.id, item.producto_id)}
        >
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleDeleteReview = async (reviewId, productoId) => {
    Alert.alert(
      'Eliminar Reseña',
      '¿Estás seguro de que quieres eliminar esta reseña?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                `http://192.168.3.21:4000/api/reviews/${user.id}/${productoId}`,
                { method: 'DELETE' }
              );
              
              if (response.ok) {
                Alert.alert('Éxito', 'Reseña eliminada correctamente');
                fetchMyReviews(); // Recargar la lista
              } else {
                Alert.alert('Error', 'No se pudo eliminar la reseña');
              }
            } catch (error) {
              console.error('Error deleting review:', error);
              Alert.alert('Error', 'Error de conexión con el servidor');
            }
          }
        }
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="star-outline" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No tienes reseñas</Text>
      <Text style={styles.emptySubtitle}>
        Las reseñas que hagas a otros productos aparecerán aquí
      </Text>
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
          <Text style={styles.headerTitle}>Mis Reseñas</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando reseñas...</Text>
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
        <Text style={styles.headerTitle}>Mis Reseñas</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Lista de reseñas */}
      <FlatList
        data={reviews}
        renderItem={renderReviewCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.reviewsList}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  reviewsList: {
    padding: 16,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  vendedorName: {
    fontSize: 14,
    color: '#6B7280',
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  deleteButton: {
    padding: 4,
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
  },
});

export default ReviewsScreen;
