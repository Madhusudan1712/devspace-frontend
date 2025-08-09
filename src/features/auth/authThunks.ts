import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser, logoutService } from "../../services/auth/authService";
import type { User } from "./authSlice";

// fetch current user thunk
export const fetchCurrentUser = createAsyncThunk<User>(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error) {
      return rejectWithValue("Unauthorized");
    }
  }
);

// logout thunk
export const logoutUser = createAsyncThunk<void>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await logoutService();
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);
