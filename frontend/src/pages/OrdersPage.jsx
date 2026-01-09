import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../store/slices/orderSlice';
import './OrdersPage.css';

const OrdersPage = () => {
    const dispatch = useDispatch();
    const { orders, loading } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'success';
            case 'Out for Delivery': return 'warning';
            case 'Shipped': return 'primary';
            default: return 'secondary';
        }
    };

    return (
        <div className="orders-page">
            <div className="container">
                <h1>My Orders</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : orders.length === 0 ? (
                    <div className="empty-orders">
                        <p>No orders yet</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
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
