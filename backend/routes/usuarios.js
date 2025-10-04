const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const upload = require('../config/upload');

// Obtener perfil de usuario
router.get('/:id', usuariosController.getPerfil);

// Actualizar perfil de usuario
router.put('/:id', (req, res, next) => {
    upload.single('fotoPerfil')(req, res, (err) => {
        if (err) {
            console.error('❌ Error en multer (actualizar perfil):', err);
            return res.status(400).json({
                success: false,
                message: 'Error al procesar la foto de perfil: ' + err.message
            });
        }
        next();
    });
}, usuariosController.updatePerfil);

// Obtener productos de un usuario
router.get('/:id/productos', usuariosController.getMisProductos);

// Obtener estadísticas del usuario
router.get('/:id/estadisticas', usuariosController.getEstadisticas);

module.exports = router;
