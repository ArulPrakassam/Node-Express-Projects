const CustomError = require("../errors");

//here resourceUserId is a type of ObjectId
const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthenticatedError(
    "Not authorized to access this route"
  );
};
module.exports = checkPermissions;
