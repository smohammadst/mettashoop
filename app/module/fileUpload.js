const multer = require("multer");
const path = require("path");
const fs = require("fs");
const createError = require("http-errors");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file?.originalname) {
      req.body.fileUploadPath = path.join("uploads", "img");
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "uploads",
        "img"
      );
      return cb(null, filePath);
    }
    cb(null, null);
  },
  filename: (req, file, cb) => {
    if (file.originalname) {
      const ext = path.extname(file.originalname);
      const fileName = String(new Date().getTime() + ext);
      req.body.filename = fileName;
      return cb(null, fileName);
    }
    cb(null, null);
  },
});
function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname);
  const mimetypes = [".jpg", ".jpeg", ".png", ".webp", ".gif",".jfif"];
  if (mimetypes.includes(ext)) {
    return cb(null, true);
  }
  return cb(createError.BadRequest("فرمت ارسال شده تصویر صحیح نمیباشد"));
}
const pictureMaxSize = 1 * 1000 * 1000; //300MB
const uploadFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: pictureMaxSize },
});
module.exports = {
  uploadFile,
};
