import { RootState } from "../../app/Store";

export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectRedirecting = (state: RootState) => state.auth.redirecting;
export const selectUser = (state: RootState) => state.auth.user;
