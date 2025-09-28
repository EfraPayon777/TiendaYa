const express = require('express');
const { getProductos, getProductoById } = require('../controllers/productosController');

const router = express.Router();

// Listar todos los productos
router.get('/', getProductos);

// Obtener un producto específico por ID
router.get('/:id', getProductoById);

module.exports = router;
