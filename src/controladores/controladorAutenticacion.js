import { pool } from '../index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export const registrar = async (req, res) => {
    let { usuario, password, email } = req.body;

    try {
        // Verifica si el usuario ya existe
        

        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [usuario]);

        if (existingUser.length > 0) {
            return res.status(409).send('Usuario existente');
        }

        // Hash de la contraseña
        // const salt = bcrypt.genSaltSync(8);
        // const passwordHashed = bcrypt.hashSync(password, salt);

        const passwordHashed = await bcrypt.hash(password, 8);

        // Inserta el nuevo usuario en la base de datos
        await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [usuario, email, passwordHashed]);


        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        usuario = rows[0];
        

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("santos-app", token);

        res.status(201).send('Usuario registrado con éxito');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error al registrar usuario');
    }
};

export const createProducts = async (req, res) => {
    const { name, price, urlImage } = req.body;
    try {
        // Inserta el nuevo producto en la base de datos
        const [existingProduct] = await pool.query('SELECT * FROM productos WHERE nameProduct = ?', [urlImage]);
        if (existingProduct.length > 0) {
            return res.status(409).send('Producto existente');
        }
        await pool.query('INSERT INTO productos (nameProduct, price, urlImage) VALUES (?, ?, ?)', [name, price, urlImage]);
        res.status(201).send('Producto registrado con éxito');
    }
    catch (error){
        console.error('Error al registrar producto:', error);
        res.status(500).send('Error al registrar producto');

    }
};

export const iniciarSesion = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        const usuario = rows[0];
        const esContrasenaValida = await bcrypt.compare(password, usuario.password);

        if (!esContrasenaValida) {
            return res.status(401).send('Contraseña inválida');
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("santos-app", token);

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params; 
    const { name, price, urlImage } = req.body; 

    try {
        const result = await pool.query(
            'UPDATE productos SET nameProduct = ?, price = ?, urlImage = ? WHERE id = ?',
            [name, price, urlImage, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send('Producto no encontrado');
        }

        res.status(200).send('Producto actualizado con éxito');
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).send('Error al actualizar el producto');
    }
};


export const listarUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, username FROM users');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send('Error al listar usuarios');
    }
};

export const productos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send('Error al mostrar los productos');
    }
};

export const buyCart = async (req, res) => {
    const userCookie = req.cookies['santos-app'] 

    if (!userCookie) { return res.json({ 'error': 'unauthorized' }) }
    const data = jwt.verify(userCookie, process.env.JWT_SECRET)
    const user_id = data.id

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [user_id]);

        if (rows.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }
    const cart = req.body.cart

    await pool.query('INSERT INTO cart (userID, cartContent) VALUES (?, ?)', [user_id, cart]);
    return res.json({msg:"Compra realizada"});

}
