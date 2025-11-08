import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrentUser, getIsAppUser, logoutService } from "../../services/auth/authService";
import type { User } from "../../types/RequestOrResponse";

// fetch current user thunk
export const fetchCurrentUser = createAsyncThunk<User | null, void>(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await getCurrentUser();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch user");
    }
  }
);

export const getIsAppUserThunk = createAsyncThunk(
	'auth/getIsAppUser',
	async (_, { rejectWithValue }) => {
		try {
			return await getIsAppUser();
		} catch (err: any) {
			return rejectWithValue(err.message);
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
