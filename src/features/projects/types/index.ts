export interface Project {
  id: string;
  title: string;
  description: string;
  owner?: {
    id: string;
    email: string;
  };
}

export type ProjectTaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "BLOCKED"
  | "DONE";

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  status: ProjectTaskStatus;
  executors?: Array<{
    id: string;
    email?: string;
    name?: string;
  }>;
}

// DTO without id, because backend generates project id
export type CreateProjectDto = Omit<Project, "id" | "owner">;

export type ProjectUpdateDto = Partial<
  Pick<Project, "title" | "description">
>;

export interface CreateProjectTaskDto {
  title: string;
  description?: string;
  projectId: string;
}

export interface ProjectsSliceState {
  projects: Project[];

  selectedProject?: Project;
  selectedProjectTasks: ProjectTask[];

  isLoading: boolean;
  errorMessage?: string;

  isSelectedProjectLoading: boolean;
  selectedProjectErrorMessage?: string;

  isSelectedProjectTasksLoading: boolean;
  selectedProjectTasksErrorMessage?: string;

  isCreating: boolean;
  createProjectErrorMessage?: string;

  isDeleting: boolean;
  deleteProjectErrorMessage?: string;
  
  isUpdatingProject: boolean;
  updateProjectErrorMessage?: string;

  isCreatingTask: boolean;
  createProjectTaskErrorMessage?: string;

  isUpdatingTaskStatus: boolean;
  updateTaskStatusErrorMessage?: string;
}
