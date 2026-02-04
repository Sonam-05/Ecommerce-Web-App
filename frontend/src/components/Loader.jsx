import React from 'react';
import './Loader.css';

const Loader = ({ variant = 'default', message = 'Loading...', fullScreen = false }) => {
    const renderLoader = () => {
        switch (variant) {
            case 'dots':
                return (
                    <div className="loader-dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                );

            case 'spinner':
                return (
                    <div className="loader-spinner">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                    </div>
                );

            case 'pulse':
                return (
                    <div className="loader-pulse">
                        <div className="pulse-circle"></div>
                    </div>
                );

            case 'bars':
                return (
                    <div className="loader-bars">
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </div>
                );

            case 'gradient':
                return (
                    <div className="loader-gradient">
                        <div className="gradient-spinner"></div>
                    </div>
                );

            default:
                return (
                    <div className="loader-default">
                        <div className="default-spinner">
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                            <div className="spinner-blade"></div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={`loader-container ${fullScreen ? 'loader-fullscreen' : ''}`}>
            <div className="loader-content">
                {renderLoader()}
                {message && <p className="loader-message">{message}</p>}
            </div>
        </div>
    );
};

export default Loader;
