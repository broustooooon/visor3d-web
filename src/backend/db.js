const { Pool } = require('pg');
require('dotenv').config({ path: './credentials.env' });

//docker exec -it visor3d_postgres psql -U visor3d_user -d visor3d_db

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_PORT:', process.env.DB_PORT);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// 4️⃣ Probar conexión
pool.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err.message);
  } else {
    console.log('✅ Conexión a PostgreSQL establecida correctamente.');
  }
});

module.exports = pool;
