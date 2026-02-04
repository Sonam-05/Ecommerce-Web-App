import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile } from '../store/slices/authSlice';
import api from '../utils/api';
import Loader from '../components/Loader';
import './ProfilePage.css';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    });
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        dispatch(getProfile()).then((result) => {
            if (result.payload) {
                setFormData({
                    name: result.payload.name,
                    email: result.payload.email
                });
                setAddresses(result.payload.addresses || []);
            }
            setLoading(false);
        });
    }, [dispatch]);

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        dispatch(updateProfile(formData));
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/users/address', newAddress);
            setAddresses(data.data);
            setNewAddress({ street: '', city: '', state: '', zipCode: '', country: 'India' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditAddress = (address) => {
        setEditingAddressId(address._id);
        setNewAddress({
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country
        });
    };

    const handleUpdateAddress = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put(`/users/address/${editingAddressId}`, newAddress);
            setAddresses(data.data);
            setNewAddress({ street: '', city: '', state: '', zipCode: '', country: 'India' });
            setEditingAddressId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancelEdit = () => {
        setEditingAddressId(null);
        setNewAddress({ street: '', city: '', state: '', zipCode: '', country: 'India' });
    };

    const handleSetDefaultAddress = async (addressId) => {
        try {
            const { data } = await api.put(`/users/address/${addressId}`, { isDefault: true });
            setAddresses(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteAddress = async (id) => {
        try {
            const { data } = await api.delete(`/users/address/${id}`);
            setAddresses(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="profile-page">
            <div className="container">
                <h1>My Profile</h1>

                {loading ? (
                    <Loader variant="default" message="Loading your profile..." />
                ) : (
                    <div className="profile-content">
                        <div className="profile-section">
                            <h2>Personal Information</h2>
                            <form onSubmit={handleUpdateProfile}>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Update Profile</button>
                            </form>
                        </div>

                        <div className="profile-section">
                            <h2>Addresses</h2>
                            <div className="addresses-list">
                                {addresses.map((address) => (
                                    <div key={address._id} className="address-card">
                                        {address.isDefault && (
                                            <span className="default-badge">Default</span>
                                        )}
                                        <p>{address.street}</p>
                                        <p>{address.city}, {address.state} {address.zipCode}</p>
                                        <p>{address.country}</p>
                                        <div className="address-actions">
                                            {!address.isDefault && (
                                                <button
                                                    onClick={() => handleSetDefaultAddress(address._id)}
                                                    className="btn-set-default"
                                                >
                                                    Set as Default
                                                </button>
                                            )}
                                            <button onClick={() => handleEditAddress(address)} className="btn-edit">Edit</button>
                                            <button onClick={() => handleDeleteAddress(address._id)} className="btn-delete">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h3>{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                            <form onSubmit={editingAddressId ? handleUpdateAddress : handleAddAddress}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Street"
                                        value={newAddress.street}
                                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="City"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="State"
                                        value={newAddress.state}
                                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Zip Code"
                                        value={newAddress.zipCode}
                                        onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Country"
                                        value={newAddress.country}
                                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button type="submit" className="btn btn-secondary">
                                        {editingAddressId ? 'Update Address' : 'Add Address'}
                                    </button>
                                    {editingAddressId && (
                                        <button type="button" className="btn btn-outline" onClick={handleCancelEdit}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
