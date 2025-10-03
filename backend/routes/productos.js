const express = require('express');
const { getProductos, getProductoById, createProducto, updateProducto, deleteProducto } = require('../controllers/productosController');

const router = express.Router();

router.get('/', getProductos);

router.get('/:id', getProductoById);

router.post('/', (req, res, next) => {
    console.log('🔍 Router POST /api/productos recibido');
    console.log('Body:', req.body);
    next();
}, createProducto);

router.put('/:id', updateProducto);

router.delete('/:id', deleteProducto);

module.exports = router;
