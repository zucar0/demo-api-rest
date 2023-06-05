const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Configurar la conexión a la base de datos de PostgreSQL en Heroku
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
app.use(bodyParser.json());

// Ruta de ejemplo para obtener todos los contactos
app.get('/contacts', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM contacts');
    const contacts = result.rows;
    client.release();
    res.json(contacts);
  } catch (error) {
    console.error('Error al obtener los contactos:', error);
    res.status(500).json({ error: 'Error al obtener los contactos' });
  }
});

// Manejador de la ruta raíz
app.get('/', function (req, res) {
    res.send('inicio');
  });

// Ruta de ejemplo para crear un nuevo contacto
app.post('/contacts', async (req, res) => {
  const { name, email } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO contacts (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    const createdContact = result.rows[0];
    client.release();
    res.status(201).json(createdContact);
  } catch (error) {
    console.error('Error al crear el contacto:', error);
    res.status(500).json({ error: 'Error al crear el contacto' });
  }
});

// Obtener un contacto por ID
app.get('/contactos/:id', function (req, res) {
    db.get('SELECT * FROM contactos WHERE id = ?', req.params.id, function (
      err,
      row
    ) {
      if (err) {
        console.error(err);
        res.status(500).send('Error del servidor al obtener el contacto.');
      } else if (!row) {
        res.status(404).send('Contacto no encontrado.');
      } else {
        res.json(row);
      }
    });
  });
  
  // Crear un nuevo contacto
  app.post('/contactos', function (req, res) {
    const { nombre, telefono, correo } = req.body;
    db.run(
      'INSERT INTO contactos (nombre, telefono, correo) VALUES (?, ?, ?)',
      [nombre, telefono, correo],
      function (err) {
        if (err) {
          console.error(err);
          res.status(500).send('Error del servidor al crear el contacto.');
        } else {
          res.status(201).json({ id: this.lastID });
        }
      }
    );
  });
  
  // Actualizar un contacto
  app.put('/contactos/:id', function (req, res) {
    const { nombre, telefono, correo } = req.body;
    db.run(
      'UPDATE contactos SET nombre = ?, telefono = ?, correo = ? WHERE id = ?',
      [nombre, telefono, correo, req.params.id],
      function (err) {
        if (err) {
          console.error(err);
          res.status(500).send('Error del servidor al actualizar el contacto.');
        } else if (this.changes === 0) {
          res.status(404).send('Contacto no encontrado.');
        } else {
          res.sendStatus(200);
        }
      }
    );
  });
  
  // Eliminar un contacto
  app.delete('/contactos/:id', function (req, res) {
    db.run('DELETE FROM contactos WHERE id = ?', req.params.id, function (err) {
      if (err) {
        console.error(err);
        res.status(500).send('Error del servidor al eliminar el contacto.');
      } else if (this.changes === 0) {
        res.status(404).send('Contacto no encontrado.');
      } else {
        res.sendStatus(204);
      }
    });
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
