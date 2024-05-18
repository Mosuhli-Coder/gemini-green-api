import bcryptjs from "bcryptjs";
import User from "../models/user.js";
import { errorHandler } from "../utils/error.js";

// Get Profile
export const getProfile = async (req, res, next) => {
  // Get profile logic
  if (req.user.id === req.params.id) {
    try {
      const userProfile = await User.find({ _id: req.params.id });
      res.status(200).json(userProfile);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own profile"));
  }
};

// Update Profile
export const updateProfile = async (req, res, next) => {
  // Update profile logic
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own profile"));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
