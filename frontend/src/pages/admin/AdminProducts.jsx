import React, { useEffect, useState } from 'react';
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
        images: []
    });
    const [editingId, setEditingId] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(previews);
    };

    const uploadImages = async () => {
        if (imageFiles.length === 0) {
            console.log('No image files selected');
            return [];
        }

        console.log('Starting image upload, files:', imageFiles);
        setUploading(true);
        const formData = new FormData();
        imageFiles.forEach(file => {
            console.log('Appending file:', file.name);
            formData.append('images', file);
        });

        try {
            console.log('Sending upload request to /api/products/upload');
            const { data } = await api.post('/products/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Upload response:', data);
            setUploading(false);
            return data.data; // Array of image paths
        } catch (error) {
            console.error('Image upload error:', error);
            console.error('Error response:', error.response?.data);
            setUploading(false);
            return [];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imagePaths = formData.images || [];

        // Upload new images if selected
        if (imageFiles.length > 0) {
            console.log('Uploading images...', imageFiles.length);
            const uploadedPaths = await uploadImages();
            console.log('Uploaded image paths:', uploadedPaths);
            imagePaths = [...imagePaths, ...uploadedPaths];
        }

        const productData = {
            ...formData,
            images: imagePaths
        };

        console.log('Product data being sent:', productData);

        if (editingId) {
            dispatch(updateProduct({ id: editingId, productData }));
            setEditingId(null);
        } else {
            dispatch(createProduct(productData));
        }

        setFormData({ name: '', description: '', price: '', category: '', stock: '', isFeatured: false, images: [] });
        setImageFiles([]);
        setImagePreview([]);
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category._id || product.category,
            stock: product.stock,
            isFeatured: product.isFeatured,
            images: product.images || []
        });
        setEditingId(product._id);
        setImagePreview(product.images || []);
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
                                    type="file"
                                    className="form-input"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                {imagePreview.length > 0 && (
                                    <div className="image-preview-grid">
                                        {imagePreview.map((preview, idx) => (
                                            <img key={idx} src={preview} alt={`Preview ${idx + 1} `} className="image-preview" />
                                        ))}
                                    </div>
                                )}
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
                                        setFormData({ name: '', description: '', price: '', category: '', stock: '', isFeatured: false, images: [] });
                                        setImageFiles([]);
                                        setImagePreview([]);
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
                                        <h3>{product.name}</h3>
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
