import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  getAllProjects,
  selectErrorMessage,
  selectIsLoading,
  selectProjects,
} from "../slice/projectsSlice";
import ProjectCard from "./ProjectCard";

export default function ProjectsList() {
  const dispatch = useAppDispatch();

  const projects = useAppSelector(selectProjects);
  const isLoading = useAppSelector(selectIsLoading);
  const errorMessage = useAppSelector(selectErrorMessage);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  if (isLoading) {
    return (
      <section className="mx-auto mt-8 max-w-6xl">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-700">
            Loading projects...
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we fetch your projects.
          </p>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="mx-auto mt-8 max-w-6xl">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-red-700">
            Failed to load projects
          </h2>
          <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
          <button
            type="button"
            onClick={() => dispatch(getAllProjects())}
            className="mt-5 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
            style={{
              background: "linear-gradient(135deg, #ff4da6 0%, #7b3fe4 100%)",
            }}
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="mx-auto mt-8 max-w-6xl">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            No projects yet
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Create your first project using the form above.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-8 max-w-6xl">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Projects
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Select a project to open its details.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
