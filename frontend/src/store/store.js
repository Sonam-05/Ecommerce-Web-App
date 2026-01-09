import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import orderReducer from './slices/orderSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        categories: categoryReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        orders: orderReducer,
        notifications: notificationReducer
    }
});

export default store;
