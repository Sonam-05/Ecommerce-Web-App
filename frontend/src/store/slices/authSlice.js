import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Get user from localStorage
const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

const initialState = {
    userInfo,
    loading: false,
    error: null,
    success: false
};

// Register user
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            localStorage.setItem('userInfo', JSON.stringify(data.data));
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

// Login user
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/login', credentials);
            localStorage.setItem('userInfo', JSON.stringify(data.data));
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('userInfo');
    return null;
});

// Get user profile
export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/users/profile');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

// Update user profile
export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const { data } = await api.put('/users/profile', profileData);

            // Update localStorage
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const updatedUserInfo = { ...userInfo, ...data.data };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
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
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                state.success = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                state.success = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.userInfo = null;
                state.loading = false;
                state.error = null;
            })
            // Get Profile
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = { ...state.userInfo, ...action.payload };
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = { ...state.userInfo, ...action.payload };
                state.success = true;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
