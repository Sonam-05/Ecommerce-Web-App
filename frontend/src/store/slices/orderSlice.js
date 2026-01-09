import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
    orders: [],
    order: null,
    allOrders: [], // For admin
    loading: false,
    error: null,
    success: false
};

// Create order
export const createOrder = createAsyncThunk(
    'orders/create',
    async (orderData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/orders', orderData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create order');
        }
    }
);

// Fetch user orders
export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/orders');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

// Fetch single order
export const fetchOrder = createAsyncThunk(
    'orders/fetchOne',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/orders/${id}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
        }
    }
);

// Fetch all orders (Admin)
export const fetchAllOrders = createAsyncThunk(
    'orders/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/orders/admin/all');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch all orders');
        }
    }
);

// Update order status (Admin)
export const updateOrderStatus = createAsyncThunk(
    'orders/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/orders/${id}/status`, { status });
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
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
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders.unshift(action.payload);
                state.success = true;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch user orders
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch single order
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.order = action.payload;
            })
            // Fetch all orders (Admin)
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.allOrders = action.payload;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update order status
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const index = state.allOrders.findIndex(o => o._id === action.payload._id);
                if (index !== -1) {
                    state.allOrders[index] = action.payload;
                }
                state.success = true;
            });
    }
});

export const { clearError, clearSuccess } = orderSlice.actions;
export default orderSlice.reducer;
