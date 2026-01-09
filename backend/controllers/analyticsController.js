import Order from '../models/Order.js';

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
export const getSalesAnalytics = async (req, res) => {
    try {
        const { period } = req.query; // day, week, month, year
        let startDate = new Date();

        switch (period) {
            case 'day':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(startDate.getMonth() - 1); // Default to month
        }

        const orders = await Order.find({
            createdAt: { $gte: startDate }
        });

        const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const totalOrders = orders.length;

        const statusBreakdown = {
            Ordered: 0,
            Shipped: 0,
            'Out for Delivery': 0,
            Delivered: 0
        };

        // yippi - delivered, lays - ordered, pencil - shipped, box - delivered
        // 10                 12                10              15
        orders.forEach(order => {
            statusBreakdown[order.orderStatus]++;
        });

        // Calculate daily sales for chart
        const salesByDate = {};

        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            if (!salesByDate[date]) {
                salesByDate[date] = { sales: 0, orders: 0 };
            }
            salesByDate[date].sales += order.totalPrice;
            salesByDate[date].orders++;
        });

        res.status(200).json({
            success: true,
            data: {
                period,
                totalSales,
                totalOrders,
                averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
                statusBreakdown,
                salesByDate
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ orderStatus: 'Ordered' });
        const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });

        const allOrders = await Order.find();
        const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0);

        // Get recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                pendingOrders,
                deliveredOrders,
                totalRevenue,
                recentOrders
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
