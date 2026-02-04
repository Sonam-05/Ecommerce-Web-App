import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, totalPrice } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No order items'
            });
        }

        // Fetch all products in one query instead of loop
        const productIds = items.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } })
            .select('_id name stock')
            .lean();

        // Create a map for quick lookup
        const productMap = new Map(products.map(p => [p._id.toString(), p]));

        // Verify stock availability
        for (const item of items) {
            const product = productMap.get(item.product.toString());
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.name} not found`
                });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            totalPrice,
            paymentMethod: 'COD'
        });

        // Prepare bulk operations for stock update
        const bulkOps = items.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { stock: -item.quantity } }
            }
        }));

        // Get admins for notifications
        const adminsPromise = User.find({ role: 'admin' }).select('_id').lean();

        // Execute all operations in parallel
        const [, admins] = await Promise.all([
            Product.bulkWrite(bulkOps), // Bulk update stock
            adminsPromise,
            Cart.findOneAndUpdate({ user: req.user._id }, { items: [] }) // Clear cart
        ]);

        // Prepare notifications for bulk insert
        const notifications = [
            {
                user: req.user._id,
                message: `Your order #${order._id.toString().slice(-6)} has been placed successfully`,
                type: 'order',
                relatedId: order._id
            },
            ...admins.map(admin => ({
                user: admin._id,
                message: `New order #${order._id.toString().slice(-6)} received from ${req.user.name}`,
                type: 'order',
                relatedId: order._id
            }))
        ];

        // Insert all notifications at once
        await Notification.insertMany(notifications);

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res) => {
    try {
        console.log("called 1")
        const status = req.query.status; // Optional status filter

        // Build query
        const query = { user: req.user._id };
        if (status) {
            query.orderStatus = status;
        }

        // Simplified query for maximum performance
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .lean();
        console.log("called 2")
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .select('user items shippingAddress totalPrice orderStatus deliveredAt createdAt')
            .populate('user', 'name email')
            .populate('items.product', 'name images price')
            .lean();

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure user owns this order or is admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status; // Optional status filter

        // Build query
        const query = {};
        if (status) {
            query.orderStatus = status;
        }

        // Execute queries in parallel
        const [orders, total] = await Promise.all([
            Order.find(query)
                .select('user items totalPrice orderStatus createdAt deliveredAt')
                .populate('user', 'name email')
                .populate('items.product', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id).populate('user', 'name');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.orderStatus = status;

        if (status === 'Delivered') {
            order.deliveredAt = Date.now();
        }

        await order.save();

        // Create notification for user
        await Notification.create({
            user: order.user._id,
            message: `Your order #${order._id.toString().slice(-6)} status updated to: ${status}`,
            type: 'order',
            relatedId: order._id
        });

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
