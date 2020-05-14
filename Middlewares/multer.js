const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");
const crypto = require("crypto");

cloudinary.config({
  cloud_name: process.env.cloudName,
  api_key: process.env.cloudinaryKey,
  api_secret: process.env.cloudinarySecret
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: "communitySite",
  allowedFormats: ["jpeg", "jpg", "png"],
  filename: (req, file, cb) => {
    console.log('here');
    let buf = crypto.randomBytes(16);
    buf = buf.toString("hex");
    let uniqueFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/gi, "");
    uniqueFileName += buf;
    console.log('here');
    cb(undefined, uniqueFileName);
  }
});

const upload = multer({ storage });

module.exports = {
  cloudinary,
  upload
};
