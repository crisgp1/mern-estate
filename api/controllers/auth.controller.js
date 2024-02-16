import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "Todos los campos son requeridos"));
  }

  const salt = await bcrypt.genSalt(12);
  bcrypt.hash(password, salt, async (err, hash) => {
    if (err) throw err;

    const newUser = new User({ username, email, password: hash });
    try {
      await newUser.save();
      res.status(201).json("Usuario creado correctamente");
    } catch (error) {
      next(error);
    }
  });
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "El usuario no existe"));

    const validPassword = await comparePassword(password, validUser.password);
    if (!validPassword)
      return next(errorHandler(401, "La contraseña no es correcta"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json({
        username: validUser.username,
        email: validUser.email,
        id: validUser._id,
      });
  } catch (error) {
    next(error);
  }
};
