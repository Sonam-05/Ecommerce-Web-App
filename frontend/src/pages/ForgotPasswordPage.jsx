import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './AuthPages.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/auth/forgot-password', { email });
            setMessage('Password reset instructions sent to your email');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <h1>Forgot Password</h1>
                    <p className="auth-subtitle">Enter your email to reset password</p>

                    {message && (
                        <div className={`alert ${message.includes('sent') ? 'alert-success' : 'alert-error'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Remember your password? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
