import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
    items: [],
    loading: false,
    error: null
};

// Fetch cart
export const fetchCart = createAsyncThunk(
    'cart/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/cart');
            return data.data.items;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
        }
    }
);

// Add to cart
export const addToCart = createAsyncThunk(
    'cart/add',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/cart', { productId, quantity });
            return data.data.items;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
        }
    }
);

// Update cart item
export const updateCartItem = createAsyncThunk(
    'cart/update',
    async ({ itemId, quantity }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/cart/${itemId}`, { quantity });
            return data.data.items;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
        }
    }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
    'cart/remove',
    async (itemId, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/cart/${itemId}`);
            return data.data.items;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
        }
    }
);

// Clear cart
export const clearCart = createAsyncThunk(
    'cart/clear',
    async (_, { rejectWithValue }) => {
        try {
            await api.delete('/cart');
            return [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add to cart
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Update cart item
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            // Remove from cart
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            // Clear cart
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
            });
    }
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
