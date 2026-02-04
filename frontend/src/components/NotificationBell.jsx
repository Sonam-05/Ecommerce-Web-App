import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead, markAllAsRead } from '../store/slices/notificationSlice';
import './NotificationBell.css';

const NotificationBell = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dispatch = useDispatch();
    const { notifications, unreadCount } = useSelector((state) => state.notifications);
    const dropdownRef = useRef(null);

    const handleMarkAsRead = (id) => {
        dispatch(markAsRead(id));
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllAsRead());
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const formatTime = (date) => {
        const now = new Date();
        const notifDate = new Date(date);
        const diff = Math.floor((now - notifDate) / 1000); // seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div className="notification-bell" ref={dropdownRef}>
            <button
                className="bell-button"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>

            {showDropdown && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h4>Notifications</h4>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead} className="mark-all-btn">
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="no-notifications">
                                <p>No notifications</p>
                            </div>
                        ) : (
                            notifications.slice(0, 10).map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                    onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                                >
                                    <div className="notification-content">
                                        <p>{notification.message}</p>
                                        <span className="notification-time">{formatTime(notification.createdAt)}</span>
                                    </div>
                                    {!notification.isRead && <div className="unread-dot"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
