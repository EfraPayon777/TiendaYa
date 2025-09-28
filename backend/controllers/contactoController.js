// /controllers/contactoController.js
const pool = require('../config/db');
const { generarWhatsappUrl } = require('../utils/whatsapp');

// GET /api/contacto/:productoId
async function getContactoVendedor(req, res) {
    const { productoId } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT 
                p.id AS producto_id,
                p.nombre AS producto,
                u.id AS vendedor_id,
                u.nombre AS vendedor,
                u.telefono
            FROM productos p
            INNER JOIN usuarios u ON p.vendedorId = u.id
            WHERE p.id = ?
        `, [productoId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const producto = rows[0];
        const whatsappUrl = generarWhatsappUrl(
            producto.telefono,
            producto.vendedor,
            producto.producto
        );

        res.json({
            producto: producto.producto,
            vendedor: producto.vendedor,
            telefono: producto.telefono,
            whatsappUrl
        });
    } catch (error) {
        console.error('Error al obtener contacto:', error.message);
        res.status(500).json({ error: 'Error al obtener contacto del vendedor' });
    }
}

module.exports = { getContactoVendedor };
