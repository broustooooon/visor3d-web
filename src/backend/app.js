const express = require('express');
const pool = require('./db');
const cors = require('cors');

const app = express();

// 🔑 Habilitar CORS para el origen del frontend
app.use(cors({ origin: 'http://localhost:5173' })); // Cambiar a:
//app.use(cors({ origin: 'http://visor3d_frontend:5173' }));



app.use(express.json());

/**
 * ✅ Obtener todos los escenarios
 */
/*
app.get('/api/escenarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "escenario"');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo escenarios:', error);
    res.status(500).json({ error: 'Error obteniendo escenarios' });
  }
});
*/

app.get('/api/escenarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, descripcion, miniatura FROM escenario');

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No hay escenarios disponibles' });
    }

    // Convertir las miniaturas a base64 para poder mostrarlas en el frontend
    const escenarios = result.rows.map(escenario => ({
      id: escenario.id,
      nombre: escenario.nombre,
      descripcion: escenario.descripcion,
      miniatura: escenario.miniatura ? `data:image/png;base64,${escenario.miniatura.toString('base64')}` : null
    }));

    res.json(escenarios);
  } catch (error) {
    console.error('❌ Error obteniendo los escenarios:', error);
    res.status(500).json({ error: `Error obteniendo los escenarios: ${error.message}` });
  }
});

/**
 * ✅ Obtener todos los modelos 3D de un escenario
 */
app.get('/api/modelos/:id_escenario', async (req, res) => {
  const { id_escenario } = req.params;

  try {
    const result = await pool.query(`
      SELECT id, nombre, descripcion, miniatura 
      FROM modelo3d 
      WHERE id_escenario = $1
    `, [id_escenario]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No hay modelos disponibles para este escenario' });
    }

    // Convertir las miniaturas a base64 para mostrarlas en el frontend
    const modelos = result.rows.map(modelo => ({
      id: modelo.id,
      nombre: modelo.nombre,
      descripcion: modelo.descripcion,
      miniatura: modelo.miniatura ? `data:image/png;base64,${modelo.miniatura.toString('base64')}` : null
    }));

    res.json(modelos);
  } catch (error) {
    console.error('❌ Error obteniendo los modelos:', error);
    res.status(500).json({ error: `Error obteniendo los modelos: ${error.message}` });
  }
});


/**
 * ✅ Obtener todos los modelos 3D
 */
/*
app.get('/api/modelos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "modelo3d"');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo modelos:', error);
    res.status(500).json({ error: 'Error obteniendo modelos' });
  }
});
*/


/**
 * ✅ Obtener todas las texturas
 */
/*
app.get('/api/texturas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "textura"');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo texturas:', error);
    res.status(500).json({ error: 'Error obteniendo texturas' });
  }
});
*/

/**
 * ✅ Endpoint para obtener el modelo y la textura desde la base de datos
 */

/*
app.get('/api/modelo3d/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT m.id, m.nombre, m.descripcion, m.modelo, t.textura
      FROM modelo3d m
      LEFT JOIN textura t ON m.id = t.id_modelo3d
      WHERE m.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Modelo no encontrado' });
    }

    const modelo = result.rows[0];

    // Verificar que modelo y textura existan
    if (!modelo.modelo) {
      return res.status(404).json({ error: 'Modelo no encontrado en la base de datos' });
    }

    const modeloBase64 = modelo.modelo.toString('base64');
    const texturaBase64 = modelo.textura ? modelo.textura.toString('base64') : null;

    res.json({
      id: modelo.id,
      nombre: modelo.nombre,
      descripcion: modelo.descripcion,
      modelo: modeloBase64,
      textura: texturaBase64
    });

  } catch (error) {
    console.error('❌ Error obteniendo el modelo:', error);
    res.status(500).json({ error: `Error obteniendo el modelo: ${error.message}` });
  }
});
*/

app.get('/api/modelo3d/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT m.id, m.nombre, m.descripcion, m.modelo, array_agg(t.textura) AS texturas
      FROM modelo3d m
      LEFT JOIN textura t ON m.id = t.id_modelo3d
      WHERE m.id = $1
      GROUP BY m.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Modelo no encontrado' });
    }

    const modelo = result.rows[0];

    if (!modelo.modelo) {
      return res.status(404).json({ error: 'Modelo no encontrado en la base de datos' });
    }

    const modeloBase64 = modelo.modelo.toString('base64');
    const texturasBase64 = modelo.texturas ? modelo.texturas.map(tex => tex ? tex.toString('base64') : null) : [];

    res.json({
      id: modelo.id,
      nombre: modelo.nombre,
      descripcion: modelo.descripcion,
      modelo: modeloBase64,
      texturas: Array.isArray(texturasBase64) ? texturasBase64 : [texturasBase64] // Convierte a array si es string
    });
    

  } catch (error) {
    console.error('❌ Error obteniendo el modelo:', error);
    res.status(500).json({ error: `Error obteniendo el modelo: ${error.message}` });
  }
});

/**
 * 🛠️ Iniciar el servidor
 */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend escuchando en el puerto ${PORT}`);
});