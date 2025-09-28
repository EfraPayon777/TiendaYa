const express = require('express');
const { getCategorias } = require('../controllers/categoriasController');

const router = express.Router();

router.get('/', getCategorias);

module.exports = router;
