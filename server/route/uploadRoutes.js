const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middleware/authMiddleware');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'inkwell/blogs',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });
    res.json({ url: result.secure_url, publicId: result.public_id, status: true });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

router.delete('/image/:publicId', protect, async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.publicId);
    res.json({ message: 'Image deleted', status: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
