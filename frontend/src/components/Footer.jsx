import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>E-Commerce Store</h3>
                        <p>Your one-stop shop for all your needs</p>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                            <li><Link to="/wishlist">Wishlist</Link></li>
                            <li><Link to="/orders">Orders</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Customer Service</h4>
                        <ul>
                            <li><Link to="/profile">My Account</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} E-Commerce Store. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
