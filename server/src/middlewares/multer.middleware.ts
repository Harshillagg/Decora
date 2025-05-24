import multer from "multer";

const storage = multer.diskStorage({
  destination: "../../public/temp",
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

export default upload;