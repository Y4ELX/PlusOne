require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
  }
};

// Función para conectar a SQL Server
async function connectToDB() {
  try {
    const pool = await sql.connect(config);
    console.log('✅ Conexión exitosa a SQL Server');
    return pool;
  } catch (error) {
    console.error('❌ Error al conectar a SQL Server:', error);
    throw error;
  }
}

// Función para ejecutar consultas
async function ejecutarConsulta(query, params = []) {
  try {
    const pool = await connectToDB();
    const request = pool.request();

    params.forEach((param, index) => {
      request.input(`param${index + 1}`, param);
    });

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('❌ Error ejecutando consulta:', error);
    throw error;
  }
}

module.exports = { ejecutarConsulta };
