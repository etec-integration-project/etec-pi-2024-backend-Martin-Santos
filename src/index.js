import express from 'express';
import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';
import authRutas from './rutas/rutasAutenticacion.js';

config();

const app = express();

export const pool = createPool({
    host: process.env.MYSQLDB_HOST,
    user: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    port: process.env.MYSQLDB_DOCKER_PORT,
    database: process.env.MYSQLDB_DATABASE 
});

app.use(express.json());

const initializeDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);
        console.log("Tabla 'users' creada o ya existe.");
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    }
};

app.get('/', (req, res) => {
    res.send('BackEnd Funcionando');
});

app.get('/ping', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT NOW()');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error ejecutando ping' });
    }
});

// Cambiar la ruta de /api/auth a /autenticacion
app.use('/autenticacion', authRutas);

app.listen(3000, async () => {
    await initializeDatabase();
    console.log('Backend corriendo en el puerto', 3000);
});
