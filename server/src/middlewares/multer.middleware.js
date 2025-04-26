import multer from 'multer';

// Memory storage — no files saved to disk
const storage = multer.memoryStorage();

// Optional: File type validation
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, png, webp, gif).'));
  }
};

// Optional: File size limit (e.g., 5MB)
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

export const upload = multer({
  storage,
  fileFilter,
  limits,
});
