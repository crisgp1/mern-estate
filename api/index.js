import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
dotenv.config()

mongoose
  .connect(process.env.MONGO) // Conecta a la base de datos MongoDB con la URL proporcionada
  .then(() => {
    console.log('Conectado a MongoDB')
  })
  .catch((err) => {
    console.log(err)
  })

const app = express()

app.listen(3000, () => { // Inicia el servidor en el puerto 3000 y muestra un mensaje en la consola
  console.log('Servidor está trabajando en el puerto 3000')
})

app.use(express.json()) // Permite a la aplicación usar JSON en el body del HTML
app.use('/api/user', userRouter) // Usa el router de usuario en la ruta /api/user
app.use('/api/auth', authRouter) // Usa el router de autenticación en la ruta /api/auth

app.use((err, req, res, next) => { // Middleware para manejar errores
  const statusCode = err.statusCode || 500 // Código de estado por defecto
  const message = err.message || 'Internal Server Error' // Mensaje de error por defecto
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
