import express from 'express';
import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';
import authRutas from './rutas/rutasAutenticacion.js';
import cors from "cors";

config();

const app = express();

export const pool = createPool({
    host: process.env.MYSQLDB_HOST,
    user: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    port: process.env.MYSQLDB_DOCKER_PORT,
    database: process.env.MYSQLDB_DATABASE 
});

app.use(cors());
app.use(express.json());

const initializeDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nameProduct VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                urlImage VARCHAR(255) NOT NULL
            )
        `);

        console.log("Tabla 'users' creada o ya existe.");
    } catch (error) {
        console.error('Error al intentar crear la tabla:', error);
    }
    try {
        // ========== PRODUCTS ==========
        const [rows, fields] = await pool.query('SELECT * FROM productos');

        if (rows.length === 0) {
            // Insertar productos si no existen
            const productos = [
                ["Canon Eos RT7", "Descripcion para Canon Eos RT7", "https://s7d1.scene7.com/is/image/canon/2727C001_rebelt7-body_primary?wid=800"],
                ["Nikon D5600", "Descripcion Nikon D5600", "https://radojuva.com/wp-content/uploads/2020/06/nikon-d5600-review-2.jpg"],
                ["Sony Alpha A6000", "Descripcion para Sony Alpha A6000", "https://m.media-amazon.com/images/I/61kHENeCK8L._AC_SL1000_.jpg"],
                ["Fujifilm X-T5", "Descripcion para Fujifilm X-T5", "https://www.bhphotovideo.com/images/images2500x2500/fujifilm_16782301_x_t5_mirrorless_camera_black_1731281.jpg"],
                ["Pentax K1000", "Descripcion para Pentax K1000", "https://m.media-amazon.com/images/I/81Qp5jjq7vL.jpg"],
                ["Leica SL2", "Descripcion para Leica SL2", "https://leica-camera.com/sites/default/files/styles/meta_tag_product_image/public/pm-27555-10854__SL2.jpg?itok=Jp_fm1W7"],
                ["Olympus OM-1", "Descripcion para Olympus OM-1", "https://www.blogdelfotografo.com/wp-content/uploads/2023/10/OM-1-OM-System.webp"],
                ["Panasonic Lumix S5II", "DEscripcion para Panasonic Lumix S5II", "https://i.ebayimg.com/thumbs/images/g/KqoAAOSwYY5kuskE/s-l1200.jpg"]
            ];

            const insertQuery = 'INSERT INTO productos (nameProduct, description, urlImage) VALUES (?, ?, ?)';

            for (const producto of productos) {
                await pool.query(insertQuery, producto);
            }
        }


        console.log("Base inicializada correctamente");
    } catch (error) {
        console.error("Error inicializando la base de datos:", error);
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
