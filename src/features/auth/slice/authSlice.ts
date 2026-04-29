import { createAppSlice } from "../../../app/createAppSlice";
import type {
  AuthSliceState,
  Credentials,
  User,
  UserRegistrationDto,
} from "../types";
import * as api from "../services/api";
import { isAxiosError } from "axios";

const userFromLoginPayload = (payload: unknown): User | undefined => {
  if (payload == null || typeof payload !== "object") {
    return undefined;
  }
  const data = payload as Record<string, unknown>;
  const nested = data.user;
  if (nested && typeof nested === "object") {
    return api.mapApiUser(nested as Record<string, unknown>);
  }
  if (data.id != null && data.email != null) {
    return api.mapApiUser(data);
  }
  return undefined;
};

const initialState: AuthSliceState = {
  isAuthenticated: false,
  isAuthChecked: false,
  user: undefined,
};

export const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: (create) => ({
    login: create.asyncThunk(
      async (credentials: Credentials) => {
        return api.fetchLogin(credentials).catch((err) => {
          if (isAxiosError(err)) {
            throw new Error(
              err.response?.data?.message || "Internal Server Error",
            );
          }

          throw err;
        });
      },
      {
        pending: (state) => {
          state.isAuthenticated = false;
          state.isAuthChecked = true;
          state.user = undefined;
          state.accessToken = undefined;
          state.loginErrorMessage = undefined;
        },
        fulfilled: (state, action) => {
          state.isAuthenticated = true;
          state.isAuthChecked = true;
          state.loginErrorMessage = undefined;
          state.accessToken = undefined;

          const parsed = userFromLoginPayload(action.payload);
          if (parsed) {
            state.user = parsed;
          }
        },
        rejected: (state, action) => {
          state.isAuthenticated = false;
          state.isAuthChecked = true;
          state.user = undefined;
          state.accessToken = undefined;
          state.loginErrorMessage = action.error.message;
        },
      },
    ),

    loadProfile: create.asyncThunk(
      async () => {
        return api.fetchCurrentUser();
      },
      {
        fulfilled: (state, action) => {
          state.isAuthenticated = true;
          state.isAuthChecked = true;
          state.user = action.payload;
          state.accessToken = undefined;
          state.loginErrorMessage = undefined;
        },
        rejected: (state) => {
          state.isAuthenticated = false;
          state.isAuthChecked = true;
          state.user = undefined;
          state.accessToken = undefined;
        },
      },
    ),

    register: create.asyncThunk(
      async (dto: UserRegistrationDto) => {
        return api.fetchRegister(dto);
      },
      {
        pending: (state) => {
          state.isAuthenticated = false;
          state.isAuthChecked = true;
          state.user = undefined;
          state.accessToken = undefined;
          state.loginErrorMessage = undefined;
        },
        fulfilled: (state, action) => {
          state.isAuthenticated = false;
          state.isAuthChecked = true;
          state.user = undefined;
          state.accessToken = undefined;
          state.loginErrorMessage = undefined;

          const payload = action.payload;

          if (payload && typeof payload === "object") {
            const raw = payload as Record<string, unknown>;

            if (raw.id != null && raw.email != null) {
              state.user = api.mapApiUser(raw);
            }
          }
        },
        rejected: (state) => {
          state.isAuthenticated = false;
          state.isAuthChecked = true;
          state.user = undefined;
          state.accessToken = undefined;
        },
      },
    ),

    logout: create.asyncThunk(
      async () => {
        await api.fetchLogout();
      },
      {
        fulfilled: (state) => {
          state.isAuthenticated = false;
          state.isAuthChecked = true;
          state.user = undefined;
          state.accessToken = undefined;
          state.loginErrorMessage = undefined;
        },
        rejected: (state) => {
          // Even if backend logout request fails, frontend auth state should be cleared.
          // User clicked Sign out, so UI must not keep him visually logged in.
          state.isAuthenticated = false;
          state.isAuthChecked = true;
          state.user = undefined;
          state.accessToken = undefined;
          state.loginErrorMessage = undefined;
        },
      },
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectUser: (state) => state.user,
    selectRole: (state) => state.user?.role,
    selectLoginError: (state) => state?.loginErrorMessage,
    selectIsAuthChecked: (state) => state.isAuthChecked,
  },
});

// // Action creators are generated for each case reducer function.
export const { login, register, loadProfile, logout } = authSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
  selectIsAuthenticated,
  selectIsAuthChecked,
  selectUser,
  selectRole,
  selectLoginError,
} = authSlice.selectors;
