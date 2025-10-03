import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { useResponsive } from '../hooks/useResponsive';

const PostProductScreen = ({ navigation }) => {
  const { user, token, isAuthenticated } = useAuth();
  const { isWeb, isDesktop, isTablet } = useResponsive();
  const [formData, setFormData] = useState({
    categoria_id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: null,
  });

  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Obtener categorías desde la API
  const fetchCategorias = async () => {
    try {
      const response = await fetch('http://192.168.3.21:4000/api/categorias');
      const data = await response.json();
      
      if (response.ok) {
        setCategorias(data);
      } else {
        Alert.alert('Error', 'No se pudieron cargar las categorías');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('Error', 'Error de conexión con el servidor');
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.categoria_id) newErrors.categoria_id = 'Selecciona una categoría';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (!formData.precio) newErrors.precio = 'El precio es requerido';
    if (!formData.stock) newErrors.stock = 'El stock es requerido';
    if (!formData.imagen) newErrors.imagen = 'Agrega una foto del producto';

    // Validar que el precio sea un número válido
    if (formData.precio && isNaN(parseFloat(formData.precio))) {
      newErrors.precio = 'El precio debe ser un número válido';
    }

    // Validar que el stock sea un número entero
    if (formData.stock && (!Number.isInteger(parseInt(formData.stock)) || parseInt(formData.stock) < 0)) {
      newErrors.stock = 'El stock debe ser un número entero mayor o igual a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('Botón de publicar producto presionado');
    console.log('Datos del formulario:', formData);
    console.log('Usuario autenticado:', user);
    console.log('Token:', token);
    
    if (!isAuthenticated()) {
      console.log('Usuario no autenticado');
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

    if (!validateForm()) {
      console.log('Validación falló');
      return;
    }

    console.log('Validación exitosa, enviando datos...');
    setLoading(true);
    try {
      // Crear objeto JSON para enviar datos (sin imagen)
      const dataToSend = {
        categoria_id: formData.categoria_id,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: formData.precio,
        stock: formData.stock,
        vendedorId: user.id
      };
      
      console.log('VendedorId a enviar:', user.id);
      console.log('Datos a enviar:', dataToSend);

      console.log('Enviando datos al servidor...');
      const response = await fetch('http://192.168.3.21:4000/api/productos', {
        method: 'POST',
        body: JSON.stringify(dataToSend),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Respuesta del servidor:', response.status);
      const result = await response.json();
      console.log('Resultado:', result);

      if (response.ok) {
        console.log('Producto publicado exitosamente');
        console.log('Reseteando formulario...');
        resetForm();
        console.log('Navegando a Home...');
        navigation.navigate('Home');
        console.log('Navegación completada');
        
        // Mostrar mensaje de éxito
        Alert.alert('¡Éxito!', 'Producto publicado correctamente');
      } else {
        console.log('Error al publicar producto:', result.message);
        Alert.alert('Error', result.message || 'No se pudo publicar el producto');
      }
    } catch (error) {
      console.error('Error posting product:', error);
      Alert.alert('Error', 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      categoria_id: '',
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      imagen: null,
    });
    setErrors({});
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para seleccionar una imagen.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setFormData({ ...formData, imagen: result.assets[0].uri });
      setErrors({ ...errors, imagen: '' });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu cámara para tomar una foto.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setFormData({ ...formData, imagen: result.assets[0].uri });
      setErrors({ ...errors, imagen: '' });
    }
  };

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          showsVerticalScrollIndicator={true}
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            flexGrow: 1,
            paddingBottom: 50 // Espacio extra al final
          }}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Publicar Producto</Text>
            <Text style={styles.headerSubtitle}>
              Completa la información de tu producto
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Categoría */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoría *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
              >
                {categorias.map((categoria) => (
                  <TouchableOpacity
                    key={categoria.id}
                    style={[
                      styles.categoryChip,
                      formData.categoria_id === categoria.id.toString() && styles.categoryChipSelected,
                    ]}
                    onPress={() => {
                      setFormData({ ...formData, categoria_id: categoria.id.toString() });
                      setErrors({ ...errors, categoria_id: '' });
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        formData.categoria_id === categoria.id.toString() && styles.categoryTextSelected,
                      ]}
                    >
                      {categoria.nombre}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {errors.categoria_id && <Text style={styles.errorText}>{errors.categoria_id}</Text>}
            </View>

            {/* Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del Producto *</Text>
              <TextInput
                style={[styles.textInput, errors.nombre && styles.inputError]}
                placeholder="Ej: iPhone 14 Pro Max"
                value={formData.nombre}
                onChangeText={(text) => {
                  setFormData({ ...formData, nombre: text });
                  setErrors({ ...errors, nombre: '' });
                }}
              />
              {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
            </View>

            {/* Descripción */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción *</Text>
              <TextInput
                style={[styles.textArea, errors.descripcion && styles.inputError]}
                placeholder="Describe tu producto..."
                value={formData.descripcion}
                onChangeText={(text) => {
                  setFormData({ ...formData, descripcion: text });
                  setErrors({ ...errors, descripcion: '' });
                }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              {errors.descripcion && <Text style={styles.errorText}>{errors.descripcion}</Text>}
            </View>

            {/* Precio y Stock */}
            <View style={styles.rowContainer}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Precio *</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={[styles.priceInput, errors.precio && styles.inputError]}
                    placeholder="0.00"
                    value={formData.precio}
                    onChangeText={(text) => {
                      setFormData({ ...formData, precio: text });
                      setErrors({ ...errors, precio: '' });
                    }}
                    keyboardType="decimal-pad"
                  />
                </View>
                {errors.precio && <Text style={styles.errorText}>{errors.precio}</Text>}
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Stock *</Text>
                <TextInput
                  style={[styles.textInput, errors.stock && styles.inputError]}
                  placeholder="0"
                  value={formData.stock}
                  onChangeText={(text) => {
                    setFormData({ ...formData, stock: text });
                    setErrors({ ...errors, stock: '' });
                  }}
                  keyboardType="numeric"
                />
                {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
              </View>
            </View>

            {/* Foto */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Foto del Artículo *</Text>

              {formData.imagen ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: formData.imagen }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setFormData({ ...formData, imagen: null })}
                  >
                    <Ionicons name="close" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.imageButtonsContainer}>
                  <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                    <Ionicons name="image-outline" size={24} color="#FC930A" />
                    <Text style={styles.imageButtonText}>Galería</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                    <Ionicons name="camera-outline" size={24} color="#FC930A" />
                    <Text style={styles.imageButtonText}>Cámara</Text>
                  </TouchableOpacity>
                </View>
              )}
              {errors.imagen && <Text style={styles.errorText}>{errors.imagen}</Text>}
            </View>

            {/* Botones con gradiente */}
            <View style={styles.actionsContainer}>
              {/* Cancelar */}
              <TouchableOpacity style={{ flex: 1, marginRight: 8 }} onPress={resetForm}>
                <LinearGradient
                  colors={['#E5E7EB', '#D1D5DB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Publicar */}
              <TouchableOpacity 
                style={{ flex: 2, marginLeft: 8 }} 
                onPress={handleSubmit}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#E24B13', '#FFCC00']} 
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.gradientButton, loading && styles.disabledButton]}
                >
                  <Text style={styles.submitButtonText}>
                    {loading ? 'Publicando...' : 'Publicar Producto'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
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
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 100,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  imageButtonText: {
    marginTop: 8,
    color: '#FC930A',
    fontWeight: '500',
  },
  imagePreviewContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  gradientButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default PostProductScreen;
