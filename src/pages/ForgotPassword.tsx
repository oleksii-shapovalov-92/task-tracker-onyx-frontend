import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async () => {
      setSubmitted(true);
    },
  });

  if (submitted) {
    return (
      <div className="mx-auto max-w-sm space-y-4 p-6 rounded-lg border bg-white shadow-sm mt-10">
        <h1 className="text-2xl font-semibold tracking-tight text-center">
          Check your email
        </h1>
        <p className="text-sm text-gray-600 text-center">
          If the email exists, we sent a password reset link
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
    );
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 p-6 rounded-lg border bg-white shadow-sm mt-10">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot password
        </h1>
        <p className="text-sm text-gray-500">
          Enter your email and we’ll send you a reset link
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...formik.getFieldProps("email")}
            className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring ${
              formik.touched.email && formik.errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-input"
            }`}
            placeholder="you@example.com"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm text-red-500">{formik.errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Send reset link
        </button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm underline text-gray-600 hover:text-gray-900"
          >
            Back to Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
