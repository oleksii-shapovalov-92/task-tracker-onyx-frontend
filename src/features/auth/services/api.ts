import axiosInstance from "../../../lib/axiosInstance";
import type { Credentials, ROLE, User } from "../types";

const LOGIN_PATH = "/auth/login";
const LOGOUT_PATH = "/auth/logout";
const REGISTER_PATH = "/users/register";
const ME_PATH = "/users/me";

const isRole = (value: unknown): value is ROLE =>
  value === "ROLE_USER" || value === "ROLE_ADMIN";

export const mapApiUser = (raw: Record<string, unknown>): User => {
  const rolesField = raw.roles;
  const roles: ROLE[] | undefined = Array.isArray(rolesField)
    ? rolesField.filter(isRole)
    : undefined;

  const roleFromScalar = raw.role;
  const role: ROLE =
    typeof roleFromScalar === "string" && isRole(roleFromScalar)
      ? roleFromScalar
      : roles?.[0] ?? "ROLE_USER";

  return {
    id: Number(raw.id),
    email: String(raw.email ?? ""),
    role,
    roles: roles && roles.length > 0 ? roles : undefined,
    confirmationResent: Boolean(raw.confirmationResent),
    confirmationStatus:
      raw.confirmationStatus != null
        ? String(raw.confirmationStatus)
        : undefined,
    displayName:
      raw.displayName != null ? String(raw.displayName) : undefined,
    position: raw.position != null ? String(raw.position) : undefined,
    department: raw.department != null ? String(raw.department) : undefined,
    avatarUrl: raw.avatarUrl != null ? String(raw.avatarUrl) : undefined,
    bio: raw.bio != null ? String(raw.bio) : undefined,
  };
};

export const fetchLogin = async (credentials: Credentials) => {
  const res = await axiosInstance.post(LOGIN_PATH, credentials);
  return res.data;
};

export const fetchRegister = async (credentials: Credentials) => {
  const res = await axiosInstance.post(REGISTER_PATH, credentials);
  return res.data;
};

export const fetchCurrentUser = async (): Promise<User> => {
  const res = await axiosInstance.get(ME_PATH);
  return mapApiUser(res.data as Record<string, unknown>);
};

export const fetchLogout = async (): Promise<void> => {
  await axiosInstance.post(LOGOUT_PATH);
};