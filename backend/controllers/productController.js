import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import Cart from '../models/Cart.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const {
            category,
            featured,
            search,
            page = 1,
            limit = 10,  // Changed default to 10
            minPrice,
            maxPrice,
            rating,
            sort
        } = req.query;

        let query = {};

        // Category Filter
        if (category) {
            query.category = category;
        }

        // Featured Filter
        if (featured === 'true') {
            query.isFeatured = true;
        }

        // Search Filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Price Filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Rating Filter
        if (rating) {
            query.rating = { $gte: Number(rating) };
        }

        // Pagination calculations
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        let productsQuery = Product.find(query).populate('category', 'name');

        // Sorting
        let sortOption = { createdAt: -1 }; // Default: Latest
        if (sort) {
            switch (sort) {
                case 'price_asc':
                    sortOption = { price: 1 };
                    break;
                case 'price_desc':
                    sortOption = { price: -1 };
                    break;
                case 'oldest':
                    sortOption = { createdAt: 1 };
                    break;
                case 'latest':
                    sortOption = { createdAt: -1 };
                    break;
                default:
                    sortOption = { createdAt: -1 };
            }
        }
        productsQuery = productsQuery.sort(sortOption);

        // Apply pagination
        const products = await productsQuery.skip(skip).limit(limitNum);

        // Get total count for pagination
        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name')
            .populate('reviews.user', 'name');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Remove product from all carts
        await Cart.updateMany(
            { 'items.product': req.params.id },
            { $pull: { items: { product: req.params.id } } }
        );

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add product review
// @route   POST /api/products/:id/review
// @access  Private
export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            review => review.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: 'Product already reviewed'
            });
        }

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Review added',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get similar products
// @route   GET /api/products/:id/similar
// @access  Public
export const getSimilarProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const similarProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id }
        }).limit(4).populate('category', 'name');

        res.status(200).json({
            success: true,
            data: similarProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// @desc    Upload product images
// @route   POST /api/products/upload
// @access  Private/Admin
export const uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
        const results = await Promise.all(uploadPromises);
        const imagePaths = results.map(result => result.secure_url);

        res.status(200).json({
            success: true,
            data: imagePaths
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
