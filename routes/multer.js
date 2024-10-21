// Import Multer
const multer = require('multer');
const {v4:uuidv4}=require('uuid')
const path = require('path')
// Define the storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the upload directory
    cb(null, './public/images/uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const uniqueFilename =uuidv4()
    cb(null, uniqueFilename + path.extname(file.originalname));
  },
});

// Create the Multer instance
const upload = multer({
  storage: storage
});

module.exports = upload;