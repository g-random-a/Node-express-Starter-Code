import multer from 'multer';
import path from 'path';

// Define storage options for Multer
export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder for storing files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to ensure only files with specific extensions are accepted
const fileFilter = (req: any, file: any, cb: any) => {
  const fileTypes = /jpeg|jpg|png|pdf/; // Adjust the types as needed
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed'));
  }
};

// Initialize the Multer middleware
export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter,
});