export interface Project {
  id: string;
  title: string;
  description: string;
  owner?: {
    id: string;
    email: string;
  };
}

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  executors?: Array<{
    id: string;
    email?: string;
    name?: string;
  }>;
}

// DTO without id, because backend generates project id
export type CreateProjectDto = Omit<Project, "id" | "owner">;

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
}
