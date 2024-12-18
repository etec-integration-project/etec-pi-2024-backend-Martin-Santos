import express from 'express';
import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';
import authRutas from './rutas/rutasAutenticacion.js';
import cors from "cors";
import cookieParser from 'cookie-parser';

config();

const app = express();

export const pool = createPool({
    host: process.env.MYSQLDB_HOST,
    user: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    port: process.env.MYSQLDB_DOCKER_PORT,
    database: process.env.MYSQLDB_DATABASE 
});

app.use(cors(
    {
        origin: "*",
        credentials: true,
    }
));
app.use(cookieParser());
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
                price INT NOT NULL,
                urlImage VARCHAR(255) NOT NULL
            )
        `);
        await pool.query( `
            CREATE TABLE IF NOT EXISTS cart (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userID INT NOT NULL,
                cartContent VARCHAR(1024) NOT NULL
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
                ["Canon Eos RT7", "10", "https://s7d1.scene7.com/is/image/canon/2727C001_rebelt7-body_primary?wid=800"],
                ["Nikon D5600", "10", "https://radojuva.com/wp-content/uploads/2020/06/nikon-d5600-review-2.jpg"],
                ["Sony Alpha A6000", "10", "https://m.media-amazon.com/images/I/61kHENeCK8L._AC_SL1000_.jpg"],
                ["Fujifilm X-T5", "10", "https://www.bhphotovideo.com/images/images2500x2500/fujifilm_16782301_x_t5_mirrorless_camera_black_1731281.jpg"],
                ["Pentax K1000", "10", "https://m.media-amazon.com/images/I/81Qp5jjq7vL.jpg"],
                ["Leica SL2", "10", "https://cdn11.bigcommerce.com/s-r16b86mn51/images/stencil/original/products/9325/25542/Leica_SL2-S_35mm_f2__90499.1675797014.jpg?c=2&imbypass=on&imbypass=on"],
                ["Olympus OM-1", "10", "https://www.blogdelfotografo.com/wp-content/uploads/2023/10/OM-1-OM-System.webp"],
                ["Panasonic Lumix S5II", "10", "https://i.ebayimg.com/thumbs/images/g/KqoAAOSwYY5kuskE/s-l1200.jpg"]
            ];

            const insertQuery = 'INSERT INTO productos (nameProduct, price, urlImage) VALUES (?, ?, ?)';

            for (const producto of productos) {
                await pool.query(insertQuery, producto);
            }
        }


        console.log("Base inicializada correctamente");
    } catch (error) {
        console.error("Error inicializando la base de datos:", error);
    }
};

app.get('/app', (req, res) => {
    res.send('BackEnd Funcionando');
});

app.get('/app/ping', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT NOW()');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error ejecutando ping' });
    }
});


app.use('/app/autenticacion', authRutas);

app.listen(5000, async () => {
    await initializeDatabase();
    console.log('Backend corriendo en el puerto', 5000);
});
