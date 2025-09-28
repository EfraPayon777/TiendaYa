// /backend/server.js
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const productosRoutes = require('./routes/productos');
const categoriasRoutes = require('./routes/categorias');
const favoritosRoutes = require('./routes/favoritos');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Rutas

app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/favoritos', favoritosRoutes);


//Ruta de prueba para ver si funciona la API
app.get('/', (req, res) => {
    res.json({ message: 'API funcionando 🚀' });
});

app.listen(PORT, () => {
    console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
