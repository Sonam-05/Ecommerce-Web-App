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
import { enhancedMulter } from "enhanced-multer-file-uploader";

const router = express.Router();

const upload = enhancedMulter({
  destination: "uploads", // Save files to 'public/assets'
  sizeLimitMB: 5, // 5mb limit
  allowedTypes: ["jpeg", "png", "gif", "webp", "jpg"], // Only allow specific types
  filenameParam: "random", // Use random filenames
  fileLimit: 5, // Limit number of files (for array/fields)
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
