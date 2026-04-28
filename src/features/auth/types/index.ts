// for login
export interface Credentials {
  email: string;
  password: string;
}

export interface UserRegistrationDto {
  email: string;
  password: string;
}

export type ROLE = "ROLE_USER" | "ROLE_ADMIN";

export interface User {
  id: number;
  email: string;
  role: ROLE;
  roles?: ROLE[];
  confirmationResent: boolean;
  confirmationStatus?: string;
  displayName?: string;
  position?: string;
  department?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface LoginTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSliceState {
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  user?: User;
  accessToken?: string;
  loginErrorMessage?: string;
}
