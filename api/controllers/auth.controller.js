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

  try {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hash });
    await newUser.save();
    res.status(201).json("Usuario creado correctamente");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "El usuario no existe"));

    const validPassword = await comparePassword(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "La contraseña no es correcta"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...userDetails } = validUser._doc;
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
    }).status(200).json(userDetails);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (user) {
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
      const {password: pass, ...rest} = user._doc;
      res.cookie("access_token", token, {
        httpOnly: true,
      }).status(200).json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      const newUser = new User({
        username: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        photo: req.body.photo,
      });
    }
  }
    catch (error) {
    next(error);
  }
};
