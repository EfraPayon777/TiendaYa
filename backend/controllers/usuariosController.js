const pool = require('../config/db');

// Obtener perfil de usuario
async function getPerfil(req, res) {
    try {
        const { id } = req.params;
        
        const [rows] = await pool.query(
            'SELECT id, nombre, email, telefono, creadoEn, foto_perfil, estado FROM usuarios WHERE id = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Actualizar perfil de usuario
async function updatePerfil(req, res) {
    try {
        const { id } = req.params;
        const { nombre, telefono } = req.body;
        
        // Manejar foto de perfil si se subió una nueva
        let updateQuery = 'UPDATE usuarios SET nombre = ?, telefono = ?';
        let queryParams = [nombre, telefono];
        
        if (req.file) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const fotoPerfil = `${baseUrl}/uploads/${req.file.filename}`;
            updateQuery += ', foto_perfil = ?';
            queryParams.push(fotoPerfil);
        }
        
        updateQuery += ' WHERE id = ?';
        queryParams.push(id);
        
        await pool.execute(updateQuery, queryParams);
        
        res.json({ message: 'Perfil actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Obtener productos de un usuario
async function getMisProductos(req, res) {
    try {
        const { id } = req.params;
        
        const [rows] = await pool.query(`
            SELECT 
                p.id, 
                p.nombre, 
                p.descripcion, 
                p.precio, 
                p.stock, 
                c.nombre AS categoria,
                pi.img_url AS imagen,
                p.creadoEn
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN producto_img pi ON p.id = pi.producto_id AND pi.principal = 1
            WHERE p.vendedorId = ?
            ORDER BY p.creadoEn DESC
        `, [id]);
        
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener productos del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Obtener estadísticas del usuario
async function getEstadisticas(req, res) {
    try {
        const { id } = req.params;
        
        // Contar productos
        const [productosCount] = await pool.query(
            'SELECT COUNT(*) as total FROM productos WHERE vendedorId = ?',
            [id]
        );
        
        // Contar favoritos
        const [favoritosCount] = await pool.query(
            'SELECT COUNT(*) as total FROM favoritos WHERE user_id = ?',
            [id]
        );
        
        // Contar reseñas recibidas
        const [reseñasCount] = await pool.query(`
            SELECT COUNT(*) as total 
            FROM producto_ratings pr
            JOIN productos p ON pr.producto_id = p.id
            WHERE p.vendedorId = ?
        `, [id]);
        
        // Promedio de calificaciones
        const [promedio] = await pool.query(`
            SELECT AVG(pr.rating) as promedio
            FROM producto_ratings pr
            JOIN productos p ON pr.producto_id = p.id
            WHERE p.vendedorId = ?
        `, [id]);
        
        res.json({
            productos: productosCount[0].total,
            favoritos: favoritosCount[0].total,
            reseñas: reseñasCount[0].total,
            promedio: promedio[0].promedio || 0
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    getPerfil,
    updatePerfil,
    getMisProductos,
    getEstadisticas
};
