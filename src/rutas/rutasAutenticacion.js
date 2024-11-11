import express from 'express';
import { registrar, iniciarSesion, listarUsuarios, productos, createProducts, updateProduct } from '../controladores/controladorAutenticacion.js';

const router = express.Router();

router.post('/registrar', registrar);
router.post('/iniciar-sesion', iniciarSesion);
router.get('/usuarios', listarUsuarios);  
router.get('/productos', productos); 
router.post('/createProducts', createProducts); // Crear y programar la funcion que se Encarge de guardar en la lista de productos, el producto nuevo ingresado por el usuario
router.patch('/editProduct'+id, updateProduct)

export default router;
