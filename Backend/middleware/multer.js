const multer = require('multer');
const path = require('path');

// file storage 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));

    //  cb(null, file.originalname) // for original_file Name
  }
});

//filter file
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.png', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .png and .gif files are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;
