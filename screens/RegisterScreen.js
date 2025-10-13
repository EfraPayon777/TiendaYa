import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { useResponsive } from '../hooks/useResponsive';
import { API_ENDPOINTS, apiRequest } from '../utils/api';

const RegisterScreen = ({ navigation }) => {
  const { login } = useAuth();
  const { isWeb, isDesktop, isTablet } = useResponsive();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  });
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo no es válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        setFotoPerfil(result.assets[0].uri);
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
        setFotoPerfil(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const handleRegister = async () => {
    console.log('Botón de registro presionado');
    console.log('Datos del formulario:', formData);
    
    if (!validateForm()) {
      console.log('Validación falló');
      return;
    }

    console.log('Validación exitosa, enviando datos...');
    setLoading(true);
    try {
      // Crear FormData para enviar datos y foto
      const dataToSend = new FormData();
      dataToSend.append('nombre', formData.nombre);
      dataToSend.append('email', formData.email);
      dataToSend.append('telefono', formData.telefono);
      dataToSend.append('password', formData.password);

      if (fotoPerfil) {
        dataToSend.append('fotoPerfil', {
          uri: fotoPerfil,
          type: 'image/jpeg',
          name: 'perfil.jpg'
        });
      }

      const result = await apiRequest(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        body: dataToSend,
      });
      console.log('Respuesta del servidor:', result);

      console.log('Registro exitoso, haciendo auto-login...');
      // Auto-login después del registro
      await login(result.data.user, result.data.token);
      console.log('Auto-login completado, navegando a Home');
      Alert.alert(
        '¡Registro exitoso!',
        'Tu cuenta ha sido creada correctamente',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Error', error.message || 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={[
      styles.container,
      isWeb && {
        maxWidth: isDesktop ? 600 : isTablet ? 500 : '100%',
        marginHorizontal: isWeb ? 'auto' : 0,
        paddingHorizontal: isWeb ? 20 : 0,
        height: '100vh', 
      }
    ]}>
      <StatusBar barStyle="dark-content" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[
            styles.content,
            isWeb && {
              paddingHorizontal: 40,
              paddingVertical: 40,
            }
          ]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Crear Cuenta</Text>
              <Text style={styles.subtitle}>Únete a TiendaYa y comienza a vender</Text>
            </View>

            {/* Formulario */}
            <View style={styles.form}>
              {/* Nombre */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre completo</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Tu nombre completo"
                    value={formData.nombre}
                    onChangeText={(text) => {
                      setFormData({ ...formData, nombre: text });
                      setErrors({ ...errors, nombre: '' });
                    }}
                    autoCapitalize="words"
                  />
                </View>
                {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
              </View>

              {/* Foto de Perfil */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Foto de perfil (opcional)</Text>
                <View style={styles.photoContainer}>
                  {fotoPerfil ? (
                    <Image source={{ uri: fotoPerfil }} style={styles.photoPreview} />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Ionicons name="camera-outline" size={40} color="#9CA3AF" />
                      <Text style={styles.photoPlaceholderText}>Seleccionar foto</Text>
                    </View>
                  )}
                  <View style={styles.photoButtons}>
                    <TouchableOpacity style={styles.photoButton} onPress={selectImage}>
                      <Ionicons name="image-outline" size={20} color="#FC930A" />
                      <Text style={styles.photoButtonText}>Galería</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                      <Ionicons name="camera-outline" size={20} color="#FC930A" />
                      <Text style={styles.photoButtonText}>Cámara</Text>
                    </TouchableOpacity>
                    {fotoPerfil && (
                      <TouchableOpacity 
                        style={[styles.photoButton, styles.removeButton]} 
                        onPress={() => setFotoPerfil(null)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        <Text style={[styles.photoButtonText, styles.removeButtonText]}>Eliminar</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Correo electrónico</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChangeText={(text) => {
                      setFormData({ ...formData, email: text });
                      setErrors({ ...errors, email: '' });
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* Teléfono */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Teléfono</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="50370000000"
                    value={formData.telefono}
                    onChangeText={(text) => {
                      setFormData({ ...formData, telefono: text });
                      setErrors({ ...errors, telefono: '' });
                    }}
                    keyboardType="phone-pad"
                  />
                </View>
                {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
              </View>

              {/* Contraseña */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChangeText={(text) => {
                      setFormData({ ...formData, password: text });
                      setErrors({ ...errors, password: '' });
                    }}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#9CA3AF" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              {/* Confirmar Contraseña */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar contraseña</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChangeText={(text) => {
                      setFormData({ ...formData, confirmPassword: text });
                      setErrors({ ...errors, confirmPassword: '' });
                    }}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#9CA3AF" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>

              {/* Botón de registro */}
              <TouchableOpacity 
                style={styles.registerButton}
                onPress={handleRegister}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#E24B13', '#FFCC00']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.registerButtonText}>
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Botón de login */}
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleLoginPress}
              >
                <Text style={styles.loginButtonText}>
                  ¿Ya tienes cuenta? <Text style={styles.loginLink}>Inicia sesión</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Al registrarte, aceptas nuestros{' '}
                <Text style={styles.footerLink}>Términos y Condiciones</Text>
                {' '}y{' '}
                <Text style={styles.footerLink}>Política de Privacidad</Text>
              </Text>
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
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  registerButton: {
    marginBottom: 24,
  },
  gradientButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#9CA3AF',
  },
  loginButton: {
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  loginLink: {
    color: '#FC930A',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#FC930A',
    fontWeight: '500',
  },
  // Estilos para foto de perfil
  photoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoPlaceholderText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FEF3E2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FC930A',
  },
  photoButtonText: {
    color: '#FC930A',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  removeButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  removeButtonText: {
    color: '#EF4444',
  },
});

export default RegisterScreen;
