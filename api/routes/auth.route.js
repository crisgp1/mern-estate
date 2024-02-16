import express from 'express';
import { signin, signup } from '../controllers/auth.controller.js';

const router = express.Router(); // Crea un nuevo router
router.post('/signup', signup); // Ruta para crear un nuevo usuario
router.post('/signin', signin); // Ruta para iniciar sesión

export default router;