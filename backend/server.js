// /backend/server.js
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const productosRoutes = require('./routes/productos');
const categoriasRoutes = require('./routes/categorias');
const favoritosRoutes = require('./routes/favoritos');
const contactoRoutes = require('./routes/contacto');
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const reviewsRoutes = require('./routes/reviews');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

// Middleware de debug para ver todas las rutas
app.use((req, res, next) => {
    console.log(`🔍 Petición recibida: ${req.method} ${req.url}`);
    next();
});

// Rutas
console.log('🔧 Cargando rutas...');
app.use('/api/auth', authRoutes);
console.log('✅ Rutas de auth cargadas');
app.use('/api/productos', productosRoutes);
console.log('✅ Rutas de productos cargadas');
app.use('/api/categorias', categoriasRoutes);
console.log('✅ Rutas de categorías cargadas');
app.use('/api/favoritos', favoritosRoutes);
console.log('✅ Rutas de favoritos cargadas');
app.use('/api/contacto', contactoRoutes);
console.log('✅ Rutas de contacto cargadas');
app.use('/api/usuarios', usuariosRoutes);
console.log('✅ Rutas de usuarios cargadas');
app.use('/api/reviews', reviewsRoutes);
console.log('✅ Rutas de reseñas cargadas');

// Debug: Mostrar todas las rutas registradas
console.log('🔍 Rutas registradas:');
console.log('  GET  /api/productos');
console.log('  POST /api/productos');
console.log('  GET  /api/productos/:id');


//Ruta de prueba para ver si funciona la API
app.get('/', (req, res) => {
    res.json({ message: 'API funcionando 🚀' });
});

// Debug: Ruta de prueba para POST productos
app.post('/api/productos-debug', (req, res) => {
    console.log('🔍 POST /api/productos-debug recibido');
    console.log('Body:', req.body);
    res.json({ message: 'POST productos funcionando', body: req.body });
});

// Debug: Ruta para verificar base de datos
app.get('/api/debug/producto_img', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM producto_img');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Debug: Ruta para actualizar imágenes placeholder
app.get('/api/debug/update-images', async (req, res) => {
    try {
        // Obtener productos con sus nombres
        const [productos] = await pool.query(`
            SELECT p.id, p.nombre 
            FROM productos p 
            LEFT JOIN producto_img pi ON p.id = pi.producto_id 
            WHERE pi.img_url LIKE '%placeholder%' OR pi.img_url IS NULL
        `);
        
        for (const producto of productos) {
            const newUrl = `https://dummyimage.com/300x200/FC930A/FFFFFF&text=${encodeURIComponent(producto.nombre)}`;
            await pool.execute(
                'UPDATE producto_img SET img_url = ? WHERE producto_id = ?',
                [newUrl, producto.id]
            );
        }
        
        res.json({ message: 'Imágenes actualizadas', count: productos.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
    console.log(`✅ También accesible desde la red local en http://192.168.3.21:${PORT}`);
});
