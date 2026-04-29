import { useFormik } from "formik";
import * as Yup from "yup";
import { register } from "../slice/authSlice";
import { useAppDispatch } from "../../../app/hooks";
import { useState } from "react";

const RegistrationForm = () => {
  const dispatch = useAppDispatch();
  const [successMessage, setSuccessMessage] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      console.log("registration");
      const dispatchResult = await dispatch(register(values));
      if (register.fulfilled.match(dispatchResult)) {
        setSuccessMessage("Check your email to confirm registration");
        formik.resetForm();
      }
    },
  });

  return (
    <div className="mx-auto mt-10 max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div
        className="h-0.5 w-full"
        style={{ background: "linear-gradient(90deg, #ff4da6 0%, #7b3fe4 100%)" }}
        aria-hidden
      />
      <div className="space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground text-gray-500">
          Enter your email and password to register
          {successMessage && (
              <p className="text-sm font-medium text-green-600">
                {successMessage}
              </p>
          )}
        </p>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Email Field */}
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
            className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300 ${
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

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...formik.getFieldProps("password")}
            className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300 ${
              formik.touched.password && formik.errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-input"
            }`}
            placeholder="••••••••"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-sm text-red-500">{formik.errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400"
          style={{
            background: "linear-gradient(135deg, #ff4da6 0%, #7b3fe4 100%)",
          }}
        >
          Register
        </button>
      </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
