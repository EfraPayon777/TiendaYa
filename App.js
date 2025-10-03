import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './contexts/AuthContext';

// Importar pantallas
import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import FavScreen from './screens/FavScreen';
import PostProductScreen from './screens/PostProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import MyProductsScreen from './screens/MyProductsScreen';
import ReviewsScreen from './screens/ReviewsScreen';
import AddReviewScreen from './screens/AddReviewScreen';
import EditProductScreen from './screens/EditProductScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FC930A',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'TiendaYa' }}
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ title: 'Detalles del Producto' }}
          />
          <Stack.Screen
            name="Favorites"
            component={FavScreen}
            options={{ title: 'Mis Favoritos' }}
          />
          <Stack.Screen
            name="PostProduct"
            component={PostProductScreen}
            options={{ title: 'Publicar Producto' }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Mi Perfil' }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Iniciar Sesión' }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Registrarse' }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: 'Editar Perfil' }}
          />
          <Stack.Screen
            name="MyProducts"
            component={MyProductsScreen}
            options={{ title: 'Mis Productos' }}
          />
          <Stack.Screen
            name="Reviews"
            component={ReviewsScreen}
            options={{ title: 'Mis Reseñas' }}
          />
          <Stack.Screen
            name="AddReview"
            component={AddReviewScreen}
            options={{ title: 'Dejar Reseña' }}
          />
          <Stack.Screen
            name="EditProduct"
            component={EditProductScreen}
            options={{ title: 'Editar Producto' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
