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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { useResponsive } from '../hooks/useResponsive';
import { API_ENDPOINTS, apiRequest } from '../utils/api';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { isWeb, isDesktop, isTablet } = useResponsive();
  const [userData, setUserData] = useState({
    id: null,
    nombre: '',
    email: '',
    telefono: '',
    estado: 'active',
    creadoEn: '',
    foto_perfil: null,
  });
  const [imageKey, setImageKey] = useState(0); // Para forzar refresco de imagen
  const [stats, setStats] = useState({
    productos: 0,
    favoritos: 0,
    reseñas: 0,
  });
  const [loading, setLoading] = useState(true);

  // Obtener datos del usuario y estadísticas
  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      if (user) {
        console.log('🔍 Usuario del contexto:', user);
        console.log('🔍 Fecha de creación del usuario:', user.creadoEn);
        
        // Obtener datos completos del usuario incluyendo foto de perfil
        try {
          const userProfile = await apiRequest(API_ENDPOINTS.USUARIO_BY_ID(user.id));
          console.log('🔍 Perfil completo del usuario:', userProfile);
          setUserData(userProfile);
          
          // Actualizar también el contexto del usuario para sincronizar
          if (userProfile.foto_perfil) {
            console.log('🔄 Actualizando contexto con nueva foto:', userProfile.foto_perfil);
          }
        } catch (error) {
          console.log('⚠️ No se pudo obtener perfil completo, usando datos del contexto');
          setUserData(user);
        }
        
        await fetchUserStats();
      } else {
        // Si no hay usuario autenticado, redirigir al login
        Alert.alert(
          'Sesión requerida',
          'Debes iniciar sesión para ver tu perfil',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Obtener productos del usuario
      const productos = await apiRequest(API_ENDPOINTS.PRODUCTOS);
      
      // Obtener favoritos del usuario
      const favoritos = await apiRequest(API_ENDPOINTS.FAVORITOS_BY_USER(userData.id));
      
      // Obtener reseñas del usuario (simulado por ahora)
      const reseñas = 23; // En producción vendría de la API de ratings
      
      setStats({
        productos: productos.length,
        favoritos: favoritos.length,
        reseñas: reseñas,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Usar datos por defecto si hay error
      setStats({
        productos: 0,
        favoritos: 0,
        reseñas: 0,
      });
    }
  };

  const selectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Se necesitan permisos para acceder a la galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await updateProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Se necesitan permisos para acceder a la cámara');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await updateProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const updateProfilePhoto = async (imageUri) => {
    try {
      setLoading(true);
      
      const dataToSend = new FormData();
      dataToSend.append('nombre', userData.nombre);
      dataToSend.append('telefono', userData.telefono);
      dataToSend.append('fotoPerfil', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'perfil.jpg'
      });

      console.log('📸 Actualizando foto de perfil...');
      
      await apiRequest(API_ENDPOINTS.USUARIO_BY_ID(user.id), {
        method: 'PUT',
        body: dataToSend,
      });

      console.log('✅ Foto actualizada, recargando datos...');
      
      // Recargar los datos del usuario para obtener la URL completa
      await fetchUserData();
      
      // Forzar refresco de la imagen
      setImageKey(prev => prev + 1);
      
      Alert.alert('Éxito', 'Foto de perfil actualizada correctamente');
    } catch (error) {
      console.error('❌ Error al actualizar foto:', error);
      Alert.alert('Error', 'No se pudo actualizar la foto de perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Refrescar datos cuando se enfoca la pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🔄 Pantalla enfocada, refrescando datos...');
      fetchUserData();
    });

    return unsubscribe;
  }, [navigation]);

  const formatJoinDate = (dateString) => {
    if (!dateString) {
      return 'Miembro desde hace tiempo';
    }
    
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return 'Miembro desde hace tiempo';
    }
    
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    return `Miembro desde ${months[date.getMonth()]} ${date.getFullYear()}`;
  };


  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  const handleMenuPress = (action) => {
    switch (action) {
      case 'EditProfile':
        navigation.navigate('EditProfile');
        break;
      case 'Favorites':
        navigation.navigate('Favorites');
        break;
      case 'MyProducts':
        navigation.navigate('MyProducts');
        break;
      case 'Reviews':
        navigation.navigate('Reviews');
        break;
      case 'Settings':
        Alert.alert('Próximamente', 'Esta función estará disponible pronto');
        break;
      case 'Help':
        Alert.alert('Próximamente', 'Esta función estará disponible pronto');
        break;
      case 'Logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Editar Perfil', color: '#4F46E5', action: 'EditProfile' },
    { icon: 'heart-outline', title: 'Mis Favoritos', color: '#EC4899', action: 'Favorites' },
    { icon: 'cube-outline', title: 'Mis Productos', color: '#10B981', action: 'MyProducts' },
    { icon: 'chatbubble-outline', title: 'Mis Reseñas', color: '#F59E0B', action: 'Reviews' },
    { icon: 'settings-outline', title: 'Configuración', color: '#6B7280', action: 'Settings' },
    { icon: 'help-circle-outline', title: 'Ayuda & Soporte', color: '#EF4444', action: 'Help' },
    { icon: 'log-out-outline', title: 'Cerrar Sesión', color: '#DC2626', action: 'Logout' },
  ];

  if (loading) {
    return (
      <SafeAreaView style={[
        styles.container,
        isWeb && {
          maxWidth: isDesktop ? 800 : isTablet ? 600 : '100%',
          marginHorizontal: isWeb ? 'auto' : 0,
          paddingHorizontal: isWeb ? 20 : 0,
        }
      ]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[
      styles.container,
      isWeb && {
        maxWidth: isDesktop ? 800 : isTablet ? 600 : '100%',
        marginHorizontal: isWeb ? 'auto' : 0,
        paddingHorizontal: isWeb ? 20 : 0,
        height: '100vh', // Asegurar altura completa en web
      }
    ]}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        showsVerticalScrollIndicator={true}
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingBottom: 50 // Espacio extra al final
        }}
      >
        {/* Header del perfil */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              key={imageKey}
              source={{ 
                uri: userData.foto_perfil || 'https://freesvg.org/img/defaultprofile.png' 
              }}
              style={styles.avatar}
            />
            <TouchableOpacity 
              style={styles.editAvatarButton}
              onPress={() => {
                Alert.alert(
                  'Cambiar foto de perfil',
                  '¿Cómo quieres cambiar tu foto?',
                  [
                    { text: 'Galería', onPress: selectImage },
                    { text: 'Cámara', onPress: takePhoto },
                    { text: 'Cancelar', style: 'cancel' }
                  ]
                );
              }}
            >
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{userData.nombre}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <Text style={styles.userPhone}>{userData.telefono}</Text>
        </View>

        {/* Estadísticas */}
        <View style={[
          styles.statsContainer,
          isWeb && {
            flexDirection: isDesktop ? 'row' : 'column',
            alignItems: isDesktop ? 'center' : 'stretch',
            justifyContent: isDesktop ? 'space-around' : 'center',
            padding: isDesktop ? 30 : 20,
          }
        ]}>
          <View style={[
            styles.statItem,
            isWeb && {
              flex: isDesktop ? 1 : 0,
              marginBottom: isDesktop ? 0 : 15,
            }
          ]}>
            <Text style={styles.statNumber}>{stats.productos}</Text>
            <Text style={styles.statLabel}>Productos</Text>
          </View>
          <View style={[
            styles.statDivider,
            isWeb && {
              display: isDesktop ? 'flex' : 'none',
            }
          ]} />
          <View style={[
            styles.statItem,
            isWeb && {
              flex: isDesktop ? 1 : 0,
              marginBottom: isDesktop ? 0 : 15,
            }
          ]}>
            <Text style={styles.statNumber}>{stats.favoritos}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={[
            styles.statDivider,
            isWeb && {
              display: isDesktop ? 'flex' : 'none',
            }
          ]} />
          <View style={[
            styles.statItem,
            isWeb && {
              flex: isDesktop ? 1 : 0,
              marginBottom: isDesktop ? 0 : 15,
            }
          ]}>
            <Text style={styles.statNumber}>{stats.reseñas}</Text>
            <Text style={styles.statLabel}>Reseñas</Text>
          </View>
        </View>

        {/* Menú de opciones */}
        <View style={[
          styles.menuContainer,
          isWeb && {
            display: isDesktop ? 'grid' : 'block',
            gridTemplateColumns: isDesktop ? 'repeat(2, 1fr)' : 'none',
            gap: isDesktop ? 20 : 0,
          }
        ]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.menuItem,
                isWeb && {
                  marginBottom: isDesktop ? 0 : 10,
                  padding: isDesktop ? 20 : 16,
                }
              ]}
              onPress={() => handleMenuPress(item.action)}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Información adicional */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Información de la Cuenta</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Estado:</Text>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: userData.estado === 'active' ? '#10B981' : '#EF4444' }
            ]}>
              <Text style={styles.statusText}>
                {userData.estado === 'active' ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>ID de Usuario:</Text>
            <Text style={styles.infoValue}>{userData.id}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    minHeight: '100%', // Asegurar altura mínima
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
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#F3F4F6',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FC930A',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FC930A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#FEC12D',
  },
  menuContainer: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  infoContainer: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ProfileScreen;
