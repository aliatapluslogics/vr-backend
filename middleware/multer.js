const multer = require("multer");
const fs = require("fs");

const storage = (field) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const { id } = req.params;
      const path = `./uploads/${id}`;
      fs.mkdirSync(path, { recursive: true });
      cb(null, path);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

const fileFilter = (filters) => (req, file, cb) => {
  if (filters.some((item) => item === file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Wrong extension type"), false);
  }
};

async function addPathToBody(req, res, next) {
  if (req.files) {
    if (!Array.isArray(req.files)) {
      let files = {};
      Object.keys(req.files).map((key) => (files[key] = { files: [] }));
      for (var key in req.files) {
        req.files[key].map((file) =>
          files[key].files.push(
            file.path != undefined ? file.path.replace(/\\/g, "/") : null
          )
        );
        req.body["models"] = files;
      }
    } else {
      let files = [];
      req.files.map((file) => {
        files.push(
          file.path != undefined ? file.path.replace(/\\/g, "/") : null
        );
      });
      req.body["models"] = files;
    }
  }
  if (req.file) req.body["image"] = req.file.path.replace(/\\/g, "/");
  next();
}

const uploader = (folder) =>
  multer({
    storage: storage(folder),
    fileFilter: fileFilter(["application/octet-stream", "usdz"]),
    // limits: { fileSize: 15 * 1024 * 1024 },
  });

module.exports = (folder = "/", field, type = "single") => {
  return [
    type === "array"
      ? uploader(folder).array(field)
      : type === "fields"
      ? uploader(folder).fields(field)
      : uploader(folder).single(field),
    addPathToBody,
  ];
};
