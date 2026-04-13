import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  loadProfile,
  selectIsAuthenticated,
  selectUser,
} from "../features/auth/slice/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

const dash = (value: string | undefined) =>
  value && value.trim().length > 0 ? value : "—";

const cardClass =
  "mx-auto max-w-md space-y-6 p-6 rounded-lg border bg-white shadow-sm mt-10";

const Profile = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user) {
      return;
    }
    void dispatch(loadProfile())
      .unwrap()
      .catch(() => setLoadFailed(true));
  }, [dispatch, isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className={cardClass}>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-gray-500">
            Sign in to view your profile information.
          </p>
        </div>
        <div className="text-center">
          <Link
            to="/login"
            state={{ from: location.pathname }}
            className="inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (!user && !loadFailed) {
    return (
      <div className={cardClass}>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-gray-500">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (!user && loadFailed) {
    return (
      <div className={cardClass}>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-gray-500">
            We could not load your profile from the server.
          </p>
        </div>
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200 text-left">
          Ensure the backend exposes{" "}
          <code className="rounded bg-white px-1 py-0.5 text-xs font-mono text-red-900">
            GET /api/v1/users/me
          </code>{" "}
          for authenticated requests, then try again.
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const rolesLabel =
    user.roles && user.roles.length > 0 ? user.roles.join(", ") : user.role;

  const confirmationStatusLabel =
    user.confirmationStatus && user.confirmationStatus.trim().length > 0
      ? user.confirmationStatus
      : user.confirmationResent
        ? "Resent"
        : "—";

  const row = (label: string, value: string) => (
    <div className="space-y-1 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <p className="block text-sm font-medium text-gray-700">{label}</p>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className={cardClass}>
      <div className="space-y-2 text-center border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-gray-500">Your account (read-only)</p>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="h-24 w-24 shrink-0 rounded-full border border-gray-200 object-cover"
          />
        ) : (
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-400"
            aria-hidden
          >
            No avatar
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-4 text-left w-full">
          {row("Display name", dash(user.displayName))}
          {row("Email", dash(user.email))}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1 border-b border-gray-100 pb-4 sm:border-0 sm:pb-0">
              <p className="block text-sm font-medium text-gray-700">
                Position
              </p>
              <p className="text-sm text-gray-900">{dash(user.position)}</p>
            </div>
            <div className="space-y-1 border-b border-gray-100 pb-4 sm:border-0 sm:pb-0">
              <p className="block text-sm font-medium text-gray-700">
                Department
              </p>
              <p className="text-sm text-gray-900">{dash(user.department)}</p>
            </div>
          </div>
          <div className="space-y-1 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <p className="block text-sm font-medium text-gray-700">Bio</p>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {dash(user.bio)}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="block text-sm font-medium text-gray-700">Roles</p>
              <p className="text-sm text-gray-900">{rolesLabel}</p>
            </div>
            <div className="space-y-1">
              <p className="block text-sm font-medium text-gray-700">
                Confirmation status
              </p>
              <p className="text-sm text-gray-900">
                {confirmationStatusLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
