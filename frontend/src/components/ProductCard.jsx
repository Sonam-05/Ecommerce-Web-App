import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const { products: wishlistProducts } = useSelector((state) => state.wishlist);

    // Check if product is in wishlist
    const isInWishlist = wishlistProducts?.some(p => p._id === product._id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (userInfo) {
            dispatch(addToCart({ productId: product._id, quantity: 1 }));
        } else {
            window.location.href = '/login';
        }
    };

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        if (userInfo) {
            if (isInWishlist) {
                dispatch(removeFromWishlist(product._id));
            } else {
                dispatch(addToWishlist(product._id));
            }
        } else {
            window.location.href = '/login';
        }
    };

    return (
        <Link to={`/product/${product._id}`} className="product-card">
            <div className="product-image">
                <img
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name}
                    onError={(e) => e.target.src = '/placeholder.png'}
                />
                {product.isFeatured && <span className="featured-badge">Featured</span>}
                {product.stock === 0 && <span className="stock-badge">Out of Stock</span>}

                <div className="product-actions">
                    <button
                        className={`action-btn ${isInWishlist ? 'in-wishlist' : ''}`}
                        onClick={handleToggleWishlist}
                        title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description?.substring(0, 60)}...</p>

                <div className="product-rating">
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        ))}
                    </div>
                    <span className="rating-text">({product.numReviews})</span>
                </div>

                <div className="product-footer">
                    <span className="product-price">₹{product.price}</span>
                    <button
                        className="add-to-cart-btn"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
