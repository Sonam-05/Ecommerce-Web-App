import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
    categories: [],
    category: null,
    loading: false,
    error: null,
    success: false
};

// Fetch all categories
export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/categories');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

// Create category (Admin)
export const createCategory = createAsyncThunk(
    'categories/create',
    async (categoryData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/categories', categoryData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create category');
        }
    }
);

// Update category (Admin)
export const updateCategory = createAsyncThunk(
    'categories/update',
    async ({ id, categoryData }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/categories/${id}`, categoryData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update category');
        }
    }
);

// Delete category (Admin)
export const deleteCategory = createAsyncThunk(
    'categories/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/categories/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch categories
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create category
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
                state.success = true;
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update category
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
                state.success = true;
            })
            // Delete category
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(c => c._id !== action.payload);
                state.success = true;
            });
    }
});

export const { clearError, clearSuccess } = categorySlice.actions;
export default categorySlice.reducer;
