import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { fetchNotifications } from '../store/slices/notificationSlice';
import api from '../utils/api';
import NotificationBell from './NotificationBell';
import './Header.css';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);

    useEffect(() => {
        // Only fetch notifications once when component mounts and user is logged in
        if (userInfo) {
            dispatch(fetchNotifications());
        }
    }, [dispatch, userInfo?.token]); // Only depend on token, not entire userInfo

    // Debounced search
    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        setSearchLoading(true);
        const timer = setTimeout(async () => {
            try {
                const { data } = await api.get(`/products?search=${searchQuery}`);
                setSearchResults(data.data.slice(0, 5)); // Show top 5 results
                setShowSearchResults(true);
                setSearchLoading(false);
            } catch (error) {
                console.error('Search error:', error);
                setSearchLoading(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleSearchResultClick = (productId) => {
        navigate(`/product/${productId}`);
        setSearchQuery('');
        setShowSearchResults(false);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchResults.length > 0) {
            handleSearchResultClick(searchResults[0]._id);
        }
    };

    const cartItemCount = items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="8" fill="url(#gradient)" />
                            <path d="M16 8L20 12H18V20H14V12H12L16 8Z" fill="white" />
                            <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                                    <stop stopColor="#6366f1" />
                                    <stop offset="1" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span>E-Shop</span>
                    </Link>

                    {/* Search Box */}
                    <div className="search-container">
                        <form onSubmit={handleSearchSubmit} className="search-form">
                            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                            />
                            {searchLoading && <span className="search-loading">...</span>}
                        </form>

                        {/* Search Results Dropdown */}
                        {showSearchResults && searchResults.length > 0 && (
                            <div className="search-results">
                                {searchResults.map((product) => (
                                    <div
                                        key={product._id}
                                        className="search-result-item"
                                        onClick={() => handleSearchResultClick(product._id)}
                                    >
                                        <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} />
                                        <div className="search-result-info">
                                            <h4>{product.name}</h4>
                                            <p>₹{product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
                        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                        <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
                        <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
                        {userInfo && <Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>}
                        {userInfo?.role === 'admin' && (
                            <div className="admin-nav-menu">
                                <button className="admin-nav-button">
                                    Admin
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className="admin-nav-dropdown">
                                    <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                                    <Link to="/admin/categories" onClick={() => setMenuOpen(false)}>Categories</Link>
                                    <Link to="/admin/products" onClick={() => setMenuOpen(false)}>Products</Link>
                                    <Link to="/admin/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
                                </div>
                            </div>
                        )}
                    </nav>

                    <div className="header-actions">
                        {userInfo && <NotificationBell />}

                        <Link to="/cart" className="cart-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartItemCount > 0 && <span className="badge">{cartItemCount}</span>}
                        </Link>

                        {userInfo ? (
                            <div className="user-menu">
                                <button className="user-button">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>{userInfo.name}</span>
                                </button>
                                <div className="dropdown">
                                    <Link to="/profile">My Profile</Link>
                                    <Link to="/orders">My Orders</Link>
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary">Login</Link>
                        )}

                        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
