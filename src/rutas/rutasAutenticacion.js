import express from 'express';
import { registrar, iniciarSesion, listarUsuarios, productos, createProducts, updateProduct, buyCart } from '../controladores/controladorAutenticacion.js';

const router = express.Router();

router.post('/registrar', registrar);
router.post('/iniciar-sesion', iniciarSesion);
router.get('/usuarios', listarUsuarios);  
router.get('/productos', productos); 
router.post('/createProducts', createProducts);
router.patch('/editProduct/:id', updateProduct);
router.post('/compraCarrito', buyCart);

export default router;
