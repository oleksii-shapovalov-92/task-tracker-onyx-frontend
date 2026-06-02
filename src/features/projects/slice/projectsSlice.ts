import { isAxiosError } from "axios";
import { createAppSlice } from "../../../app/createAppSlice";
import type {
  CreateProjectDto,
  CreateProjectTaskDto,
  ProjectTaskStatus,
  ProjectsSliceState,
} from "../types";
import * as api from "../services/api";

const initialState: ProjectsSliceState = {
  projects: [],

  selectedProject: undefined,
  selectedProjectTasks: [],

  isLoading: false,
  errorMessage: "",

  isSelectedProjectLoading: false,
  selectedProjectErrorMessage: "",

  isSelectedProjectTasksLoading: false,
  selectedProjectTasksErrorMessage: "",

  isCreating: false,
  createProjectErrorMessage: "",

  isDeleting: false,
  deleteProjectErrorMessage: "",

  isUpdatingTaskStatus: false,
  updateTaskStatusErrorMessage: "",

  isCreatingTask: false,
  createProjectTaskErrorMessage: "",
};

type ApiValidationError = {
  field: string;
  messages: string[];
};

type ApiErrorResponse = {
  message?: string;
  errors?: ApiValidationError[];
};

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const validationMessage = error.response?.data.errors
      ?.map(({ field, messages }) => `${field}: ${messages.join(", ")}`)
      .join("; ");

    return validationMessage || error.response?.data.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
};

export const projectsSlice = createAppSlice({
  name: "projects",
  initialState,
  reducers: (create) => ({
    getAllProjects: create.asyncThunk(
      async () => {
        try {
          return await api.fetchProjects();
        } catch (error) {
          throw new Error(getErrorMessage(error, "Failed to load projects"));
        }
      },
      {
        pending: (state) => {
          state.isLoading = true;
          state.errorMessage = "";
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          state.projects = action.payload;
          state.errorMessage = "";
        },
        rejected: (state, action) => {
          state.isLoading = false;
          state.projects = [];
          state.errorMessage =
            action.error.message || "Failed to load projects";
        },
      },
    ),

    getProjectById: create.asyncThunk(
      async (projectId: string) => {
        try {
          return await api.fetchProjectById(projectId);
        } catch (error) {
          throw new Error(getErrorMessage(error, "Failed to load project"));
        }
      },
      {
        pending: (state) => {
          state.isSelectedProjectLoading = true;
          state.selectedProject = undefined;
          state.selectedProjectErrorMessage = "";
        },
        fulfilled: (state, action) => {
          state.isSelectedProjectLoading = false;
          state.selectedProject = action.payload;
          state.selectedProjectErrorMessage = "";
        },
        rejected: (state, action) => {
          state.isSelectedProjectLoading = false;
          state.selectedProject = undefined;
          state.selectedProjectErrorMessage =
            action.error.message || "Failed to load project";
        },
      },
    ),

    getProjectTasks: create.asyncThunk(
      async (projectId: string) => {
        try {
          return await api.fetchProjectTasks(projectId);
        } catch (error) {
          throw new Error(
            getErrorMessage(error, "Failed to load project tasks"),
          );
        }
      },
      {
        pending: (state) => {
          state.isSelectedProjectTasksLoading = true;
          state.selectedProjectTasks = [];
          state.selectedProjectTasksErrorMessage = "";
        },
        fulfilled: (state, action) => {
          state.isSelectedProjectTasksLoading = false;
          state.selectedProjectTasks = action.payload;
          state.selectedProjectTasksErrorMessage = "";
        },
        rejected: (state, action) => {
          state.isSelectedProjectTasksLoading = false;
          state.selectedProjectTasks = [];
          state.selectedProjectTasksErrorMessage =
            action.error.message || "Failed to load project tasks";
        },
      },
    ),
    removeProjectTask: create.reducer<string>((state, action) => {
      state.selectedProjectTasks = state.selectedProjectTasks.filter(
        (task) => task.id !== action.payload,
      );
    }),

    createProjectTask: create.asyncThunk(
      async (dto: CreateProjectTaskDto) => {
        try {
          return await api.fetchCreateProjectTask(dto);
        } catch (error) {
          throw new Error(
            getErrorMessage(error, "Failed to create project task"),
          );
        }
      },
      {
        pending: (state) => {
          state.isCreatingTask = true;
          state.createProjectTaskErrorMessage = "";
        },
        fulfilled: (state, action) => {
          state.isCreatingTask = false;
          state.selectedProjectTasks.unshift(action.payload);
          state.createProjectTaskErrorMessage = "";
        },
        rejected: (state, action) => {
          state.isCreatingTask = false;
          state.createProjectTaskErrorMessage =
            action.error.message || "Failed to create project task";
        },
      },
    ),

    updateProjectTaskStatus: create.asyncThunk(
      async ({
        taskId,
        status,
      }: {
        taskId: string;
        status: ProjectTaskStatus;
      }) => {
        return api.fetchUpdateProjectTaskStatus(taskId, status);
      },
      {
        pending: (state) => {
          state.isUpdatingTaskStatus = true;
          state.updateTaskStatusErrorMessage = "";
        },
        fulfilled: (state, action) => {
          state.isUpdatingTaskStatus = false;

          const updatedTask = action.payload;
          const index = state.selectedProjectTasks.findIndex(
            (task) => task.id === updatedTask.id,
          );

          if (index !== -1) {
            state.selectedProjectTasks[index] = updatedTask;
          }
        },
        rejected: (state, action) => {
          state.isUpdatingTaskStatus = false;
          state.updateTaskStatusErrorMessage =
            action.error.message || "Failed to update task status.";
        },
      },
    ),

    createProject: create.asyncThunk(

      async (dto: CreateProjectDto) => {
        try {
          return await api.fetchCreateProject(dto);
        } catch (error) {
          throw new Error(getErrorMessage(error, "Failed to create project"));
        }
      },

      {
        pending: (state) => {
          state.isCreating = true;
          state.createProjectErrorMessage = "";
        },
        fulfilled: (state, action) => {
          state.isCreating = false;
          state.projects.push(action.payload);
          state.createProjectErrorMessage = "";
        },
        rejected: (state, action) => {
          state.isCreating = false;
          state.createProjectErrorMessage =
            action.error.message || "Failed to create project";
        },
      },
    ),
    deleteProject: create.asyncThunk(
      async (projectId: string) => {
        try {
          await api.fetchDeleteProject(projectId);
          return projectId;
        } catch (error) {
          throw new Error(getErrorMessage(error, "Failed to delete project"));
        }
      },
      {
        pending: (state) => {
          state.isDeleting = true;
          state.deleteProjectErrorMessage = "";
        },
        fulfilled: (state, action) => {
          state.isDeleting = false;
          state.projects = state.projects.filter(
            (project) => project.id !== action.payload,
          );
          state.deleteProjectErrorMessage = "";
        },
        rejected: (state, action) => {
          state.isDeleting = false;
          state.deleteProjectErrorMessage =
            action.error.message || "Failed to delete project";
        },
      },
    ),
  }),



  selectors: {
    selectProjects: (state) => state.projects,

    selectIsLoading: (state) => state.isLoading,
    selectErrorMessage: (state) => state.errorMessage,

    selectSelectedProject: (state) => state.selectedProject,
    selectIsSelectedProjectLoading: (state) => state.isSelectedProjectLoading,
    selectSelectedProjectErrorMessage: (state) =>
      state.selectedProjectErrorMessage,

    selectSelectedProjectTasks: (state) => state.selectedProjectTasks,
    selectIsSelectedProjectTasksLoading: (state) =>
      state.isSelectedProjectTasksLoading,
    selectSelectedProjectTasksErrorMessage: (state) =>
      state.selectedProjectTasksErrorMessage,

    selectIsCreating: (state) => state.isCreating,
    selectCreateProjectErrorMessage: (state) => state.createProjectErrorMessage,

    selectIsDeleting: (state) => state.isDeleting,
    selectDeleteProjectErrorMessage: (state) => state.deleteProjectErrorMessage,

    selectIsCreatingTask: (state) => state.isCreatingTask,
    selectCreateProjectTaskErrorMessage: (state) =>
      state.createProjectTaskErrorMessage,

    selectIsUpdatingTaskStatus: (state) => state.isUpdatingTaskStatus,
    selectUpdateTaskStatusErrorMessage: (state) =>
      state.updateTaskStatusErrorMessage,
  },
});

export const {
  createProject,
  createProjectTask,
  deleteProject,
  getAllProjects,
  getProjectById,
  getProjectTasks,
  removeProjectTask,
  updateProjectTaskStatus,
} = projectsSlice.actions;

export const {
  selectProjects,

  selectIsLoading,
  selectErrorMessage,

  selectSelectedProject,
  selectIsSelectedProjectLoading,
  selectSelectedProjectErrorMessage,

  selectSelectedProjectTasks,
  selectIsSelectedProjectTasksLoading,
  selectSelectedProjectTasksErrorMessage,

  selectIsCreating,
  selectCreateProjectErrorMessage,

  selectIsDeleting,
  selectDeleteProjectErrorMessage,

  selectIsCreatingTask,
  selectCreateProjectTaskErrorMessage,

  selectIsUpdatingTaskStatus,
  selectUpdateTaskStatusErrorMessage,
} = projectsSlice.selectors;
