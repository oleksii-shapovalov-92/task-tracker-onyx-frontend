import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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

const BIO_MAX = 500;

const dash = (value: string | undefined) =>
  value && value.trim().length > 0 ? value : "—";

const cardClass =
  "mx-auto max-w-md space-y-6 p-6 rounded-lg border bg-white shadow-sm mt-10";

const profileValidationSchema = Yup.object({
  displayName: Yup.string().required("Display name is required"),
  position: Yup.string().required("Position is required"),
  department: Yup.string().required("Department is required"),
  avatarUrl: Yup.string().url("Must be a valid URL").optional(),
  bio: Yup.string().max(BIO_MAX, `Max ${BIO_MAX} characters`).optional(),
});

const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your new password"),
});

const Profile = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      displayName: user?.displayName ?? "",
      position: user?.position ?? "",
      department: user?.department ?? "",
      avatarUrl: user?.avatarUrl ?? "",
      bio: user?.bio ?? "",
    },
    validationSchema: profileValidationSchema,
    onSubmit: () => {
      setIsEditing(false);
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordValidationSchema,
    onSubmit: (_values, helpers) => {
      setPasswordSuccess(true);
      helpers.resetForm();
    },
  });

  useEffect(() => {
    if (!isAuthenticated || user) return;
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
    <div className="space-y-6">
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
                onClick={() => formik.handleSubmit()}
                disabled={!formik.isValid}
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  formik.resetForm();
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {formik.values.avatarUrl ? (
            <img
              src={formik.values.avatarUrl}
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
                  name="displayName"
                  value={formik.values.displayName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Your name"
                  error={formik.touched.displayName ? formik.errors.displayName : undefined}
                />
              ) : (
                <p className="text-sm text-gray-900">{dash(formik.values.displayName)}</p>
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
                    name="position"
                    value={formik.values.position}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. Developer"
                    error={formik.touched.position ? formik.errors.position : undefined}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{dash(formik.values.position)}</p>
                )}
              </div>
              <div className="space-y-1 border-b border-gray-100 pb-4 sm:border-0 sm:pb-0">
                <p className="block text-sm font-medium text-gray-700">
                  Department
                </p>
                {isEditing ? (
                  <Input
                    name="department"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. Frontend"
                    error={formik.touched.department ? formik.errors.department : undefined}
                  />
                ) : (
                  <p className="text-sm text-gray-900">{dash(formik.values.department)}</p>
                )}
              </div>
            </div>

            <div className="space-y-1 border-b border-gray-100 pb-4">
              <p className="block text-sm font-medium text-gray-700">
                Avatar URL
              </p>
              {isEditing ? (
                <Input
                  name="avatarUrl"
                  value={formik.values.avatarUrl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="https://example.com/photo.jpg"
                  error={formik.touched.avatarUrl ? formik.errors.avatarUrl : undefined}
                />
              ) : null}
            </div>

            <div className="space-y-1 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <p className="block text-sm font-medium text-gray-700">Short bio</p>
              {isEditing ? (
                <div className="space-y-1">
                  <Textarea
                    name="bio"
                    rows={4}
                    maxLength={BIO_MAX}
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Tell us a little about yourself"
                    error={formik.touched.bio ? formik.errors.bio : undefined}
                  />
                  <p className="text-right text-xs text-gray-400">
                    {formik.values.bio.length} / {BIO_MAX}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {dash(formik.values.bio)}
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

      <div className={cardClass}>
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-xl font-semibold tracking-tight">Change password</h2>
          <p className="text-sm text-gray-500 mt-1">Update your account password</p>
        </div>

        <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
          {passwordSuccess && (
            <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              Password updated successfully
            </div>
          )}

          <div className="space-y-1">
            <p className="block text-sm font-medium text-gray-700">Current password</p>
            <Input
              type="password"
              name="currentPassword"
              value={passwordFormik.values.currentPassword}
              onChange={(e) => {
                setPasswordSuccess(false);
                passwordFormik.handleChange(e);
              }}
              onBlur={passwordFormik.handleBlur}
              placeholder="Enter current password"
              error={passwordFormik.touched.currentPassword ? passwordFormik.errors.currentPassword : undefined}
            />
          </div>

          <div className="space-y-1">
            <p className="block text-sm font-medium text-gray-700">New password</p>
            <Input
              type="password"
              name="newPassword"
              value={passwordFormik.values.newPassword}
              onChange={(e) => {
                setPasswordSuccess(false);
                passwordFormik.handleChange(e);
              }}
              onBlur={passwordFormik.handleBlur}
              placeholder="Enter new password"
              error={passwordFormik.touched.newPassword ? passwordFormik.errors.newPassword : undefined}
            />
          </div>

          <div className="space-y-1">
            <p className="block text-sm font-medium text-gray-700">Confirm new password</p>
            <Input
              type="password"
              name="confirmPassword"
              value={passwordFormik.values.confirmPassword}
              onChange={(e) => {
                setPasswordSuccess(false);
                passwordFormik.handleChange(e);
              }}
              onBlur={passwordFormik.handleBlur}
              placeholder="Repeat new password"
              error={passwordFormik.touched.confirmPassword ? passwordFormik.errors.confirmPassword : undefined}
            />
          </div>

          <Button
            type="submit"
            size="sm"
            disabled={!passwordFormik.isValid || !passwordFormik.dirty}
          >
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
