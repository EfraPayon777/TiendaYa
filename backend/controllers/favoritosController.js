const pool = require('../config/db');

// GET /api/favoritos - Obtener todos los favoritos 
async function getAllFavoritos(req, res) {
    try {
        console.log('🔍 Intentando obtener todos los favoritos...');
        
        // Primero verifico si hay favoritos en la tabla
        const [countResult] = await pool.query('SELECT COUNT(*) as total FROM favoritos');
        console.log('📊 Total de favoritos en la base de datos:', countResult[0].total);
        
        if (countResult[0].total === 0) {
            console.log('⚠️ No hay favoritos en la base de datos');
            return res.json([]);
        }
        
        const [rows] = await pool.query(`
            SELECT 
                f.producto_id as id,
                p.nombre,
                p.descripcion,
                p.precio,
                p.stock,
                u.nombre AS vendedor,
                u.telefono,
                pi.img_url AS imagen
            FROM favoritos f
            INNER JOIN productos p ON f.producto_id = p.id
            LEFT JOIN usuarios u ON p.vendedorId = u.id
            LEFT JOIN producto_img pi ON p.id = pi.producto_id AND pi.principal = 1
            ORDER BY f.guardadoEn DESC
        `);

        console.log('✅ Favoritos obtenidos:', rows.length);
        res.json(rows);
    } catch (error) {
        console.error('❌ Error al obtener favoritos:', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Error al obtener favoritos',
            details: error.message 
        });
    }
}

// GET /api/favoritos/:userId
async function getFavoritosByUser(req, res) {
    const { userId } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT 
                f.producto_id as id,
                p.nombre,
                p.descripcion,
                p.precio,
                p.stock,
                u.nombre AS vendedor,
                u.telefono,
                (SELECT img_url 
                FROM producto_img 
                WHERE producto_id = p.id 
                ORDER BY principal DESC, orden ASC 
                LIMIT 1) AS imagen,
                COALESCE(ROUND(AVG(pr.rating), 1), 0) AS promedio_rating,
                COALESCE(COUNT(pr.id), 0) AS total_reseñas
            FROM favoritos f
            INNER JOIN productos p ON f.producto_id = p.id
            LEFT JOIN usuarios u ON p.vendedorId = u.id
            LEFT JOIN producto_ratings pr ON p.id = pr.producto_id
            WHERE f.user_id = ?
            GROUP BY f.producto_id, p.nombre, p.descripcion, p.precio, p.stock, u.nombre, u.telefono, f.guardadoEn
            ORDER BY f.guardadoEn DESC
        `, [userId]);

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener favoritos:', error.message);
        res.status(500).json({ error: 'Error al obtener favoritos' });
    }
}

// POST /api/favoritos/:userId/:productoId
async function addFavorito(req, res) {
    const { userId, productoId } = req.params;
    try {
        await pool.query(`
            INSERT INTO favoritos (user_id, producto_id) VALUES (?, ?)
        `, [userId, productoId]);

        res.json({ message: 'Producto agregado a favoritos ✅' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Este producto ya está en favoritos' });
        }
        console.error('Error al agregar favorito:', error.message);
        res.status(500).json({ error: 'Error al agregar favorito' });
    }
}

// DELETE /api/favoritos/:userId/:productoId
async function removeFavorito(req, res) {
    const { userId, productoId } = req.params;
    try {
        const [result] = await pool.query(`
            DELETE FROM favoritos WHERE user_id = ? AND producto_id = ?
        `, [userId, productoId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'El favorito no existe' });
        }

        res.json({ message: 'Producto eliminado de favoritos 🗑️' });
    } catch (error) {
        console.error('❌ Error al eliminar favorito:', error.message);
        res.status(500).json({ error: 'Error al eliminar favorito' });
    }
}

module.exports = { getAllFavoritos, getFavoritosByUser, addFavorito, removeFavorito };
