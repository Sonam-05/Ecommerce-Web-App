import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../store/slices/orderSlice';
import { getProfile } from '../store/slices/authSlice';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        dispatch(getProfile()).then((result) => {
            if (result.payload?.addresses) {
                setAddresses(result.payload.addresses);
                const defaultAddr = result.payload.addresses.find(a => a.isDefault);
                if (defaultAddr) setSelectedAddress(defaultAddr);
            }
        });
    }, [dispatch]);

    const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

    const handlePlaceOrder = () => {
        if (!selectedAddress) {
            alert('Please select a shipping address');
            return;
        }

        const orderData = {
            items: items.map(item => ({
                product: item.product._id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                image: item.product.images?.[0]
            })),
            shippingAddress: selectedAddress,
            totalPrice: total,
            paymentMethod: 'COD'
        };

        dispatch(createOrder(orderData)).then(() => {
            navigate('/orders');
        });
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <h1>Checkout</h1>

                <div className="checkout-content">
                    <div className="checkout-section">
                        <h2>Select Shipping Address</h2>
                        {addresses.length === 0 ? (
                            <p>No addresses found. Please add an address in your profile.</p>
                        ) : (
                            <div className="address-list">
                                {addresses.map((address) => (
                                    <div
                                        key={address._id}
                                        className={`address-option ${selectedAddress?._id === address._id ? 'selected' : ''}`}
                                        onClick={() => setSelectedAddress(address)}
                                    >
                                        <input
                                            type="radio"
                                            checked={selectedAddress?._id === address._id}
                                            onChange={() => setSelectedAddress(address)}
                                        />
                                        <div>
                                            <p>{address.street}</p>
                                            <p>{address.city}, {address.state} {address.zipCode}</p>
                                            <p>{address.country}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="order-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-items">
                            {items.map((item) => (
                                <div key={item._id} className="summary-item">
                                    <span>{item.product?.name} x {item.quantity}</span>
                                    <span>₹{(item.product?.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <p className="payment-method">Payment Method: Cash on Delivery (COD)</p>
                        <button className="btn btn-primary btn-full" onClick={handlePlaceOrder} disabled={!selectedAddress}>
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
