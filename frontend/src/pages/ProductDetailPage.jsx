import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct, fetchSimilarProducts, addReview } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import ProductImageGallery from '../components/ProductImageGallery';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, similarProducts, loading } = useSelector((state) => state.products);
    const { userInfo } = useSelector((state) => state.auth);
    const { products: wishlistProducts } = useSelector((state) => state.wishlist);

    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    // Check if product is in wishlist
    const isInWishlist = wishlistProducts?.some(p => p._id === product?._id);

    useEffect(() => {
        dispatch(fetchProduct(id));
        dispatch(fetchSimilarProducts(id));
    }, [dispatch, id]);

    const handleAddToCart = () => {
        dispatch(addToCart({ productId: product._id, quantity }));
    };

    const handleToggleWishlist = () => {
        if (isInWishlist) {
            dispatch(removeFromWishlist(product._id));
        } else {
            dispatch(addToWishlist(product._id));
        }
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        dispatch(addReview({ productId: product._id, review: { rating, comment } }));
        setComment('');
        setRating(5);
    };

    if (loading || !product) return <Loader />;

    return (
        <div className="product-detail-page">
            <div className="container">
                <div className="product-detail">
                    <div className="product-images">
                        <ProductImageGallery images={product.images} productName={product.name} />
                    </div>

                    <div className="product-details">
                        <h1>{product.name}</h1>
                        <div className="product-rating">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                ))}
                            </div>
                            <span>({product.numReviews} reviews)</span>
                        </div>

                        <p className="product-price">₹{product.price}</p>
                        <p className="product-description">{product.description}</p>

                        <div className="product-stock">
                            <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                            </span>
                        </div>

                        {product.stock > 0 && (
                            <div className="quantity-selector">
                                <label>Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.stock}
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                />
                            </div>
                        )}

                        {userInfo && <div className='flexDiv'>
                            <button className="btn btn-primary" onClick={handleAddToCart} disabled={product.stock === 0}>
                                Add to Cart
                            </button>
                            <button className={`btn ${isInWishlist ? 'btn-primary' : 'btn-outline'}`} onClick={handleToggleWishlist}>
                                {isInWishlist ? '❤️ In Wishlist' : 'Add to Wishlist'}
                            </button>
                        </div>}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    <h2>Customer Reviews</h2>

                    {userInfo && (
                        <form className="review-form" onSubmit={handleSubmitReview}>
                            <h3>Write a Review</h3>
                            <div className="form-group">
                                <label>Rating</label>
                                <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))} className="form-select">
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Good</option>
                                    <option value="3">3 - Average</option>
                                    <option value="2">2 - Poor</option>
                                    <option value="1">1 - Terrible</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Comment</label>
                                <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="form-textarea" required />
                            </div>
                            <button type="submit" className="btn btn-primary">Submit Review</button>
                        </form>
                    )}

                    <div className="reviews-list">
                        {product.reviews?.map((review) => (
                            <div key={review._id} className="review-item">
                                <div className="review-header">
                                    <strong>{review.name}</strong>
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < review.rating ? 'currentColor' : 'none'} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <p>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <div className="similar-products">
                        <h2>Similar Products</h2>
                        <div className="products-grid">
                            {similarProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
