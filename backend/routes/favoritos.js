const express = require('express');
const { 
    getFavoritosByUser, 
    addFavorito, 
    removeFavorito 
} = require('../controllers/favoritosController');

const router = express.Router();

// Listar favoritos de un usuario específico
router.get('/:userId', getFavoritosByUser);

// Agregar producto a favoritos
router.post('/:userId/:productoId', addFavorito);

// Quitar producto de favoritos
router.delete('/:userId/:productoId', removeFavorito);

module.exports = router;
