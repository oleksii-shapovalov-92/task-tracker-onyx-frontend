import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  createProject,
  selectCreateProjectErrorMessage,
} from "../slice/projectsSlice";

const ProjectForm = () => {
  const dispatch = useAppDispatch();
  const projectError = useAppSelector(selectCreateProjectErrorMessage);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values) => {
      dispatch(createProject(values));
    },
  });

  return (
    <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div
        className="h-0.5 w-full"
        style={{ background: "linear-gradient(90deg, #ff4da6 0%, #7b3fe4 100%)" }}
        aria-hidden
      />
      <div className="space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">New Project</h1>
        <p className="text-sm text-gray-500">
          Enter the project title and description
        </p>
        {projectError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {projectError}
          </div>
        )}
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Title */}
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
            className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300 ${
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

        {/* Description */}
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
            className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-300 focus:border-purple-300 ${
              formik.touched.description && formik.errors.description
                ? "border-red-500 focus:ring-red-500"
                : "border-input"
            }`}
            placeholder="A Project to develop a new company website"
            rows={4}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-sm text-red-500">{formik.errors.description}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400"
          style={{ background: "linear-gradient(135deg, #ff4da6 0%, #7b3fe4 100%)" }}
        >
          Create Project
        </button>
      </form>
      </div>
    </div>
  );
};

export default ProjectForm;
