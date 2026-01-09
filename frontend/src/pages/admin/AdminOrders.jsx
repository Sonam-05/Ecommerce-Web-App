import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/orderSlice';
import './AdminPages.css';

const AdminOrders = () => {
    const dispatch = useDispatch();
    const { allOrders, loading } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    const handleStatusChange = (orderId, newStatus) => {
        dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
    };

    return (
        <div className="admin-page">
            <div className="container">
                <h1>Order Management</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="orders-list">
                        {allOrders.map((order) => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <h3>Order #{order._id.slice(-6)}</h3>
                                        <p>Customer: {order.user?.name}</p>
                                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="order-total">Total: ₹{order.totalPrice}</p>
                                    </div>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="order-item">
                                            <span>{item.name} x {item.quantity}</span>
                                            <span>₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-status-section">
                                    <label>Order Status:</label>
                                    <select
                                        className="form-select"
                                        value={order.orderStatus}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    >
                                        <option value="Ordered">Ordered</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
