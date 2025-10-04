const express = require('express');
const { getProductos, getProductoById, createProducto, updateProducto, deleteProducto } = require('../controllers/productosController');
const upload = require('../config/upload');

const router = express.Router();

router.get('/', getProductos);

router.get('/:id', getProductoById);

router.post('/', (req, res, next) => {
    upload.single('imagen')(req, res, (err) => {
        if (err) {
            console.error('❌ Error en multer:', err);
            return res.status(400).json({
                success: false,
                message: 'Error al procesar la imagen: ' + err.message
            });
        }
        console.log('🔍 Router POST /api/productos recibido');
        console.log('Body:', req.body);
        console.log('File:', req.file);
        next();
    });
}, createProducto);

router.put('/:id', updateProducto);

router.delete('/:id', deleteProducto);

module.exports = router;
