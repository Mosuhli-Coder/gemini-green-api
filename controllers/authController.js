import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

// Signup
export const signup = async (req, res, next) => {
  // Signup logic
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(errorHandler(400, "Passwords don't match"));
  }

  const user = await User.findOne({ email });
  if (user) {
    return next(errorHandler(400, "User already exists"));
  }
  // HASH PASSWORD HERE
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = bcryptjs.hashSync(password, salt);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  
  try {
    const savedUser = await newUser.save();
    const { password: pass, ...rest } = savedUser._doc;
    res.status(201).json({
      message: "User created successfully",
      data: rest,
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  // Login logic
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email: email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = async (req, res, next) => {
  // Logout logic
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
