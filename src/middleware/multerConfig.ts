// import multer from 'multer';
// import path from 'path';

// // // Define storage options for Multer
// // export const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, path.join(__dirname, "../uploads")); // Save files in "uploads"
// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, `${Date.now()}-${file.originalname}`);
// //   }
// // });

// // // File filter to ensure only files with specific extensions are accepted
// // const fileFilter = (req: any, file: any, cb: any) => {

// // cb(null, true);

// // };

// // Initialize the Multer middleware
// export const upload = multer({
//   storage,
//   limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
//   fileFilter,
// });

import multer from "multer";
export const upload = multer({ storage: multer.memoryStorage() });