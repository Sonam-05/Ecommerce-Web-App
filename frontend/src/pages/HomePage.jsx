import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../store/slices/categorySlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const HomePage = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { categories, loading: categoryLoading } = useSelector((state) => state.categories);
    const { products, loading: productLoading } = useSelector((state) => state.products);

    // Fetch categories on mount
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Fetch products based on category or default limit
    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                setLoading(true);
                let url = '/products';

                if (selectedCategory) {
                    url += `?category=${selectedCategory}`;
                } else {
                    // Only fetch 6 for home page if no category selected
                    url += '?limit=6';
                }

                const { data } = await api.get(url);
                setFilteredProducts(data.data);

                // If we are fetching the limited set, we use the 'total' from backend to know if there are more
                if (!selectedCategory && data.total) {
                    setTotalProducts(data.total);
                }

            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsData();
    }, [selectedCategory]);

    // Note: 'loading' here comes from productSlice which might be for "fetchAll". 
    // Since we are doing custom fetching here, we might want local loading state or dispatch specific actions.
    // For now, adhering to the structure but overriding the data source.

    const featuredProducts = filteredProducts.filter(p => p.isFeatured);

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    };

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
                    {categoryLoading ? (
                        <Loader variant="dots" message="Loading categories..." />
                    ) : (
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
                    )}
                    {selectedCategory && (
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <button className="btn btn-outline" onClick={() => setSelectedCategory(null)}>
                                Clear Filter
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Products Section */}
            {loading ? (
                <div className="container" style={{ padding: '4rem 0' }}>
                    <Loader variant="default" message="Fetching catalog..." />
                </div>
            ) : (
                <>
                    {/* Featured Products Section */}
                    {featuredProducts.length > 0 && !selectedCategory && (
                        <section id="featured" className="section">
                            <div className="container">
                                <h2 className="section-title">Featured Products</h2>
                                <div className="products-grid">
                                    {featuredProducts.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* All Products Section */}
                    <section className="section">
                        <div className="container">
                            <h2 className="section-title">
                                {selectedCategory ? 'Filtered Products' : 'All Products'}
                            </h2>

                            <div className="products-grid">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {!selectedCategory && totalProducts > 6 && (
                                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate('/products')}
                                    >
                                        View More Products
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default HomePage;
