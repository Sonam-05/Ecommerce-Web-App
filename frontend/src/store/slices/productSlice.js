import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
    products: [],
    product: null,
    similarProducts: [],
    loading: false,
    error: null,
    success: false
};

// Fetch all products
export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const queryString = new URLSearchParams(params).toString();
            const { data } = await api.get(`/products?${queryString}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

// Fetch single product
export const fetchProduct = createAsyncThunk(
    'products/fetchOne',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/products/${id}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
        }
    }
);

// Fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
    'products/fetchSimilar',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/products/${id}/similar`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch similar products');
        }
    }
);

// Add review
export const addReview = createAsyncThunk(
    'products/addReview',
    async ({ productId, review }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/products/${productId}/review`, review);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add review');
        }
    }
);

// Create product (Admin)
export const createProduct = createAsyncThunk(
    'products/create',
    async (productData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/products', productData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create product');
        }
    }
);

// Update product (Admin)
export const updateProduct = createAsyncThunk(
    'products/update',
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/products/${id}`, productData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update product');
        }
    }
);

// Delete product (Admin)
export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/products/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        clearProduct: (state) => {
            state.product = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch single product
            .addCase(fetchProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch similar products
            .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
                state.similarProducts = action.payload;
            })
            // Add review
            .addCase(addReview.pending, (state) => {
                state.loading = true;
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
                state.success = true;
            })
            .addCase(addReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create product
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
                state.success = true;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update product
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
                state.success = true;
            })
            // Delete product
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(p => p._id !== action.payload);
                state.success = true;
            });
    }
});

export const { clearError, clearSuccess, clearProduct } = productSlice.actions;
export default productSlice.reducer;
