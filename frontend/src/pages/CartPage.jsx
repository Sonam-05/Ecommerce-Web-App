import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartItem, removeFromCart } from '../store/slices/cartSlice';
import './CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.cart);

    const handleUpdateQuantity = (itemId, quantity) => {
        dispatch(updateCartItem({ itemId, quantity }));
    };

    const handleRemove = (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

    return (
        <div className="cart-page">
            <div className="container">
                <h1>Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="empty-cart">
                        <p>Your cart is empty</p>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {items.map((item) => (
                                <div key={item._id} className="cart-item">
                                    <img src={item.product?.images?.[0]} alt={item.product?.name} />
                                    <div className="item-details">
                                        <h3>{item.product?.name}</h3>
                                        <p className="item-price">₹{item.product?.price}</p>
                                    </div>
                                    <div className="item-quantity">
                                        <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}>+</button>
                                    </div>
                                    <p className="item-total">₹{(item.product?.price * item.quantity).toFixed(2)}</p>
                                    <button className="remove-btn" onClick={() => handleRemove(item._id)}>Remove</button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h2>Order Summary</h2>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <button className="btn btn-primary btn-full" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
