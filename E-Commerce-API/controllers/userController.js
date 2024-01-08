const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
} = require("../utils");

//admin can access all data
const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

//login in user can access only his data
//admin can access all data
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`);
  }

  //here user._id is a type of ObjectId
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

//if the user is present then it is used.  When we refresh or when we go back and again come to the page
const showCurrentUser = async (req, res) => {
  //req.user come from the middleware authenticateUser
  res.status(StatusCodes.OK).json({ user: req.user });
};

//using save

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid credential");
  }
  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password updated" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};

// const updateUser = async (req, res) => {
//   const { name, email } = req.body;
//   if (!name || !email) {
//     throw new CustomError.BadRequestError("Please provide all values");
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { name, email },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };
