const express = require('express');
const { getProductos, getProductoById } = require('../controllers/productosController');

const router = express.Router();

router.get('/', getProductos);

router.get('/:id', getProductoById);

module.exports = router;
