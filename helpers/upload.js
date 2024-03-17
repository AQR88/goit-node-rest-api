import multer from "multer";
import * as path from "path";

const tempDir = path.join(process.cwd(), "temp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerConfig,
});

export default upload;
