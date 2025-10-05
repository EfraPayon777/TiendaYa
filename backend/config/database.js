const mysql = require('mysql2/promise');

// Configuración para Docker y desarrollo local
const getDatabaseConfig = () => {
  // Si estamos en Docker (variables de entorno definidas)
  if (process.env.DB_HOST && process.env.DB_HOST !== 'localhost') {
    console.log('🐳 Modo Docker detectado');
    console.log(`🔍 Variables de entorno: DB_HOST=${process.env.DB_HOST}, DB_PORT=${process.env.DB_PORT}`);
    return {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000
    };
  }
  
  // Configuración para desarrollo local
  console.log('💻 Modo Local detectado');
  return {
    host: 'localhost',
    user: 'root',
    password: '2005',
    database: 'tiendaya',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000
  };
};

const config = getDatabaseConfig();
const pool = mysql.createPool(config);

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL establecida correctamente');
    console.log(`🔍 Configuración: ${config.host}:${config.port}/${config.database}`);
    connection.release();
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error.message);
    console.log(`🔍 Intentando conectar a: ${config.host}:${config.port}/${config.database}`);
  }
}

testConnection();

module.exports = pool;