import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import api from '../utils/api';
import './ProductsPage.css';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    // Filter States
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('latest');
    const [showFilters, setShowFilters] = useState(false); // Mobile toggle

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const pageParam = searchParams.get('page') || '1';
    const catParam = searchParams.get('category') || '';

    // Fetch Categories on Mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();

        // Init category from URL if present
        if (catParam) setSelectedCategory(catParam);
    }, []);

    // Fetch Products when filters or page change
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setPage(Number(pageParam));

                // Build query params
                const params = new URLSearchParams();
                params.append('page', pageParam);
                params.append('limit', '10');
                if (selectedCategory) params.append('category', selectedCategory);
                if (priceRange.min) params.append('minPrice', priceRange.min);
                if (priceRange.max) params.append('maxPrice', priceRange.max);
                if (minRating > 0) params.append('rating', minRating);
                if (sortBy) params.append('sort', sortBy);

                const { data } = await api.get(`/products?${params.toString()}`);
                setProducts(data.data);
                setPages(data.pages);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [pageParam, selectedCategory, priceRange, minRating, sortBy]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pages) {
            setSearchParams(prev => {
                prev.set('page', newPage);
                return prev;
            });
            window.scrollTo(0, 0);
        }
    };

    // Filter Handlers
    const handleCategoryChange = (e) => {
        const cat = e.target.value;
        setSelectedCategory(cat);
        setSearchParams(prev => {
            if (cat) prev.set('category', cat);
            else prev.delete('category');
            prev.set('page', '1');
            return prev;
        });
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setPriceRange(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (rating) => {
        setMinRating(prev => (prev === rating ? 0 : rating));
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setPriceRange({ min: '', max: '' });
        setMinRating(0);
        setSortBy('latest');
        setSearchParams({});
    };

    return (
        <div className="products-page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">All Products</h1>
                    <button
                        className="filter-toggle-btn"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                <div className="products-layout">
                    {/* Sidebar Filters */}
                    <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
                        <div className="filter-section">
                            <h3>Filters</h3>
                            <button className="clear-filters-btn" onClick={clearFilters}>
                                Clear All
                            </button>
                        </div>

                        <div className="filter-section">
                            <h4>Sort By</h4>
                            <select value={sortBy} onChange={handleSortChange} className="filter-select">
                                <option value="latest">Latest</option>
                                <option value="oldest">Oldest</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>

                        <div className="filter-section">
                            <h4>Category</h4>
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="filter-select"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-section">
                            <h4>Price Range</h4>
                            <div className="price-inputs">
                                <input
                                    type="number"
                                    name="min"
                                    placeholder="Min"
                                    value={priceRange.min}
                                    onChange={handlePriceChange}
                                    className="filter-input"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    name="max"
                                    placeholder="Max"
                                    value={priceRange.max}
                                    onChange={handlePriceChange}
                                    className="filter-input"
                                />
                            </div>
                        </div>

                        <div className="filter-section">
                            <h4>Customer Rating</h4>
                            <div className="rating-filter">
                                {[4, 3, 2, 1].map(star => (
                                    <label key={star} className="rating-option">
                                        <input
                                            type="checkbox"
                                            checked={minRating === star}
                                            onChange={() => handleRatingChange(star)}
                                        />
                                        <span className="stars">
                                            {'★'.repeat(star)}{'☆'.repeat(5 - star)} & Up
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="products-main">
                        {loading ? (
                            <Loader />
                        ) : (
                            <>
                                {products.length === 0 ? (
                                    <div className="no-products">
                                        <h3>No products found</h3>
                                        <p>Try adjusting your filters</p>
                                    </div>
                                ) : (
                                    <div className="products-grid">
                                        {products.map((product) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </div>
                                )}

                                {pages > 1 && (
                                    <div className="pagination">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => handlePageChange(page - 1)}
                                            className="page-btn"
                                        >
                                            Previous
                                        </button>
                                        <span className="page-info">
                                            Page {page} of {pages}
                                        </span>
                                        <button
                                            disabled={page === pages}
                                            onClick={() => handlePageChange(page + 1)}
                                            className="page-btn"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
