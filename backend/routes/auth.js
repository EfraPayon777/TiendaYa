const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../config/upload');

// Rutas de autenticación
router.post('/register', (req, res, next) => {
    upload.single('fotoPerfil')(req, res, (err) => {
        if (err) {
            console.error('❌ Error en multer (registro):', err);
            return res.status(400).json({
                success: false,
                message: 'Error al procesar la foto de perfil: ' + err.message
            });
        }
        next();
    });
}, authController.register);
router.post('/login', authController.login);
router.get('/verify', authController.verifyToken);

module.exports = router;
