import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getSimilarProducts,
  uploadImages
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
// import { upload } from '../middleware/upload.js';
import multer from 'multer';

import { storage } from '../utils/cloudinary.js';

const router = express.Router();

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

// Upload route must come before :id routes
router.post('/upload', protect, admin, upload.array('images', 5), uploadImages);

router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/:id/similar', getSimilarProducts);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/review', protect, addReview);

export default router;
