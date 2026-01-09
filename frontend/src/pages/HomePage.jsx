import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import './HomePage.css';

const HomePage = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    };

    // Filter products based on selected category
    const filteredProducts = selectedCategory
        ? products.filter(p => p.category._id === selectedCategory || p.category === selectedCategory)
        : products;

    const featuredProducts = filteredProducts.filter(p => p.isFeatured);
    const latestProducts = filteredProducts.slice(0, 8);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Welcome to <span className="gradient-text">E-Shop</span>
                        </h1>
                        <p className="hero-subtitle">
                            Discover amazing products at unbeatable prices
                        </p>
                        <div className="hero-actions">
                            <a href="#featured" className="btn btn-primary">Shop Now</a>
                            <a href="#categories" className="btn btn-outline">Browse Categories</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section id="categories" className="section">
                <div className="container">
                    <h2 className="section-title">Shop by Category</h2>
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <div
                                key={category._id}
                                className={`category-card ${selectedCategory === category._id ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(category._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="category-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <h3>{category.name}</h3>
                                <p>{category.description}</p>
                            </div>
                        ))}
                    </div>
                    {selectedCategory && (
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <button className="btn btn-outline" onClick={() => setSelectedCategory(null)}>
                                Clear Filter
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section id="featured" className="section">
                    <div className="container">
                        <h2 className="section-title">Featured Products</h2>
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="products-grid">
                                {featuredProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Latest Products */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Latest Products</h2>
                    {loading ? (
                        <Loader />
                    ) : (
                        <div className="products-grid">
                            {latestProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* All Products */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">
                        {selectedCategory ? 'Filtered Products' : 'All Products'}
                    </h2>
                    {loading ? (
                        <Loader />
                    ) : (
                        <div className="products-grid">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
