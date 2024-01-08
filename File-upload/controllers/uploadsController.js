const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const uploadProductImageLocal = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("No file uploaded");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload image only");
  }
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new BadRequestError("Please upload image smaller than 1MB");
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );

  //move image to another area
  await productImage.mv(imagePath);
  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

const uploadProductImage = async (req, res) => {
  let imageName = req.files.image.name;
  imageName = imageName.split(".");
  imageName.pop();
  imageName = imageName.join("");
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      public_id: imageName,
      folder: "File-upload",
    }
  );

  //deleting temp files
  fs.unlinkSync(req.files.image.tempFilePath);
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = { uploadProductImageLocal, uploadProductImage };
