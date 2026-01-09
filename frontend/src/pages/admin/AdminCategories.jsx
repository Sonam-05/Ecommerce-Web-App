import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../store/slices/categorySlice';
import './AdminPages.css';

const AdminCategories = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.categories);

    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            dispatch(updateCategory({ id: editingId, categoryData: formData }));
            setEditingId(null);
        } else {
            dispatch(createCategory(formData));
        }
        setFormData({ name: '', description: '' });
    };

    const handleEdit = (category) => {
        setFormData({ name: category.name, description: category.description });
        setEditingId(category._id);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteCategory(id));
        }
    };

    return (
        <div className="admin-page">
            <div className="container">
                <h1>Category Management</h1>

                <div className="admin-content">
                    <div className="form-section">
                        <h2>{editingId ? 'Edit Category' : 'Add New Category'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="form-textarea"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    {editingId ? 'Update' : 'Create'} Category
                                </button>
                                {editingId && (
                                    <button type="button" className="btn btn-outline" onClick={() => { setEditingId(null); setFormData({ name: '', description: '' }); }}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="list-section">
                        <h2>Categories</h2>
                        <div className="items-list">
                            {categories.map((category) => (
                                <div key={category._id} className="item-card">
                                    <div>
                                        <h3>{category.name}</h3>
                                        <p>{category.description}</p>
                                    </div>
                                    <div className="item-actions">
                                        <button className="btn-edit" onClick={() => handleEdit(category)}>Edit</button>
                                        <button className="btn-delete" onClick={() => handleDelete(category._id)}>Delete</button>
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

export default AdminCategories;
