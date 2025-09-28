// /controllers/productosController.js
const pool = require('../config/db');

// GET /api/productos
async function getProductos(req, res) {
    try {
        const [rows] = await pool.query(`
        SELECT 
        p.id, 
        p.nombre, 
        p.descripcion, 
        p.precio, 
        p.stock, 
        c.nombre AS categoria, 
        u.nombre AS vendedor, 
        u.telefono
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN usuarios u ON p.vendedorId = u.id
        ORDER BY p.creadoEn DESC
    `);
        res.json(rows);
    } catch (error) {
        console.error('❌ Error al obtener productos:', error.message);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
}

module.exports = { getProductos };
