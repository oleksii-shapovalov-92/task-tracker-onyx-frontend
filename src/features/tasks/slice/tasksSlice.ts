import { createAppSlice } from "../../../app/createAppSlice";
import type {
  CreateTaskDto,
  Task,
  TasksSliceState,
  TaskStatus,
  UpdateTaskDto,
} from "../types";
import * as api from "../services/api";
import { isAxiosError } from "axios";

const initialState: TasksSliceState = {
  tasks: [],
  isLoading: false,
  errorMessage: "",
};


export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState,
  reducers: (create) => ({
    getTasksByProjectId: create.asyncThunk(
      async (projectId: string) => {
        return api.fetchTasksByProjectId(projectId);
      },
      {
        pending: (state) => {
          state.isLoading = true;
          state.errorMessage = "";
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          state.tasks = action.payload;
        },
        rejected: (state, action) => {
          state.isLoading = false;
          state.tasks = [];
          state.errorMessage = action.error.message;
        },
      }
    ),

    addTask: create.asyncThunk(
      async (dto: CreateTaskDto) => {
        return api.createTask(dto);
      },
      {
        pending: (state) => {
          state.isLoading = true;
          state.errorMessage = "";
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          state.tasks.push(action.payload);
        },
        rejected: (state, action) => {
          state.isLoading = false;
          state.errorMessage = action.error.message;
        },
      }
    ),

    editTask: create.asyncThunk(
      async ({ taskId, dto }: { taskId: string; dto: UpdateTaskDto }) => {
        return api.updateTask(taskId, dto);
      },
      {
        pending: (state) => {
          state.isLoading = true;
          state.errorMessage = "";
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          const updatedTask = action.payload as Task;
          const index = state.tasks.findIndex((task) => task.id === updatedTask.id);

          if (index !== -1) {
            state.tasks[index] = updatedTask;
          }
        },
        rejected: (state, action) => {
          state.isLoading = false;
          state.errorMessage = action.error.message;
        },
      }
    ),

    changeTaskStatus: create.asyncThunk(
      async ({ taskId, status }: { taskId: string; status: TaskStatus }) => {
        return api.updateTaskStatus(taskId, status);
      },
      {
        pending: (state) => {
          state.isLoading = true;
          state.errorMessage = "";
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          const updatedTask = action.payload as Task;
          const index = state.tasks.findIndex((task) => task.id === updatedTask.id);

          if (index !== -1) {
            state.tasks[index] = updatedTask;
          }
        },
        rejected: (state, action) => {
          state.isLoading = false;
          state.errorMessage = action.error.message;
        },
      }
    ),

    removeTask: create.asyncThunk(
      async (taskId: string) => {
        await api.deleteTask(taskId);
        return taskId;
      },
      {
        pending: (state) => {
          state.isLoading = true;
          state.errorMessage = "";
        },
        fulfilled: (state, action) => {
          state.isLoading = false;
          state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        },
        rejected: (state, action) => {
          state.isLoading = false;
          state.errorMessage = action.error.message;
        },
      }
    ),

    clearTasksError: create.reducer((state) => {
      state.errorMessage = "";
    }),
  }),

  selectors: {
    selectTasks: (state) => state.tasks,
    selectTasksIsLoading: (state) => state.isLoading,
    selectTasksErrorMessage: (state) => state.errorMessage,
  },
});

export const {
  getTasksByProjectId,
  addTask,
  editTask,
  changeTaskStatus,
  removeTask,
  clearTasksError,
} = tasksSlice.actions;

export const {
  selectTasks,
  selectTasksIsLoading,
  selectTasksErrorMessage,
} = tasksSlice.selectors;