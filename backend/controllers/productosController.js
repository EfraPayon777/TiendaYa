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
                p.categoria_id,
                c.nombre AS categoria, 
                u.nombre AS vendedor, 
                u.telefono,
                pi.img_url AS imagen,
                COALESCE(ROUND(AVG(pr.rating), 1), 0) AS promedio_rating,
                COALESCE(COUNT(pr.id), 0) AS total_reseñas
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN usuarios u ON p.vendedorId = u.id
            LEFT JOIN producto_img pi ON p.id = pi.producto_id AND pi.principal = 1
            LEFT JOIN producto_ratings pr ON p.id = pr.producto_id
            GROUP BY p.id, p.categoria_id, c.nombre, u.nombre, u.telefono, pi.img_url
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
                p.categoria_id,
                c.nombre AS categoria, 
                u.nombre AS vendedor, 
                u.telefono,
                COALESCE(ROUND(AVG(pr.rating), 1), 0) AS promedio_rating,
                COALESCE(COUNT(pr.id), 0) AS total_reseñas
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN usuarios u ON p.vendedorId = u.id
            LEFT JOIN producto_ratings pr ON p.id = pr.producto_id
            WHERE p.id = ?
            GROUP BY p.id, p.categoria_id, c.nombre, u.nombre, u.telefono
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

async function createProducto(req, res) {
    try {
        console.log('🔍 Creando producto...');
        console.log('Body:', req.body);
        console.log('Files:', req.files);

        const { categoria_id, nombre, descripcion, precio, stock, vendedorId } = req.body;

        // Validar campos requeridos
        if (!nombre || !descripcion || !precio || !stock || !vendedorId) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        // Crear producto en la base de datos
        const [result] = await pool.execute(
            'INSERT INTO productos (categoria_id, nombre, descripcion, precio, stock, vendedorId) VALUES (?, ?, ?, ?, ?, ?)',
            [categoria_id, nombre, descripcion, precio, stock, vendedorId]
        );

        const productoId = result.insertId;
        console.log('✅ Producto creado con ID:', productoId);

        // Manejar imagen real o placeholder
        let imgUrl;
        if (req.file) {
            // Usar imagen real subida con URL completa
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            imgUrl = `${baseUrl}/uploads/${req.file.filename}`;
            console.log('✅ Imagen real guardada:', imgUrl);
        } else {
            // Usar placeholder si no hay imagen
            imgUrl = `https://dummyimage.com/300x200/FC930A/FFFFFF&text=${encodeURIComponent(nombre)}`;
            console.log('✅ Imagen placeholder guardada:', imgUrl);
        }
        
        await pool.execute(
            'INSERT INTO producto_img (producto_id, img_url, principal, orden) VALUES (?, ?, ?, ?)',
            [productoId, imgUrl, 1, 1]
        );

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: {
                id: productoId,
                nombre,
                descripcion,
                precio,
                stock
            }
        });

    } catch (error) {
        console.error('❌ Error al crear producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}

async function updateProducto(req, res) {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock, categoria_id } = req.body;

        // Validar campos requeridos
        if (!nombre || !descripcion || !precio || !stock || !categoria_id) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        // Actualizar producto
        await pool.execute(
            'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria_id = ? WHERE id = ?',
            [nombre, descripcion, precio, stock, categoria_id, id]
        );

        res.json({
            success: true,
            message: 'Producto actualizado exitosamente'
        });

    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}

async function deleteProducto(req, res) {
    try {
        const { id } = req.params;

        // Eliminar producto (las imágenes se eliminan automáticamente por CASCADE)
        await pool.execute('DELETE FROM productos WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });

    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}

module.exports = { getProductos, getProductoById, createProducto, updateProducto, deleteProducto };
