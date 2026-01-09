import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [period, setPeriod] = useState('month');

    useEffect(() => {
        fetchDashboardData();
    }, [period]);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, analyticsRes] = await Promise.all([
                api.get('/analytics/dashboard'),
                api.get(`/analytics/sales?period=${period}`)
            ]);
            setStats(statsRes.data.data);
            setAnalytics(analyticsRes.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="container">
                <h1>Admin Dashboard</h1>

                {stats && (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Total Orders</h3>
                            <p className="stat-value">{stats.totalOrders}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Pending Orders</h3>
                            <p className="stat-value">{stats.pendingOrders}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Delivered Orders</h3>
                            <p className="stat-value">{stats.deliveredOrders}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Revenue</h3>
                            <p className="stat-value">₹{stats.totalRevenue?.toFixed(2)}</p>
                        </div>
                    </div>
                )}

                <div className="analytics-section">
                    <div className="section-header">
                        <h2>Sales Analytics</h2>
                        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="form-select">
                            <option value="day">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>

                    {analytics && (
                        <div className="analytics-grid">
                            <div className="analytics-card">
                                <h3>Total Sales</h3>
                                <p className="analytics-value">₹{analytics.totalSales?.toFixed(2)}</p>
                            </div>
                            <div className="analytics-card">
                                <h3>Total Orders</h3>
                                <p className="analytics-value">{analytics.totalOrders}</p>
                            </div>
                            <div className="analytics-card">
                                <h3>Average Order Value</h3>
                                <p className="analytics-value">₹{analytics.averageOrderValue?.toFixed(2)}</p>
                            </div>
                        </div>
                    )}
                </div>

                {stats?.recentOrders && (
                    <div className="recent-orders">
                        <h2>Recent Orders</h2>
                        <div className="orders-table">
                            {stats.recentOrders.map((order) => (
                                <div key={order._id} className="order-row">
                                    <span>#{order._id.slice(-6)}</span>
                                    <span>{order.user?.name}</span>
                                    <span>₹{order.totalPrice}</span>
                                    <span className={`badge badge-${order.orderStatus === 'Delivered' ? 'success' : 'primary'}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
