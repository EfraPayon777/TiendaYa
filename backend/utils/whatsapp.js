/**
 * Genera un enlace de WhatsApp con un mensaje predefinido.
 * @param {string} telefono - Número del vendedor (incluye código de país, ej. 50371234567).
 * @param {string} vendedor - Nombre del vendedor.
 * @param {string} producto - Nombre del producto.
 * @returns {string} - URL lista para abrir en el navegador/app de WhatsApp.
 */
function generarWhatsappUrl(telefono, vendedor, producto) {
    const mensaje = `Hola ${vendedor}, estoy interesado en tu producto "${producto}"`;
    return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
}

module.exports = { generarWhatsappUrl };
