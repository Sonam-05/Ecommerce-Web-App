import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import api from '../../utils/api';
import './AdminPages.css';

const AdminProducts = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        isFeatured: false,
    });
    const [editingId, setEditingId] = useState(null);

    // Manage existing images (URLs) and new images (Files) separately
    const [existingImages, setExistingImages] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);

    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        // Append new files to the existing list of new files
        setNewImageFiles(prev => [...prev, ...files]);
    };

    const handleRemoveExistingImage = (indexToRemove) => {
        setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleRemoveNewImage = (indexToRemove) => {
        setNewImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const uploadImages = async (filesToUpload) => {
        if (filesToUpload.length === 0) return [];

        console.log('Starting image upload, files:', filesToUpload);
        setUploading(true);
        const uploadFormData = new FormData();
        filesToUpload.forEach(file => {
            uploadFormData.append('images', file);
        });

        try {
            const { data } = await api.post('/products/upload', uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploading(false);
            return data.data; // Array of image paths
        } catch (error) {
            console.error('Image upload error:', error);
            setUploading(false);
            return [];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Upload new images
        let uploadedUrls = [];
        if (newImageFiles.length > 0) {
            uploadedUrls = await uploadImages(newImageFiles);
        }

        // 2. Combine with existing preserved images
        const finalImages = [...existingImages, ...uploadedUrls];

        const productData = {
            ...formData,
            images: finalImages
        };

        if (editingId) {
            dispatch(updateProduct({ id: editingId, productData }));
            setEditingId(null);
        } else {
            dispatch(createProduct(productData));
        }

        // Reset form
        setFormData({ name: '', description: '', price: '', category: '', stock: '', isFeatured: false });
        setExistingImages([]);
        setNewImageFiles([]);

        // Reset the file input element to clear displayed file names
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category._id || product.category,
            stock: product.stock,
            isFeatured: product.isFeatured
        });
        setExistingImages(product.images || []);
        setNewImageFiles([]); // Clear any scratchpad files
        setEditingId(product._id);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteProduct(id));
        }
    };

    return (
        <div className="admin-page">
            <div className="container">
                <h1>Product Management</h1>

                <div className="admin-content">
                    <div className="form-section">
                        <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea className="form-textarea" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price</label>
                                    <input type="number" className="form-input" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input type="number" className="form-input" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select className="form-select" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Product Images</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="form-input"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                <div className="image-preview-grid">
                                    {/* Existing Images */}
                                    {existingImages.map((imgUrl, idx) => (
                                        <div key={`existing-${idx}`} className="image-preview-wrapper">
                                            <img src={imgUrl} alt={`Existing ${idx}`} className="image-preview" />
                                            <button
                                                type="button"
                                                className="btn-remove-image"
                                                onClick={() => handleRemoveExistingImage(idx)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}

                                    {/* New Images */}
                                    {newImageFiles.map((file, idx) => (
                                        <div key={`new-${idx}`} className="image-preview-wrapper">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`New ${idx}`}
                                                className="image-preview"
                                            />
                                            <button
                                                type="button"
                                                className="btn-remove-image"
                                                onClick={() => handleRemoveNewImage(idx)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} />
                                    {' '}Featured Product
                                </label>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary" disabled={uploading}>
                                    {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Create Product'}
                                </button>
                                {editingId && (
                                    <button type="button" className="btn btn-outline" onClick={() => {
                                        setEditingId(null);
                                        setFormData({ name: '', description: '', price: '', category: '', stock: '', isFeatured: false });
                                        setExistingImages([]);
                                        setNewImageFiles([]);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}>Cancel</button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="list-section">
                        <h2>Products</h2>
                        <div className="items-list">
                            {products.map((product) => (
                                <div key={product._id} className="item-card">
                                    <div>
                                        <h3 title={product.name}>{product.name}</h3>
                                        <p>₹{product.price} | Stock: {product.stock}</p>
                                    </div>
                                    <div className="item-actions">
                                        <button className="btn-edit" onClick={() => handleEdit(product)}>Edit</button>
                                        <button className="btn-delete" onClick={() => handleDelete(product._id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
