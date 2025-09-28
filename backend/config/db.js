const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tiendaya',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a MySQL establecida correctamente');
        connection.release();
    } catch (error) {
        console.error('Error conectando a MySQL:', error.message);
    }
}

testConnection();

module.exports = pool;
