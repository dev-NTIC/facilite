const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure documents directory exists
const documentsDir = 'documents';
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, documentsDir);
  },
  filename: function(req, file, cb) {
    const timestamp = Date.now();
    const reference = req.body.reference || 'DOC';
    const extension = path.extname(file.originalname);
    const filename = `${reference}_${timestamp}_${file.fieldname}${extension}`;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers JPEG, PNG et PDF sont acceptés'));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

module.exports = upload;
