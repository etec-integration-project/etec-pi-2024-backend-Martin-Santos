import { pool } from '../index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export const registrar = async (req, res) => {
    const { usuario, password, email } = req.body;

    try {
        // Verifica si el usuario ya existe
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [usuario]);

        if (existingUser.length > 0) {
            return res.status(409).send('Usuario existente');
        }

        // Hash de la contraseña
        const passwordHashed = await bcrypt.hash(password, 8);

        // Inserta el nuevo usuario en la base de datos
        await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [usuario, email, passwordHashed]);

        res.status(201).send('Usuario registrado con éxito');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error al registrar usuario');
    }
};

export const iniciarSesion = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario por email en lugar de username
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
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
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
