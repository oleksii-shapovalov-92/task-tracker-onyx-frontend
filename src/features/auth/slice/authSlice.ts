import { createAppSlice } from "../../../app/createAppSlice";
import type {
  AuthSliceState,
  Credentials,
  User,
  UserRegistrationDto,
} from "../types";
import * as api from "../services/api";
import { isAxiosError } from "axios";
import { authAccessToken } from "../../../lib/authAccessToken";

const readAccessTokenFromPayload = (payload: unknown): string | undefined => {
  if (payload == null || typeof payload !== "object") {
    return undefined;
  }
  const p = payload as Record<string, unknown>;
  if (typeof p.accessToken === "string" && p.accessToken.length > 0) {
    return p.accessToken;
  }
  if (typeof p.access_token === "string" && p.access_token.length > 0) {
    return p.access_token;
  }
  const nested = p.data;
  if (nested && typeof nested === "object") {
    const d = nested as Record<string, unknown>;
    if (typeof d.accessToken === "string" && d.accessToken.length > 0) {
      return d.accessToken;
    }
    if (typeof d.access_token === "string" && d.access_token.length > 0) {
      return d.access_token;
    }
  }
  return undefined;
};

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
              err.response?.data?.message || "Internal Server Error"
            );
          }
        });
      },
      {
        pending: (state) => {
          state.isAuthenticated = false;
          state.accessToken = undefined;
          authAccessToken.set(undefined);
        },
        fulfilled: (state, action) => {
          state.isAuthenticated = true;
          state.loginErrorMessage = undefined;
          const token = readAccessTokenFromPayload(action.payload);
          state.accessToken = token;
          authAccessToken.set(token);
          const parsed = userFromLoginPayload(action.payload);
          if (parsed) {
            state.user = parsed;
          }
        },
        rejected: (state, action) => {
          state.isAuthenticated = false;
          state.user = undefined;
          state.accessToken = undefined;
          authAccessToken.set(undefined);
          console.log(action.error);
          state.loginErrorMessage = action.error.message;
        },
      }
    ),

    loadProfile: create.asyncThunk(
      async (_, { getState }) => {
        const auth = (
          getState() as { auth?: { accessToken?: string } }
        ).auth;
        authAccessToken.set(auth?.accessToken);
        return api.fetchCurrentUser();
      },
      {
        fulfilled: (state, action) => {
          state.user = action.payload;
        },
      }
    ),

    register: create.asyncThunk(
      async (dto: UserRegistrationDto) => {
        return api.fetchRegister(dto);
      },
      {
        pending: (state) => {
          state.isAuthenticated = false;
          state.accessToken = undefined;
          authAccessToken.set(undefined);
        },
        fulfilled: (state, action) => {
          state.isAuthenticated = true;
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
          state.user = undefined;
          state.accessToken = undefined;
          authAccessToken.set(undefined);
        },
      }
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectUser: (state) => state.user,
    selectRole: (state) => state.user?.role,
    selectLoginError: (state) => state?.loginErrorMessage,
  },
});

// // Action creators are generated for each case reducer function.
export const { login, register, loadProfile } = authSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
  selectIsAuthenticated,
  selectUser,
  selectRole,
  selectLoginError,
} = authSlice.selectors;
