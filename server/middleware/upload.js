import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
// Use /tmp in production (Vercel) since the file system is read-only
const uploadDir =
  process.env.NODE_ENV === "production" ? "/tmp/uploads/" : "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Sanitize filename to prevent path traversal and special characters
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, "_");
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const sanitizedName = sanitizeFilename(file.originalname);
    const uniqueName = `${Date.now()}-${sanitizedName}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain", // for .txt resumes
  ];

  const allowedExtensions = [".pdf", ".doc", ".docx", ".txt"];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  // Validate both MIME type and file extension
  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(fileExtension)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed. Received: ${file.mimetype}`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

// Error handler middleware for multer errors
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large. Maximum size is 2MB.",
      });
    }
    return res.status(400).json({
      error: `Upload error: ${err.message}`,
    });
  } else if (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
  next();
};

export default upload;
