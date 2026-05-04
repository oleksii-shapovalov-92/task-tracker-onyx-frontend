export interface Project {
  id: string;
  title: string;
  description: string;
  owner?: {
    id: string;
    email: string;
  };
}

// DTO without id, because backend generates project id
export type CreateProjectDto = Omit<Project, "id" | "owner">;

export interface ProjectsSliceState {
  projects: Project[];

  selectedProject?: Project;

  isLoading: boolean;
  errorMessage?: string;

  isSelectedProjectLoading: boolean;
  selectedProjectErrorMessage?: string;

  isCreating: boolean;
  createProjectErrorMessage?: string;
}
