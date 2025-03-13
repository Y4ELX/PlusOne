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

async function testConexion() {
  try {
    console.log("🔹 Probando conexión a SQL Server...");
    const pool = await sql.connect(config);
    console.log("✅ Conexión exitosa a SQL Server");
    pool.close();
  } catch (error) {
    console.error("❌ Error en la conexión:", error);
  }
}

testConexion();
