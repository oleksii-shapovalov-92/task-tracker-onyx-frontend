import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import { editTask, removeTask } from "../features/tasks/slice/tasksSlice";
import {
  deleteProject,
  selectDeleteProjectErrorMessage,
  selectIsDeleting,
  createProjectTask,
  getProjectById,
  getProjectTasks,
  removeProjectTask,
  selectCreateProjectTaskErrorMessage,
  selectIsCreatingTask,
  selectIsSelectedProjectLoading,
  selectIsSelectedProjectTasksLoading,
  selectSelectedProject,
  selectSelectedProjectErrorMessage,
  selectSelectedProjectTasks,
  selectSelectedProjectTasksErrorMessage,
  updateProject,
  updateProjectTaskStatus,
  selectIsUpdatingProject,
  selectIsUpdatingTaskStatus,
  selectUpdateProjectErrorMessage,
  selectUpdateTaskStatusErrorMessage,
} from "../features/projects/slice/projectsSlice";
import type { ProjectTaskStatus } from "../features/projects/types";

const taskStatusLabels: Record<ProjectTaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  BLOCKED: "Blocked",
  DONE: "Done",
};


const taskStatusColumns: ProjectTaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "BLOCKED",
  "DONE",
];

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskTitleError, setTaskTitleError] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskError, setEditTaskError] = useState("");
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editProjectTitle, setEditProjectTitle] = useState("");
  const [editProjectDescription, setEditProjectDescription] = useState("");
  const [editProjectError, setEditProjectError] = useState("");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] =
    useState<ProjectTaskStatus | null>(null);

  const project = useAppSelector(selectSelectedProject);
  const isLoading = useAppSelector(selectIsSelectedProjectLoading);
  const errorMessage = useAppSelector(selectSelectedProjectErrorMessage);

  const tasks = useAppSelector(selectSelectedProjectTasks);
  const isTasksLoading = useAppSelector(selectIsSelectedProjectTasksLoading);
  const tasksErrorMessage = useAppSelector(
    selectSelectedProjectTasksErrorMessage,
  );

  const isCreatingTask = useAppSelector(selectIsCreatingTask);
  const createTaskErrorMessage = useAppSelector(
    selectCreateProjectTaskErrorMessage,
  );

  const isUpdatingTaskStatus = useAppSelector(selectIsUpdatingTaskStatus);
  const updateTaskStatusErrorMessage = useAppSelector(
    selectUpdateTaskStatusErrorMessage,
  );
  const isDeleting = useAppSelector(selectIsDeleting);
  const deleteProjectErrorMessage = useAppSelector(
    selectDeleteProjectErrorMessage,
  );

  const isUpdatingProject = useAppSelector(selectIsUpdatingProject);

  const updateProjectErrorMessage = useAppSelector(
    selectUpdateProjectErrorMessage,
  );

  useEffect(() => {
    if (!projectId) return;

    dispatch(getProjectById(projectId));
    dispatch(getProjectTasks(projectId));
  }, [dispatch, projectId]);

  const handleCreateTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!projectId) return;

    const trimmedTitle = taskTitle.trim();
    const trimmedDescription = taskDescription.trim();

    if (!trimmedTitle) {
      setTaskTitleError("Task title is required.");
      return;
    }

    setTaskTitleError("");

    try {
      await dispatch(
        createProjectTask({
          title: trimmedTitle,
          description: trimmedDescription || undefined,
          projectId,
        }),
      ).unwrap();

      setTaskTitle("");
      setTaskDescription("");
    } catch {
      // Error is shown from Redux state below the form.
    }
  };
  const handleOpenEditModal = (
    taskId: string,
    title: string,
    description?: string,
  ) => {
    setEditingTaskId(taskId);
    setEditTaskTitle(title);
    setEditTaskDescription(description || "");
    setEditTaskError("");
  };

  const handleCloseEditModal = () => {
    setEditingTaskId(null);
    setEditTaskTitle("");
    setEditTaskDescription("");
    setEditTaskError("");
  };

  const handleOpenEditProjectModal = () => {
    if (!project) return;

    setEditProjectTitle(project.title);
    setEditProjectDescription(project.description || "");
    setEditProjectError("");
    setIsEditProjectModalOpen(true);
  };

  const handleCloseEditProjectModal = () => {
    setIsEditProjectModalOpen(false);
    setEditProjectTitle("");
    setEditProjectDescription("");
    setEditProjectError("");
  };

  const handleEditProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!projectId) return;

    const trimmedTitle = editProjectTitle.trim();
    const trimmedDescription = editProjectDescription.trim();

    if (!trimmedTitle) {
      setEditProjectError("Project title is required.");
      return;
    }

    try {
      await dispatch(
        updateProject({
          projectId,
          dto: {
            title: trimmedTitle,
            description: trimmedDescription,
          },
        }),
      ).unwrap();

      handleCloseEditProjectModal();
    } catch {
      setEditProjectError("Failed to update project.");
    }
  };

  const handleEditTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingTaskId) return;

    const trimmedTitle = editTaskTitle.trim();
    const trimmedDescription = editTaskDescription.trim();

    if (!trimmedTitle) {
      setEditTaskError("Task title is required.");
      return;
    }

    try {
      await dispatch(
        editTask({
          taskId: editingTaskId,
          dto: {
            title: trimmedTitle,
            description: trimmedDescription,
          },
        }),
      ).unwrap();

      if (projectId) {
        dispatch(getProjectTasks(projectId));
      }

      handleCloseEditModal();
      
    } catch {
      setEditTaskError("Failed to update task.");
    }
  };

  const handleTaskDrop = async (targetStatus: ProjectTaskStatus) => {
    if (!draggedTaskId) return;

    const draggedTask = tasks.find((task) => task.id === draggedTaskId);

    setDraggedTaskId(null);
    setDragOverStatus(null);

    if (!draggedTask || draggedTask.status === targetStatus) return;

    try {
      await dispatch(
        updateProjectTaskStatus({
          taskId: draggedTask.id,
          status: targetStatus,
        }),
      ).unwrap();
    } catch {
      // Redux error message will be shown in the UI.
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!isConfirmed) return;

    try {
      await dispatch(removeTask(taskId)).unwrap();
      dispatch(removeProjectTask(taskId));
    } catch {
      alert("Failed to delete task");
    }
  };

  const handleDeleteProject = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!isConfirmed || !projectId) return;

    try {
      await dispatch(deleteProject(projectId)).unwrap();
      navigate("/projects");
    } catch {
      // Error is shown from Redux state
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Project details
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
                {project.title}
              </h1>
            </div>

            <div className="flex gap-3">
              <Button type="button" onClick={handleOpenEditProjectModal}>
                Edit project
              </Button>

              <Button
                type="button"
                onClick={handleDeleteProject}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete project"}
              </Button>
            </div>
          </div>

          {deleteProjectErrorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {deleteProjectErrorMessage}
            </div>
          )}

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
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            Create task
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            The created task will be attached to the current project.
          </p>
        </div>

        <form onSubmit={handleCreateTask} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="task-title"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Title
            </label>

            <Input
              id="task-title"
              value={taskTitle}
              onChange={(event) => {
                setTaskTitle(event.target.value);
                setTaskTitleError("");
              }}
              placeholder="Enter task title"
              error={taskTitleError}
              disabled={isCreatingTask}
            />
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <Textarea
              id="task-description"
              value={taskDescription}
              onChange={(event) => setTaskDescription(event.target.value)}
              placeholder="Enter task description"
              rows={4}
              disabled={isCreatingTask}
            />
          </div>

          {createTaskErrorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {createTaskErrorMessage}
            </div>
          )}

          <Button type="submit" disabled={isCreatingTask}>
            {isCreatingTask ? "Creating..." : "Create task"}
          </Button>
        </form>
      </section>

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
          <div className="mt-5 space-y-4">
            {updateTaskStatusErrorMessage && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {updateTaskStatusErrorMessage}
              </div>
            )}

            {isUpdatingTaskStatus && (
              <div className="rounded-lg border border-purple-100 bg-purple-50 p-3 text-sm text-purple-700">
                Updating task status...
              </div>
            )}

            <div className="overflow-x-auto pb-2">
              <div className="grid min-w-[1100px] grid-cols-5 gap-4">
                {taskStatusColumns.map((status) => {
                  const columnTasks = tasks.filter(
                    (task) => task.status === status,
                  );
                  const isDragOver = dragOverStatus === status;

                  return (
                    <section
                      key={status}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setDragOverStatus(status);
                      }}
                      onDragLeave={() => setDragOverStatus(null)}
                      onDrop={() => handleTaskDrop(status)}
                      className={`min-h-[260px] rounded-xl border p-3 transition ${isDragOver
                        ? "border-purple-300 bg-purple-50"
                        : "border-gray-200 bg-gray-50"
                        }`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {taskStatusLabels[status]}
                        </h3>

                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-500">
                          {columnTasks.length}
                        </span>
                      </div>

                      {columnTasks.length === 0 ? (
                        <div className="flex min-h-[170px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white/70 p-4 text-center text-sm text-gray-400">
                          Drop tasks here
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {columnTasks.map((task) => (
                            <article
                              key={task.id}
                              draggable
                              onDragStart={() => setDraggedTaskId(task.id)}
                              onDragEnd={() => {
                                setDraggedTaskId(null);
                                setDragOverStatus(null);
                              }}
                              className="cursor-grab rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition hover:border-purple-200 hover:shadow-md active:cursor-grabbing"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {task.title}
                                </h4>

                                <div className="flex shrink-0 items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenEditModal(
                                        task.id,
                                        task.title,
                                        task.description,
                                      )
                                    }
                                    className="text-xs font-medium text-purple-600 transition hover:text-purple-700"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="text-xs font-medium text-red-600 transition hover:text-red-700"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>

                              <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
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
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {isEditProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900">Edit project</h2>

            <form onSubmit={handleEditProject} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title
                </label>

                <Input
                  value={editProjectTitle}
                  onChange={(event) => {
                    setEditProjectTitle(event.target.value);
                    setEditProjectError("");
                  }}
                  placeholder="Enter project title"
                  disabled={isUpdatingProject}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <Textarea
                  value={editProjectDescription}
                  onChange={(event) => setEditProjectDescription(event.target.value)}
                  rows={4}
                  placeholder="Enter project description"
                  disabled={isUpdatingProject}
                />
              </div>

              {(editProjectError || updateProjectErrorMessage) && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {editProjectError || updateProjectErrorMessage}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseEditProjectModal}
                  disabled={isUpdatingProject}
                  className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <Button type="submit" disabled={isUpdatingProject}>
                  {isUpdatingProject ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900">Edit task</h2>

            <form onSubmit={handleEditTask} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title
                </label>

                <Input
                  value={editTaskTitle}
                  onChange={(event) => {
                    setEditTaskTitle(event.target.value);
                    setEditTaskError("");
                  }}
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <Textarea
                  value={editTaskDescription}
                  onChange={(event) =>
                    setEditTaskDescription(event.target.value)
                  }
                  rows={4}
                  placeholder="Enter task description"
                />
              </div>

              {editTaskError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {editTaskError}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
