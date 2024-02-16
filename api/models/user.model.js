import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ // El esquema de usuario para la base de datos MongoDB
    username : {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true,

    },
}, {timestamps: true}); // Añade timestamps a los datos del usuario para saber cuándo se creó y se actualizó el usuario.

const User = mongoose.model('User', userSchema); // Crea un modelo de usuario con el esquema de usuario

export default User; // Exporta el modelo de usuario para usarlo en otros archivos