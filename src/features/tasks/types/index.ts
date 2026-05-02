export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export type CreateTaskDto = Omit<Task, "id">;

export type UpdateTaskDto = Partial<Omit<Task, "id" | "projectId">>;

export interface TasksSliceState {
  tasks: Task[];
  isLoading: boolean;
  errorMessage?: string;
}