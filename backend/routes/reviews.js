const express = require('express');
const router = express.Router();
const reseñasController = require('../controllers/reseñasController');

// Obtener reseñas de un producto
router.get('/producto/:productoId', reseñasController.getReseñasProducto);

// Crear reseña
router.post('/', reseñasController.crearReseña);

// Actualizar reseña
router.put('/', reseñasController.actualizarReseña);

// Eliminar reseña
router.delete('/:userId/:productoId', reseñasController.eliminarReseña);

// Obtener reseñas de un usuario
router.get('/usuario/:userId', reseñasController.getReseñasUsuario);

module.exports = router;
