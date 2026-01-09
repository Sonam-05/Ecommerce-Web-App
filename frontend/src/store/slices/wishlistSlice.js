import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
    products: [],
    loading: false,
    error: null
};

// Fetch wishlist
export const fetchWishlist = createAsyncThunk(
    'wishlist/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/wishlist');
            return data.data?.products || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
        }
    }
);

// Add to wishlist
export const addToWishlist = createAsyncThunk(
    'wishlist/add',
    async (productId, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/wishlist', { productId });
            return data.data?.products || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
        }
    }
);

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
    'wishlist/remove',
    async (productId, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/wishlist/${productId}`);
            return data.data?.products || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch wishlist
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add to wishlist
            .addCase(addToWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove from wishlist
            .addCase(removeFromWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
