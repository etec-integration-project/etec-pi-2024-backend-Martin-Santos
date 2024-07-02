import express from 'express';
import { registrar, iniciarSesion, listarUsuarios, productos } from '../controladores/controladorAutenticacion.js';

const router = express.Router();

router.post('/registrar', registrar);
router.post('/iniciar-sesion', iniciarSesion);
router.get('/usuarios', listarUsuarios);  
router.get('/productos', productos); 

export default router;
