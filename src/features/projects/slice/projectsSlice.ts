import { isAxiosError } from "axios";
import { createAppSlice } from "../../../app/createAppSlice";
import type { CreateProjectDto, ProjectsSliceState } from "../types";
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
};

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallbackMessage;
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
  },
});

export const {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectTasks,
  removeProjectTask,
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
} = projectsSlice.selectors;
