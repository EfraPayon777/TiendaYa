const express = require('express');
const { getContactoVendedor } = require('../controllers/contactoController');

const router = express.Router();

// Ruta para obtener enlace de WhatsApp del vendedor
router.get('/:productoId', getContactoVendedor);

module.exports = router;
