import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a product price'],
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please provide a category']
    },
    images: [{
        type: String
    }],
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text' }); // For search functionality
productSchema.index({ category: 1 });                       // For filtering by category
productSchema.index({ price: 1 });                          // For sorting by price
productSchema.index({ createdAt: -1 });                     // For sorting by newest
productSchema.index({ isFeatured: 1 });                     // For filtering featured products

const Product = mongoose.model('Product', productSchema);

export default Product;
