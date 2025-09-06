import { createSlice, type PayloadAction, } from "@reduxjs/toolkit";
import { fetchCurrentUser, logoutUser } from "./authThunks";

export interface User {
  id: string;
  name: string;
  email: string;
  application: string;
  approved: boolean;
  mfaEnabled: boolean;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  redirecting: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  isAuthenticated: false,
  redirecting: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Current User
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = action.payload !== null;
        state.redirecting = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.redirecting = true;
      });

    // Logout User
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
