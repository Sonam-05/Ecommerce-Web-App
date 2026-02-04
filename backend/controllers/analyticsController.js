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

        // Optimized Aggregation Pipeline
        const stats = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $facet: {
                    totalStats: [
                        { $group: { _id: null, totalSales: { $sum: '$totalPrice' }, totalOrders: { $sum: 1 } } }
                    ],
                    statusBreakdown: [
                        { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
                    ],
                    salesByDate: [
                        {
                            $group: {
                                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                                sales: { $sum: '$totalPrice' },
                                orders: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ]
                }
            }
        ]);

        const result = stats[0];
        const totalSales = result.totalStats[0]?.totalSales || 0;
        const totalOrders = result.totalStats[0]?.totalOrders || 0;

        const statusBreakdown = {
            Ordered: 0,
            Shipped: 0,
            'Out for Delivery': 0,
            Delivered: 0
        };
        result.statusBreakdown.forEach(s => {
            if (statusBreakdown.hasOwnProperty(s._id)) {
                statusBreakdown[s._id] = s.count;
            }
        });

        const salesByDate = {};
        result.salesByDate.forEach(item => {
            salesByDate[item._id] = { sales: item.sales, orders: item.orders };
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
        // Run aggregation and recent orders fetch in parallel
        const [stats, recentOrders] = await Promise.all([
            Order.aggregate([
                {
                    $facet: {
                        totalOrders: [{ $count: 'count' }],
                        pendingOrders: [{ $match: { orderStatus: 'Ordered' } }, { $count: 'count' }],
                        deliveredOrders: [{ $match: { orderStatus: 'Delivered' } }, { $count: 'count' }],
                        totalRevenue: [{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]
                    }
                }
            ]),
            Order.find()
                .select('user totalPrice orderStatus createdAt')
                .populate('user', 'name email')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean()
        ]);

        const data = stats[0];

        res.status(200).json({
            success: true,
            data: {
                totalOrders: data.totalOrders[0]?.count || 0,
                pendingOrders: data.pendingOrders[0]?.count || 0,
                deliveredOrders: data.deliveredOrders[0]?.count || 0,
                totalRevenue: data.totalRevenue[0]?.total || 0,
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
