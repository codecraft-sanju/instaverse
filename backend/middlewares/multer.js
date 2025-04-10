import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'stories',
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp4'],
    resource_type: 'auto',
  },
});

const upload = multer({ storage });

export default upload;
