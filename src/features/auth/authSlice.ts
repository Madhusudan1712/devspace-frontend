import { createSlice, type PayloadAction, } from "@reduxjs/toolkit";
import { fetchCurrentUser, getIsAppUserThunk, logoutUser } from "./authThunks";

import type { User } from "../../types/RequestOrResponse";

interface AuthState {
  user: User | null;
  getIsAppUserLoading: boolean;
  IsAppUser: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  redirecting: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  getIsAppUserLoading: false,
  IsAppUser: false,
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

      // getIsSuperAdmin
      builder.addCase(getIsAppUserThunk.pending, (state) => {
          state.getIsAppUserLoading = true;
          state.error = null;
      });
      builder.addCase(getIsAppUserThunk.fulfilled, (state, action) => {
          state.getIsAppUserLoading = false;
          state.IsAppUser = action.payload;
      });
      builder.addCase(getIsAppUserThunk.rejected, (state, action) => {
          state.getIsAppUserLoading = false;
          state.error = typeof action.payload === 'string' ? action.payload : 'Error';
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
