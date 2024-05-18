import bcryptjs from "bcryptjs";
import User from "../models/user.js";
import { errorHandler } from "../utils/error.js";

// Get Profile
export const getUserProfile = async (req, res, next) => {
  // Get profile logic
  if (req.user.id === req.params.id) {
    try {
      const userProfile = await User.findOne({ _id: req.params.id });
      const { password, ...rest } = userProfile._doc;
      res.status(200).json(rest);
    } catch (error) {
      console.log(error);
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own profile"));
  }
};

// Update Profile
export const updateUserProfile = async (req, res, next) => {
  // Update profile logic
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own profile"));
  }
  try {
    if (req.body.password) {
      const validUser = await User.findOne({ _id: req.params.id });
      if (!req.body.currentPassword) {
        return next(
          errorHandler(
            401,
            "You have to provide current password to update your password"
          )
        );
      }
      const validCurrentPassword = bcryptjs.compareSync(
        req.body.currentPassword,
        validUser.password
      );
      if (!validCurrentPassword) {
        return next(errorHandler(401, "Current password is incorrect"));
      }
      const confirmNewPassword = bcryptjs.compareSync(
        req.body.password,
        validUser.password
      );
      if (confirmNewPassword) {
        return next(
          errorHandler(
            400,
            "New password cannot be the same as the old one. Please enter a new password that doesn't match"
          )
        );
      }
      if (req.body.password !== req.body.confirmPassword) {
        return next(errorHandler(400, "Passwords don't match"));
      }
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
