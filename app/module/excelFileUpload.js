const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file?.originalname) {
            const filePath = path.join(
                __dirname,
                "..",
                "..",
                "public",
                "uploads",
                "xcel"
            );
            return cb(null, filePath);
        }
        cb(null, null);
    },
    filename: (req, file, cb) => {
        if (file.originalname) {
            const ext = path.extname(file.originalname);
            const fileName = String("changePrice" + ext);
            return cb(null, fileName);
        }
        cb(null, null);
    },
});

function fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname);
    const mimetypes = [".xlsx"];
    if (mimetypes.includes(ext)) {
        return cb(null, true);
    }
    return cb(createError.BadRequest("فرمت ارسال شده فایل صحیح نمیباشد"));
}
const pictureMaxSize = 10 * 1000 * 1000; 
const uploadFileExcel = multer({
    storage,
    fileFilter,
    limits: { fileSize: pictureMaxSize },
});

module.exports = {
    uploadFileExcel,
};
