import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import './WishlistPage.css';

const WishlistPage = () => {
    const { products } = useSelector((state) => state.wishlist);

    return (
        <div className="wishlist-page">
            <div className="container">
                <h1>My Wishlist</h1>

                {products.length === 0 ? (
                    <div className="empty-wishlist">
                        <p>Your wishlist is empty</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
