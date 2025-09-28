// /backend/server.js
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const productosRoutes = require('./routes/productos'); // 👈 Importar rutas

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Ruta base de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API funcionando 🚀' });
});

// Rutas de productos
app.use('/api/productos', productosRoutes); 

app.listen(PORT, () => {
    console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
