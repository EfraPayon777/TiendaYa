const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Obtener perfil de usuario
router.get('/:id', usuariosController.getPerfil);

// Actualizar perfil de usuario
router.put('/:id', usuariosController.updatePerfil);

// Obtener productos de un usuario
router.get('/:id/productos', usuariosController.getMisProductos);

// Obtener estadísticas del usuario
router.get('/:id/estadisticas', usuariosController.getEstadisticas);

module.exports = router;
