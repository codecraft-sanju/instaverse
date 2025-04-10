import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folderName = 'instagram-clone-uploads'; // Default folder

    if (req.baseUrl.includes('/profile')) {
      folderName = 'instagram-clone-profile-pictures';
    } else if (req.baseUrl.includes('/stories')) {
      folderName = 'instagram-clone-stories';
    } else if (req.baseUrl.includes('/posts')) {
      folderName = 'instagram-clone-posts';
    }

    return {
      folder: folderName,
      format: file.mimetype.split('/')[1], // Extract format from MIME type
      resource_type: 'auto',
    };
  },
});

// Multer Middleware
export const upload = multer({ storage });
