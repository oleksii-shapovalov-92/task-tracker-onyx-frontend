import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  createProject,
  selectCreateProjectErrorMessage,
  selectIsCreating,
} from "../slice/projectsSlice";

const ProjectForm = () => {
  const dispatch = useAppDispatch();

  const projectError = useAppSelector(selectCreateProjectErrorMessage);
  const isCreating = useAppSelector(selectIsCreating);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await dispatch(createProject(values)).unwrap();
        helpers.resetForm();
      } catch {
        // Error is already stored in Redux and displayed below.
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div
        className="h-0.5 w-full"
        style={{
          background: "linear-gradient(90deg, #ff4da6 0%, #7b3fe4 100%)",
        }}
        aria-hidden
      />

      <div className="space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            New Project
          </h1>

          <p className="text-sm text-gray-500">
            Enter the project title and description
          </p>

          {projectError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {projectError}
            </div>
          )}
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              {...formik.getFieldProps("title")}
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm transition placeholder:text-gray-400 focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-300 ${
                formik.touched.title && formik.errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-input"
              }`}
              placeholder="New Website Development"
            />

            {formik.touched.title && formik.errors.title && (
              <p className="text-sm text-red-500">{formik.errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              {...formik.getFieldProps("description")}
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm transition placeholder:text-gray-400 focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-300 ${
                formik.touched.description && formik.errors.description
                  ? "border-red-500 focus:ring-red-500"
                  : "border-input"
              }`}
              placeholder="A Project to develop a new company website"
              rows={4}
            />

            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-red-500">
                {formik.errors.description}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isCreating || formik.isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #ff4da6 0%, #7b3fe4 100%)",
            }}
          >
            {isCreating ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
