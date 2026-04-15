import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
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
  const [isEditing, setIsEditing] = useState(false);
  const emptyForm = {
    displayName: "",
    position: "",
    department: "",
    avatarUrl: "",
    bio: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(emptyForm);

  useEffect(() => {
    if (!isAuthenticated || user) return;
    void dispatch(loadProfile())
      .unwrap()
      .catch(() => setLoadFailed(true));
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    if (!user) return;
    const values = {
      displayName: user.displayName ?? "",
      position: user.position ?? "",
      department: user.department ?? "",
      avatarUrl: user.avatarUrl ?? "",
      bio: user.bio ?? "",
    };
    setForm(values);
    setSaved(values);
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className={cardClass}>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-gray-500">
            Sign in to view your profile information
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
            We could not load your profile from the server
          </p>
        </div>
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200 text-left">
          Ensure the backend exposes{" "}
          <code className="rounded bg-white px-1 py-0.5 text-xs font-mono text-red-900">
            GET /api/v1/users/me
          </code>{" "}
          for authenticated requests, then try again
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
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-gray-500">
            {isEditing ? "Edit mode" : "Your account"}
          </p>
        </div>
        {!isEditing ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setSaved(form);
                setIsEditing(false);
              }}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setForm(saved);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {form.avatarUrl ? (
          <img
            src={form.avatarUrl}
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
          <div className="space-y-1 border-b border-gray-100 pb-4">
            <p className="block text-sm font-medium text-gray-700">
              Display name
            </p>
            {isEditing ? (
              <Input
                value={form.displayName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, displayName: e.target.value }))
                }
                placeholder="Your name"
              />
            ) : (
              <p className="text-sm text-gray-900">{dash(form.displayName)}</p>
            )}
          </div>

          {row("Email", dash(user.email))}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1 border-b border-gray-100 pb-4 sm:border-0 sm:pb-0">
              <p className="block text-sm font-medium text-gray-700">
                Position
              </p>
              {isEditing ? (
                <Input
                  value={form.position}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, position: e.target.value }))
                  }
                  placeholder="e.g. Developer"
                />
              ) : (
                <p className="text-sm text-gray-900">{dash(form.position)}</p>
              )}
            </div>
            <div className="space-y-1 border-b border-gray-100 pb-4 sm:border-0 sm:pb-0">
              <p className="block text-sm font-medium text-gray-700">
                Department
              </p>
              {isEditing ? (
                <Input
                  value={form.department}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, department: e.target.value }))
                  }
                  placeholder="e.g. Frontend"
                />
              ) : (
                <p className="text-sm text-gray-900">{dash(form.department)}</p>
              )}
            </div>
          </div>

          <div className="space-y-1 border-b border-gray-100 pb-4">
            <p className="block text-sm font-medium text-gray-700">
              Avatar URL
            </p>
            {isEditing ? (
              <Input
                value={form.avatarUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, avatarUrl: e.target.value }))
                }
              />
            ) : null}
          </div>

          <div className="space-y-1 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <p className="block text-sm font-medium text-gray-700">Bio</p>
            {isEditing ? (
              <Textarea
                rows={4}
                value={form.bio}
                onChange={(e) =>
                  setForm((p) => ({ ...p, bio: e.target.value }))
                }
                placeholder="Tell something about yourself"
              />
            ) : (
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {dash(form.bio)}
              </p>
            )}
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
              <p className="text-sm text-gray-900">{confirmationStatusLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
