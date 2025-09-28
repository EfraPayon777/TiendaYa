const pool = require('../config/db');

async function getCategorias(req, res) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                id, 
                nombre, 
                padre_id, 
                creadoEn, 
                actualizadoEn
            FROM categorias
            ORDER BY nombre ASC
        `);

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener categorías:', error.message);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
}

module.exports = { getCategorias };
