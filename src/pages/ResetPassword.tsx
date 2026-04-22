import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const CARD = "mx-auto mt-10 max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm";
const ACCENT = "h-0.5 w-full";
const ACCENT_STYLE = { background: "linear-gradient(90deg, #ff4da6 0%, #7b3fe4 100%)" };

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async () => {
      setSuccess(true);
    },
  });

  if (!token) {
    return (
      <div className={CARD}>
        <div className={ACCENT} style={ACCENT_STYLE} aria-hidden />
        <div className="space-y-4 p-6">
          <h1 className="text-2xl font-semibold tracking-tight text-center">
            Reset password
          </h1>
          <p className="text-sm text-gray-600 text-center">
            Missing or invalid token.
          </p>
          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm underline text-gray-600 hover:text-gray-900"
            >
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={CARD}>
        <div className={ACCENT} style={ACCENT_STYLE} aria-hidden />
        <div className="space-y-4 p-6">
          <p className="text-center text-sm text-gray-800">
            Password updated successfully. You can sign in now.
          </p>
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm underline text-gray-600 hover:text-gray-900"
            >
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={CARD}>
      <div className={ACCENT} style={ACCENT_STYLE} aria-hidden />
      <div className="space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset password
          </h1>
          <p className="text-sm text-gray-500">Enter your new password.</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              {...formik.getFieldProps("newPassword")}
              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300 ${
                formik.touched.newPassword && formik.errors.newPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-input"
              }`}
              placeholder="••••••••"
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="text-sm text-red-500">{formik.errors.newPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400"
            style={{
              background: "linear-gradient(135deg, #ff4da6 0%, #7b3fe4 100%)",
            }}
          >
            Update password
          </button>
        </form>
      </div>
    </div>
  );
}
