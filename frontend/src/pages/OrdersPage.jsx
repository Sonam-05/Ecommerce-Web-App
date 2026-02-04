import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../store/slices/orderSlice';
import Loader from '../components/Loader';
import './OrdersPage.css';

const OrdersPage = () => {
    const dispatch = useDispatch();
    const { orders, loading } = useSelector((state) => state.orders);

    const [statusFilter, setStatusFilter] = React.useState('');

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);

    // Client-side filtering
    const filteredOrders = orders.filter(order =>
        statusFilter === '' || order.orderStatus === statusFilter
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'success';
            case 'Out for Delivery': return 'warning';
            case 'Shipped': return 'primary';
            default: return 'secondary';
        }
    };

    const statuses = ['All', 'Ordered', 'Shipped', 'Out for Delivery', 'Delivered'];

    return (
        <div className="orders-page">
            <div className="container">
                <div className="orders-header-section">
                    <h1>My Orders</h1>
                    <div className="status-filter">
                        {statuses.map((status) => (
                            <button
                                key={status}
                                className={`filter-btn ${statusFilter === (status === 'All' ? '' : status) ? 'active' : ''}`}
                                onClick={() => setStatusFilter(status === 'All' ? '' : status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <Loader variant="gradient" message="Fetching your orders..." />
                ) : filteredOrders.length === 0 ? (
                    <div className="empty-orders">
                        <p>No orders found matching "{statusFilter || 'All'}"</p>
                        {statusFilter && (
                            <button
                                className="btn btn-primary"
                                onClick={() => setStatusFilter('')}
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="orders-list">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <h3>Order #{order._id.slice(-6)}</h3>
                                        <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`badge badge-${getStatusColor(order.orderStatus)}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="order-item">
                                            <span>{item.name} x {item.quantity}</span>
                                            <span>₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <span>Total: ₹{order.totalPrice}</span>
                                    <span>Payment: {order.paymentMethod}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
