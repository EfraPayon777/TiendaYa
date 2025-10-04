const pool = require('../config/db');

// Obtener reseñas de un producto
async function getReseñasProducto(req, res) {
    try {
        const { productoId } = req.params;
        
        const [rows] = await pool.query(`
            SELECT 
                pr.id,
                pr.rating,
                pr.comentario,
                pr.creadoEn,
                u.nombre as usuario_nombre,
                u.id as usuario_id
            FROM producto_ratings pr
            JOIN usuarios u ON pr.user_id = u.id
            WHERE pr.producto_id = ?
            ORDER BY pr.creadoEn DESC
        `, [productoId]);
        
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener reseñas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Crear reseña
async function crearReseña(req, res) {
    try {
        console.log('🔍 Creando reseña - Body recibido:', req.body);
        const { userId, productoId, rating, comentario } = req.body;
        console.log('🔍 Comentario recibido:', comentario);
        
        // Verificar si ya existe una reseña del usuario para este producto
        const [existing] = await pool.query(
            'SELECT id FROM producto_ratings WHERE user_id = ? AND producto_id = ?',
            [userId, productoId]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Ya has calificado este producto' });
        }
        
        // Crear nueva reseña
        await pool.execute(
            'INSERT INTO producto_ratings (user_id, producto_id, rating, comentario) VALUES (?, ?, ?, ?)',
            [userId, productoId, rating, comentario || null]
        );
        
        res.json({ message: 'Reseña creada exitosamente' });
    } catch (error) {
        console.error('Error al crear reseña:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Actualizar reseña
async function actualizarReseña(req, res) {
    try {
        const { userId, productoId, rating } = req.body;
        
        await pool.execute(
            'UPDATE producto_ratings SET rating = ? WHERE user_id = ? AND producto_id = ?',
            [rating, userId, productoId]
        );
        
        res.json({ message: 'Reseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar reseña:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Eliminar reseña
async function eliminarReseña(req, res) {
    try {
        const { userId, productoId } = req.params;
        
        await pool.execute(
            'DELETE FROM producto_ratings WHERE user_id = ? AND producto_id = ?',
            [userId, productoId]
        );
        
        res.json({ message: 'Reseña eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar reseña:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Obtener reseñas de un usuario
async function getReseñasUsuario(req, res) {
    try {
        const { userId } = req.params;
        
        const [rows] = await pool.query(`
            SELECT 
                pr.id,
                pr.rating,
                pr.creadoEn,
                p.nombre as producto_nombre,
                p.id as producto_id,
                v.nombre as vendedor_nombre
            FROM producto_ratings pr
            JOIN productos p ON pr.producto_id = p.id
            JOIN usuarios v ON p.vendedorId = v.id
            WHERE pr.user_id = ?
            ORDER BY pr.creadoEn DESC
        `, [userId]);
        
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener reseñas del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    getReseñasProducto,
    crearReseña,
    actualizarReseña,
    eliminarReseña,
    getReseñasUsuario
};
