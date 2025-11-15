// Feito por Leonardo

const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.endsWith(".csv")) {
      return cb(new Error("Envie um arquivo CSV válido"));
    }
    cb(null, true);
  }
});

module.exports = upload;
