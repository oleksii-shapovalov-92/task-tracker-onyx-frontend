import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { removeTask } from "../features/tasks/slice/tasksSlice";
import {
  getProjectById,
  getProjectTasks,
  removeProjectTask,
  selectIsSelectedProjectLoading,
  selectIsSelectedProjectTasksLoading,
  selectSelectedProject,
  selectSelectedProjectErrorMessage,
  selectSelectedProjectTasks,
  selectSelectedProjectTasksErrorMessage,
} from "../features/projects/slice/projectsSlice";
import type { ProjectTaskStatus } from "../features/projects/types";


const taskStatusLabels: Record<ProjectTaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  BLOCKED: "Blocked",
  DONE: "Done",
};

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();

  const project = useAppSelector(selectSelectedProject);
  const isLoading = useAppSelector(selectIsSelectedProjectLoading);
  const errorMessage = useAppSelector(selectSelectedProjectErrorMessage);

  const tasks = useAppSelector(selectSelectedProjectTasks);
  const isTasksLoading = useAppSelector(selectIsSelectedProjectTasksLoading);
  const tasksErrorMessage = useAppSelector(
    selectSelectedProjectTasksErrorMessage,
  );

  useEffect(() => {
    if (!projectId) return;

    dispatch(getProjectById(projectId));
    dispatch(getProjectTasks(projectId));
  }, [dispatch, projectId]);
  const handleDeleteTask = async (taskId: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!isConfirmed) return;

    try {
      await dispatch(removeTask(taskId));
      dispatch(removeProjectTask(taskId));
    } catch (error) {
      alert("Failed to delete task");
    }
  };

  if (!projectId) {
    return (
      <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-red-700">
          Invalid project route
        </h1>
        <p className="mt-2 text-sm text-red-700">
          Project id is missing from the URL.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-gray-700">Loading project...</p>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we fetch project details.
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-red-700">
          Failed to load project
        </h1>

        <p className="mt-2 text-sm text-red-700">{errorMessage}</p>

        <div className="mt-6">
          <Link
            to="/projects"
            className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <section className="mx-auto mt-10 max-w-5xl">
      <Link
        to="/projects"
        className="mb-5 inline-flex text-sm font-medium text-purple-700 hover:underline"
      >
        ← Back to projects
      </Link>

      <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div
          className="h-1 w-full"
          style={{
            background: "linear-gradient(90deg, #ff4da6 0%, #7b3fe4 100%)",
          }}
          aria-hidden
        />

        <div className="space-y-6 p-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Project details</p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
              {project.title}
            </h1>
          </div>

          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <h2 className="text-sm font-semibold text-gray-900">Description</h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {project.description || "No description provided."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-100 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Project ID
              </p>

              <p className="mt-2 break-all text-sm text-gray-900">
                {project.id}
              </p>
            </div>

            <div className="rounded-lg border border-gray-100 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Owner
              </p>

              <p className="mt-2 break-all text-sm text-gray-900">
                {project.owner?.email || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </article>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">
              Project tasks
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Tasks connected with this project are displayed here.
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {tasks.length} task{tasks.length === 1 ? "" : "s"}
          </span>
        </div>

        {isTasksLoading ? (
          <div className="mt-5 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
            Loading project tasks...
          </div>
        ) : tasksErrorMessage ? (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {tasksErrorMessage}
          </div>
        ) : tasks.length === 0 ? (
          <div className="mt-5 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
            No tasks yet. Create tasks for this project to see them here.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {tasks.map((task) => (
              <article
                key={task.id}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4 transition hover:border-purple-200 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {task.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="shrink-0 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                      {taskStatusLabels[task.status]}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-xs font-medium text-red-600 transition hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {task.description || "No description provided."}
                </p>

                <p className="mt-4 break-all text-xs text-gray-400">
                  ID: {task.id}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
