import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'COD'
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    orderStatus: {
        type: String,
        enum: ['Ordered', 'Shipped', 'Out for Delivery', 'Delivered'],
        default: 'Ordered'
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true,
    id: false, // Disable virtual 'id' for performance
    versionKey: false // Disable '__v' for performance and space saving
});

// Indexes for performance
orderSchema.index({ user: 1, createdAt: -1 }); // For fetching user order history sorted by date
orderSchema.index({ user: 1, orderStatus: 1, createdAt: -1 }); // For filtering by status and sorting
orderSchema.index({ createdAt: -1 }); // For admin fetching all orders sorted by date
orderSchema.index({ orderStatus: 1, createdAt: -1 }); // For filtering by status

const Order = mongoose.model('Order', orderSchema);

export default Order;
