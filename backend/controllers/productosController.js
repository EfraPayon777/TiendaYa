const pool = require('../config/db');

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
        console.error('Error al obtener productos:', error.message);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
}

async function getProductoById(req, res) {
    const { id } = req.params;
    try {
        const [producto] = await pool.query(`
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
            WHERE p.id = ?
        `, [id]);

        if (producto.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Trae imágenes del producto
        const [imagenes] = await pool.query(`
            SELECT id, img_url, principal, orden
            FROM producto_img
            WHERE producto_id = ?
            ORDER BY principal DESC, orden ASC
        `, [id]);

        res.json({ ...producto[0], imagenes });
    } catch (error) {
        console.error('❌ Error al obtener producto:', error.message);
        res.status(500).json({ error: 'Error al obtener producto' });
    }
}

module.exports = { getProductos, getProductoById };
