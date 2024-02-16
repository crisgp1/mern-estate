import express from "express";
import { test } from "../controllers/user.controller.js";

const router = express.Router(); // Crea un nuevo router

router.get('/test', test); // Ruta para verificar que la API esté funcionando


export default router;